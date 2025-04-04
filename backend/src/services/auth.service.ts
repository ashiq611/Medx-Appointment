
import bcrypt from "bcryptjs"
import AuthRepo from "../repo/auth.repo";
import pool from "../config/db";
import { RoleNames } from "../utils/RoleNames";
import jwt from "jsonwebtoken"
import userRepo from "../repo/user.repo";
import speakeasy from 'speakeasy'
import qrCode from 'qrcode'
import { authenticate } from "passport";




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

            if(!req.user){
                return {
                    message: "Unauthorized user"
                };
            }
            

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
    status = async (req: any) => {
        if (!req.user) {
            return {
                message: "Unauthorized user"
            };
        }
        return {
            authenticate: req.isAuthenticated(),
            id: req.user.id,
            role: req.user.role,
            is_mfa_active: req.user.is_mfa_active
        };
    }
    setup2fa = async (req: any) => {
        try{
            const client = await pool.connect();
            console.log("the req user is",req.user)
            const user = req.user;
            var secret = speakeasy.generateSecret();
            // update the twoFactorSecrect in db
            await AuthRepo.update2faSecret(client,{id:user.id, secret:secret.base32, is_mfa_active:true});
            const url = speakeasy.otpauthURL({
                secret: secret.base32,
                label: `${req.user.id}`,
                issuer: "Medx",
                encoding: "base32"
            })
            const qrImageUrl = await qrCode.toDataURL(url);
            return {
                message: "2FA setup successful",
                secret: secret.base32,
                qrImageUrl

            }

        }catch(err){
            console.log(err)
            return {
                message: "An error occurred"
            }
        }
    }
    verify2fa = async (req: any) => {
        try{    
            const user = req.user;
            const { token } = req.body;
            const isValid = speakeasy.totp.verify({
                secret: user.two_factor_secret,
                encoding: "base32",
                token
            });
            if (isValid) {
               const jwtToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1d" });
                return {
                    message: "2FA token is valid",
                    token: jwtToken,
                    is_mfa_active: user.is_mfa_active
                };
            } else {
                return {
                    message: "Invalid 2FA token"
                };
            }    
        }catch(err){
            console.log(err)
            return {
                message: "An error occurred",
                error: err  
                }}
    }
    reset2fa = async (req: any) => {
        try{
            const user = req.user;
            const client = await pool.connect();
            await AuthRepo.update2faSecret(client,{id:user.id, secret:null, is_mfa_active:false});
            return {
                message: "2FA reset successful"
            }
        }catch(err){
            console.log(err)
            return {
                message: "An error occurred"
            }
        }
    }
    logout = async (req: any) => {
        if (!req.user) {
            return {
                message: "Unauthorized user"
            };
        }
        req.logout((error: any) => { 
            if (error) {
                console.log(error);
                return {
                    message: "User not logged in" 
                };
            }
            return {
                message: "Logout successful"
            };
        });
    };
}

export default new AuthService();


