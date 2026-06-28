import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import passport from "../../config/Passport_strategies.js";
import { findUserByUsername, createUser, findUserByEmail, completeUserProfileByEmail } from "../Models/db_queries.js";
import { isValidEmail } from "../Services/valid_user_check.js";
import { bloodGroups } from "../../../Frontend/src/components/blood_groups.js";
import logger from "../utils/logger.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";
const saltRounds = 10;

export async function completeProfile(req, res, next) {
    try {
        const { onboardingToken, username, location, pincode, password, bloodGroup } = req.body;

        if (!onboardingToken || !username || !location || !pincode || !password) {
            const error = new Error("All fields except blood group are required");
            error.statusCode = 400;
            return next(error);
        }

        let decoded;
        try {
            decoded = jwt.verify(onboardingToken, JWT_SECRET);
        } catch (err) {
            const error = new Error("Session expired");
            error.statusCode = 401;
            return next(error);
        }

        const { email, name } = decoded;
        if (!isValidEmail(email)) {
            const error = new Error("Invalid email format");
            error.statusCode = 400;
            return next(error);
        }

        const existingUsername = await findUserByUsername(username);
        if (existingUsername && existingUsername.email !== email) {
            const error = new Error("Username is already taken");
            error.statusCode = 400;
            return next(error);
        }

        const password_hash = await bcrypt.hash(password, saltRounds);

        let trust_score = 48.000;
        if (bloodGroup && bloodGroups.includes(bloodGroup)) {
            trust_score = 50.000;
        }

        const existingUser = await findUserByEmail(email);
        const newUser = existingUser
            ? await completeUserProfileByEmail({ email, name, username, password_hash, location, pincode, blood_group: bloodGroup, trust_score })
            : await createUser({ email, name, username, password_hash, location, pincode, blood_group: bloodGroup, trust_score });

        // new token
        const jwtToken = jwt.sign(
            { id: newUser.id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        return res.status(200).json({
            success: true,
            message: "Profile completed and registered successfully",
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                username: newUser.username,
                location: newUser.location,
                pincode: newUser.pincode,
                blood_group: newUser.blood_group
            }
        });
    } catch (err) {
        next(err);
    }
}


export function oauthRedirect(req, res, next) {
    const { provider } = req.params;

    let scope = ["profile"];
    if (provider === "google") {
        scope = ["profile", "email"];
    } else if (provider === "github") {
        scope = ["user:email"];
    }
    // dynamic oauth call
    passport.authenticate(provider, { scope })(req, res, next);
}

export function oauthCallback(req, res, next) {
    const { provider } = req.params;
    // dynamic oauth callback
    passport.authenticate(provider, (err, user, info) => {
        if (err) return next(err);

        const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";

        if (!user) {
            // new user 
            if (info?.message === "onboarding_required") {
                const onboardingToken = jwt.sign(
                    { email: info.email, name: info.name },
                    JWT_SECRET,
                    { expiresIn: "10m" }
                );
                return res.redirect(`${frontendURL}/after-sign-up?token=${onboardingToken}`);
            } else {
                const err = new Error("some thing went wrong please try again later :)");
                logger.error(`error occured while oauth callback, if(!user)`);
                next(err);
            }
        }

        // existing user
        const jwtToken = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "30d" }
        );
        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });
        return res.redirect(`${frontendURL}/home`);
    })(req, res, next);
}

//password login
export async function loginSubmit(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            const error = new Error("Email and password are required");
            error.statusCode = 400;
            return next(error);
        }

        const user = await findUserByEmail(email);
        if (!user) {
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            return next(error);
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            return next(error);
        }

        // new token 
        const jwtToken = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                username: user.username,
                location: user.location,
                pincode: user.pincode,
                blood_group: user.blood_group
            }
        });
    } catch (err) {
        next(err);
    }
}
