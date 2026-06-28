import axios from "axios";
import { findMedicineByName, createUserActivity } from "../Models/db_queries.js";

export async function medi_info_handler(req, res, next) {
    const query = req.query.q;
    if (!query || !query.trim()) {
        return res.status(400).json({ error: "Please enter a valid name" });
    }

    const searchTerm = query.trim();

    try {
        const activity_record_text = `Searched for  medicine ${query}`;
        await createUserActivity(req.user.id, "medicine general use", activity_record_text);
    } catch (activityErr) {
        const err= new Error("failed to insert user activity (med info)",activityErr.message);
        err.status=400;
        return next(err);
    }

    try {
        // local Db
        let dbResult = null;
        try {
            dbResult = await findMedicineByName(searchTerm);
        } catch (dbErr) {
            const err = new Error("Failed to query medicines table");
            err.statusCode = 400;
            return next(err);
        }

        // found
        if (dbResult) {
            return res.status(200).json({
                name: dbResult.name,
                price: dbResult.price,
                manufacturer_name: dbResult.manufacturer_name,
                general_use: dbResult.general_use,
                side_effects: dbResult.side_effects
            });
        }

        // external api
        const apiKey = process.env.OPENFDA_API_KEY;
        const openFdaUrl = `https://api.fda.gov/drug/label.json?api_key=${apiKey}&search=openfda.brand_name:"${encodeURIComponent(searchTerm)}"&limit=1`;

        try {
            const apiRes = await axios.get(openFdaUrl);
            const data = apiRes.data?.results?.[0];
            if (data) {
                const info = {
                    name: data.openfda?.brand_name?.[0] || searchTerm,
                    price: "Not available",
                    manufacturer_name: data.openfda?.manufacturer_name?.[0] || "Not available",
                    general_use: data.indications_and_usage?.[0] || "Not available",
                    side_effects: data.adverse_reactions?.[0] || data.warnings?.[0] || "Not available"
                };
                return res.status(200).json(info);
            }
        } catch (apiErr) {
            const err = new Error("Failed to query OpenFDA API");
            err.statusCode = 400;
            return next(err);
        }

        // not found
        const err = new Error("Medicine not found on our Database");
        err.statusCode = 400;
        return next(err);

    } catch (error) {
        next(error);
    }
}