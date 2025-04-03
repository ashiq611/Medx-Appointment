import express, { Request, Response } from "express";
import pool from "./config/db";
import initiateRoutes from "./routes/routes";
import cors from "cors";
import session from "express-session";
import passport from "passport";

const app = express();


// middleware
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
const corsoptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
}

app.use(cors(corsoptions));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
       maxAge: 6000 * 60,
    }
}))

app.use(passport.initialize());
app.use(passport.session());

// route

initiateRoutes(app);



export default app;
