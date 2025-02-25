import app from "./app";
import dotenv from "dotenv";

dotenv.config();



const port = process.env.SERVER_PORT || 3007;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
