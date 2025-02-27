
import bcrypt from "bcryptjs"
import AuthRepo from "../repo/auth.repo";
import pool from "../config/db";




class AuthService { 

    register = async (body:any) => {
        const client = await pool.connect();
        try{
            const {username, password, role, contactNumber} = body;

            if(!username || !password){
                return {
                    success: false,
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
}

export default new AuthService();


