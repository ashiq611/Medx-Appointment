import { Request, Response } from "express"
import bcrypt from "bcryptjs"

const register = (req: Request, res: Response) => {
    const {username, password, role} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = {
        username,
        password: hashedPassword,
        role
    }

    
    res.json({ message: "User registered successfully!" });

}

const login = (req: Request, res : Response) => {
    res.send('login')
}

export { register, login }