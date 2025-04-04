import express from "express";
import initiateRoutes from "./routes/routes";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import "./config/passportConfiq";
import { errorHandler } from "./middlewares/errorHandler";

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
    secret: process.env.JWT_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
    }
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(errorHandler);

// handle error
// app.use((err: any, req: any, res: any, next: any) => {
//   console.log(err);
//   return res.status(500).json({
//     success: false,
//     message: "Internal Server Error",
//   });
// });

// route


initiateRoutes(app);



export default app;
