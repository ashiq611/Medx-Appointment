export const isAuthenticated = (req: any, res: any, next: any) => {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.status(401).json({ message: "Unauthorized" });
        }
    };