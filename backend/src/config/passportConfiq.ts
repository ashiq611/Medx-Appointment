import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import bcrypt from "bcryptjs";
import pool from "./db";
import authRepo from "../repo/auth.repo";
import { cli } from "winston/lib/winston/config";


passport.use(
    new LocalStrategy(
        {
            usernameField: "phone_number",
            passwordField: "password",
        },
        async (phone_number, password, done) => {
            const client = await pool.connect();
            try {
                const user = await authRepo.login(client, { phone_number });

                if (!user) {
                    console.log("User not found:", phone_number);
                    return done(null, false, { message: "Invalid phone number or password" });
                }
                // console.log(user,"passport user")
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: "Invalid phone number or password" });
                }
            } catch (error) {
                console.error("Passport Error authenticating user:", error);
                console.log(error);
                return done(error);
            } finally {
                client.release();
            }
        }
    )
);

passport.serializeUser((user:any, done) => {
    console.log("we are serializing user", user);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const client = await pool.connect();
    try {
        const user = await authRepo.getUserbyID(client, id);
        console.log("Deserialized user:", user);
        done(null, user);
    } catch (error) {
        console.error("Error during deserialization:", error);
        done(error, null);
    } finally {
        client.release(); // IMPORTANT!
    }
});
