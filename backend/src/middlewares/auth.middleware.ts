import jwt from "jsonwebtoken";



const verifyToken = (req: any, res: any, next: any) => {
    let token ;
    let authHeader = req.headers.authorization || req.headers.Authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.split(' ')[1];
          if(!token){
            return res.status(401).json({ message: "No token, Unauthorized" });
          }
          try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            if (!decoded || !(decoded as jwt.JwtPayload).userId) {
              return res.status(403).json({ message: "Token payload is invalid" });
            }
            req.user = decoded;
            console.log(req.user, "req.user")

            next();
          }catch(err){
            return res.status(401).json({ message: "Token is not valid" });
          }
    
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
};

export default verifyToken;