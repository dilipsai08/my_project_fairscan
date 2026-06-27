import axios from "axios";
import { findMedicineByName } from "../Models/db_queries.js";

export async function medi_info_handler(req, res, next) {
    const query = req.query.q;
    if (!query || !query.trim()) {
        return res.status(400).json({ error: "Please enter a valid name" });
    }

    const searchTerm = query.trim();

    try {
        // 1. Check local DB using db_queries.js
        let dbResult = null;
        try {
            dbResult = await findMedicineByName(searchTerm);
        } catch (dbErr) {
            console.warn("[DB] Failed to query medicines table, falling back to external API:", dbErr.message);
        }

        // 2. Return if found in DB
        if (dbResult) {
            return res.status(200).json({
                name: dbResult.name,
                price: dbResult.price,
                manufacturer_name: dbResult.manufacturer_name,
                general_use: dbResult.general_use,
                side_effects: dbResult.side_effects
            });
        }

        // 3. Not found in DB, try OpenFDA using the API Key from .env
        const apiKey = process.env.OPENFDA_API_KEY;
        const openFdaUrl = `https://api.fda.gov/drug/label.json?api_key=${apiKey}&search=openfda.brand_name:"${encodeURIComponent(searchTerm)}"&limit=1`;
        
        try {
            const apiRes = await axios.get(openFdaUrl);
            const data = apiRes.data?.results?.[0];
            if (data) {
                const info = {
                    name: data.openfda?.brand_name?.[0] || searchTerm,
                    price: "Not available", // OpenFDA does not provide prices
                    manufacturer_name: data.openfda?.manufacturer_name?.[0] || "Not available",
                    general_use: data.indications_and_usage?.[0] || "Not available",
                    side_effects: data.adverse_reactions?.[0] || data.warnings?.[0] || "Not available"
                };
                return res.status(200).json(info);
            }
        } catch (apiErr) {
            console.warn("[API] OpenFDA lookup failed or returned no results:", apiErr.message);
        }

        // 4. Not found in DB or OpenFDA -> return custom message as per requirements
        return res.status(200).json({
            error: "It was not listed in our db we are trying our best to get the info of the requested med or please enter a valid name"
        });

    } catch (error) {
        next(error);
    }
}