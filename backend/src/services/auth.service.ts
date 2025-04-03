
import bcrypt from "bcryptjs"
import AuthRepo from "../repo/auth.repo";
import pool from "../config/db";
import { RoleNames } from "../utils/RoleNames";
import jwt from "jsonwebtoken"
import userRepo from "../repo/user.repo";




class AuthService { 

    register = async (body:any) => {
        const client = await pool.connect();
        try{
            const { name,password, phone_number} = body;
            const role = "Patient"

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
                name,
                login_slug,
                password: hashedPassword,
                role,
                phone_number
            }

           const patient=  await userRepo.createPatient(client,newUser);
           const patientid = patient?.patientid;
           console.log(patientid, "patientid")
    
            await AuthRepo.register(client,{ ...newUser, patientid });
        
    
        }catch(err){
            console.log(err)
        }finally{
            client.release();
        }
       
        
    }
    login = async (req: any) => {
        const client = await pool.connect();
        try {
            // const { phone_number, password } = body;
    
            // if (!phone_number || !password) {
            //     return {
            //         message: "All fields are required"
            //     };
            // }
    
            // const user = await AuthRepo.login(client, { phone_number, password });
    
            // if (!user) {
            //     return {
            //         message: "Invalid username or password"
            //     };
            // }
    
            // // Create the JWT token after successful login
            // const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1d" });
    
            // return {
            //     message: "Login successful",
            //     id: user.id,
            //     name: user.name,
            //     role: user.role,
            //     is_mfa_active: user.is_mfa_active,
            // };
            

            return {
                message: "Login successful",
                id: req.user.id,
                role: req.user.role,
                is_mfa_active: req.user.is_mfa_active
            }
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


