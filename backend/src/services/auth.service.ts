
import bcrypt from "bcryptjs"
import AuthRepo from "../repo/auth.repo";
import pool from "../config/db";
import { RoleNames } from "../utils/RoleNames";
import jwt from "jsonwebtoken"




class AuthService { 

    register = async (body:any) => {
        const client = await pool.connect();
        try{
            const {username, password, role, contactNumber} = body;

            if (!RoleNames.includes(role)) {
                return {

                  message: "Invalid role",
                };
              }

            if(!username || !password){
                return {
                    message: "All fields are required"
                }
            }
            const hashedPassword = bcrypt.hashSync(password, 10);
        
            const newUser = {
                username,
                password: hashedPassword,
                role,
                contactinformation: contactNumber
            }
    
            await AuthRepo.register(client,newUser);
        
    
        }catch(err){
            console.log(err)
        }finally{
            client.release();
        }
       
        
    }
    login = async (body: any) => {
        const client = await pool.connect();
        try {
            const { username, password } = body;
    
            if (!username || !password) {
                return {
                    message: "All fields are required"
                };
            }
    
            const user = await AuthRepo.login(client, { username, password });
    
            if (!user) {
                return {
                    message: "Invalid username or password"
                };
            }
    
            // Create the JWT token after successful login
            const token = jwt.sign({ id: user.userid, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1d" });
    
            return {
                token
            };
        } catch (err) {
            console.log(err);
            return {
                message: "An error occurred"
            };
        } finally {
            client.release();
        }
    };
}

export default new AuthService();


