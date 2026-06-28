import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import { Strategy as AmazonStrategy } from "passport-amazon";
import { Strategy as GitHubStrategy } from "passport-github2";
import { get_email, get_name, isProfileComplete } from "../src/utils/auth_helper.js";
import { findUserByEmail, findUserById } from "../src/Models/db_queries.js";

passport.use("google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = get_email(profile);
        if (!email) {
            return done(null, false, { message: "Google did not return an email address." });
        }
        const user = await findUserByEmail(email);
        if (!isProfileComplete(user)) {
            return done(null, false, {
                message: "onboarding_required",
                email: email,
                name: get_name(profile)
            });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.use("amazon", new AmazonStrategy({
    clientID: process.env.AMAZON_CLIENT_ID,
    clientSecret: process.env.AMAZON_CLIENT_SECRET,
    callbackURL: process.env.AMAZON_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = get_email(profile);
        if (!email) {
            return done(null, false, { message: "Amazon did not return an email address." });
        }
        const user = await findUserByEmail(email);
        if (!isProfileComplete(user)) {
            return done(null, false, {
                message: "onboarding_required",
                email: email,
                name: get_name(profile)
            });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.use("github", new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    scope: ["user:email"],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = get_email(profile);
        if (!email) {
            return done(null, false, { message: "GitHub did not return an email address." });
        }
        const user = await findUserByEmail(email);
        if (!isProfileComplete(user)) {
            return done(null, false, {
                message: "onboarding_required",
                email: email,
                name: get_name(profile)
            });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await findUserById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

export default passport;
