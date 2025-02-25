import { Router, Request, Response } from "express";

const router = Router();

router.get("/api", (req: Request, res: Response) => {
  res.json({ message: "Hello, this is your API endpoint!" });
});

export default router;
