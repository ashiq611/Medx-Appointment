export const isAuthenticated = (req: any, res: any, next: any) => {
        if (req.isAuthenticated()) {
            console.log("User is authenticated", req.user);
            next();
        } else {
            console.log("User is not authenticated");
            res.status(401).json({ message: "Unauthorized" });
        }
    };