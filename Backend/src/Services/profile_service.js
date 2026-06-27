import * as db_query from "../Models/db_queries.js";

export async function getProfile(req, res, next) {
    try {
        return res.status(200).json({
            success: true,
            profile: {
                name: req.user.name,
                email: req.user.email,
                location: req.user.location,
                joinDate: new Date(req.user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long' }),
                totalContributions: req.user.cntsearch,
                trustScore: `${parseFloat(req.user.trust_score || 0).toFixed(0)}%`,
                estimatedSavingsImpact: req.user.savings
            }
        });
    } catch (err) {
        next(err);
    }
}


export async function getActivity (req, res, next) {
    try {
        const activities = await db_query.getUserActivities(req.user.id);
        const formattedActivities = activities.map(act => ({
            id: act.id,
            description: act.description,
            verified_at: act.created_at
        }));
        return res.status(200).json({
            success: true,
            activities: formattedActivities
        });
    } catch (err) {
        next(err);
    }
}