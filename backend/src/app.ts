import express from "express";
import initiateRoutes from "./routes/routes";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import "./config/passportConfiq";
import { errorHandler } from "./middlewares/errorHandler";
import client from 'prom-client' 
import responseTime from 'response-time';


const app = express();


// prometheus metrics
const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({ register: client.register });

app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', client.register.contentType);
  const metrics = await client.register.metrics();
  // console.log(metrics);
  res.send(metrics);
});

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.5, 1, 2, 5, 10], // Adjust buckets as needed
});

const httpRequestCounter = new client.Counter({
  name: 'http_request_count',
  help: 'Count of HTTP requests',
  labelNames: ['method', 'route', 'code'],
});



app.use(responseTime((req, res, time) => {
  // Increment the counter
  httpRequestCounter.inc()
  httpRequestDurationMicroseconds
  .labels({
    method: req.method,
    route: req.url,
    code: res.statusCode.toString(),
  })
  .observe(time / 1000); // Convert milliseconds to seconds

}));
// end prometheus metrics


// middleware
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
const corsoptions = {
  // origin: "http://localhost:4000",
  origin: function (origin:any, callback:any) {
    // Allow all origins
    callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
}

app.use(cors(corsoptions));

app.use(session({
    secret: process.env.JWT_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV?.toLocaleLowerCase() === "production" ? true : false,
      // sameSite: "none", 
    }
}))

app.set('trust proxy', 1);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

initiateRoutes(app);

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





export default app;
