import * as db_query from "../Models/db_queries.js" 

export async function search_handler (req,res,next){
    try {
        const data = await db_query.findUserByEmail(req.user.email);
        if (!data) {
            const err = new Error("User not found");
            err.statusCode = 404;
            return next(err);
        }

        const trust_score = parseFloat(data.trust_score);
        const test_name = req.body.testName;
        const test_id = await db_query.get_test_id(test_name);
        const pincode = parseInt(req.body.postalCode);
        const price = parseFloat(req.body.userProvidedPrice);


        if (trust_score < 35.000) {
            const err = new Error("You are not allowed to use this service because of your low trust score.");
            err.statusCode = 403;
            return next(err);
        }

        if (!test_id) {
            const err = new Error("Test not found");
            err.statusCode = 404;
            return next(err);
        }

        if (!pincode) {
            const err = new Error("A valid pincode is required.");
            err.statusCode = 400;
            return next(err);
        }

        if (price <= 0) {
            const err = new Error("A valid price is required.");
            err.statusCode = 400;
            return next(err);
        }

        const hospitalTier = req.body.hospitalTier;
        const user_id = data.id;
        let hospitalName = null;

        if (hospitalTier === "Premium") {
            hospitalName = req.body.hospitalName;
        }

        const update = await db_query.updatePrice(test_id.test_id, pincode, price, user_id, hospitalName, hospitalTier);
        if (!update) {
            const err = new Error("Failed to update data");
            err.statusCode = 500;
            return next(err);
        }

        const ans = await db_query.getPrice(test_id.test_id, pincode, hospitalTier);

        let savings = 0;
        let final_savings_str = data.savings || 0;

        if (ans) {
            const curr_price = parseFloat(ans.price);
            if (price < curr_price) {
                savings = curr_price - price;
            }
            
            const user_savings_num = parseFloat(final_savings_str.replace(/[^0-9.-]/g, "")) || 0;
            final_savings_str = `₹${user_savings_num + savings}`;
        }

        const cnt = data.cntsearch || 0;
        const updateuser = await db_query.updateuser(user_id, final_savings_str, cnt + 1);
        if (!updateuser) {
            const err = new Error("Failed to update the user data");
            err.statusCode = 500;
            return next(err);
        }

        try {
            const activity_record_text = `Searched for ${test_name} in ${pincode}`;
            await db_query.createUserActivity(user_id, "search", activity_record_text);
        } catch (activityErr) {
            console.error("Activity logging failed:", activityErr);
        }

        if (ans) {
            return res.status(200).json({
                success: true,
                message: "Data updated successfully",
                data: {
                    city: ans.regionname||ans.divisionname || "Your Area",
                    localPriceRange: `₹${parseFloat(ans.price).toLocaleString('en-IN')}`
                }
            });
        } else {
            const cityName = req.body.city || "Your Area";
            
            return res.status(200).json({
                success: true,
                message: "We don't have data for that test at your location",
                data: {
                    city: cityName,
                    localPriceRange: null
                }
            });
        }
    } catch (err) {
        next(err);
    }
}