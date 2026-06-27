import {getHealthTips} from "../Models/db_queries.js"

export async function health_tips(req,res,next){
   try {
    const data = await getHealthTips();
    return res.status(200).json({tips : data});
   }catch(err){
    return next(err);
   }
}