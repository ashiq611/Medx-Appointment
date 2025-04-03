
import bcrypt from "bcryptjs"
import AuthRepo from "../repo/auth.repo";
import pool from "../config/db";
import { RoleNames } from "../utils/RoleNames";
import jwt from "jsonwebtoken"




class AuthService { 

    register = async (body:any) => {
        const client = await pool.connect();
        try{
            const { password, role, phone_number} = body;

            // check exist user by contact number
            const isExistUser = await AuthRepo.checkExistUser(client, phone_number);

            if (isExistUser) {
                return {
                  message: "User already exists",
                };
              }

            // generate username
            const login_slug = `user_${Date.now()}`;

            if (!RoleNames.includes(role)) {
                return {

                  message: "Invalid role",
                };
              }

            if(!phone_number || !password){
                return {
                    message: "All fields are required"
                }
            }
            const hashedPassword = bcrypt.hashSync(password, 10);
        
            const newUser = {
                login_slug,
                password: hashedPassword,
                role,
                phone_number
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
            const { phone_number, password } = body;
    
            if (!phone_number || !password) {
                return {
                    message: "All fields are required"
                };
            }
    
            const user = await AuthRepo.login(client, { phone_number, password });
    
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


