import axios from 'axios';

export async function GetLocation(req, res, next) {
    try {
        const { latitude, longitude } = req.query;
        if (!latitude || !longitude) {
            return res.status(400).json({ error: "Latitude and longitude are required" });
        }

        const onposKey = (process.env.ONPOS_API_KEY || "");
        const onposUrl = (process.env.ONPOS_URL || "");

        if (!onposKey || !onposUrl) {
            const err= new Error("api key fro location service is missing");
            err.statusCode=500;
            return next(err);
        }

        const response = await axios.get(`${onposUrl}`, {
            params: { latitude, longitude, localityLanguage: 'en', key: onposKey }
        });

        return res.status(200).json(response.data);
    } catch (error) {
        return next(error);
    }
}