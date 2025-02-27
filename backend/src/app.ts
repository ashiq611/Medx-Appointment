import express, { Request, Response } from "express";
import pool from "./config/db";
import initiateRoutes from "./routes/routes";

const app = express();


// middleware
app.use(express.json());

// route

initiateRoutes(app);

// Example route to fetch data from the database
app.get("/data", async (req: Request, res: Response) => {
    try {
      const result = await pool.query('SELECT * FROM public."User"');
      res.json(result.rows); // Send the rows as JSON response
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).send("Internal Server Error");
    }
  });

// Define a basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express with TypeScript!");
});

export default app;
