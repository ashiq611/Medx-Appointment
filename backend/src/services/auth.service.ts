
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
            client.query("BEGIN");
            const { name,password, phone_number} = body;
            const role = "Patient"

            // check exist user by contact number
            const isExistUser = await AuthRepo.checkExistUser(client, phone_number);
            console.log(isExistUser, "isExistUser")

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

            client.query("COMMIT");
        
    
        }catch(err){
            await client.query("ROLLBACK");
            console.log(err)
            throw err;
        }finally{
            client.release();
        }
       
        
    }
    login = async (req: any) => {
        const client = await pool.connect();
        const { phone_number, password } = req.body;
        try {
            const user = await AuthRepo.checkExistUser(client, phone_number);
            if (!user) {
                return {
                    message: "User not found"
                };
            }
    
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return {
                    message: "Invalid phone number or password"
                };
            }
            console.log("user", user)
    
            if(user.is_mfa_active){
                const secret = user.two_factor_secret;
                const otp = speakeasy.totp({
                    secret: secret,
                    encoding: "base32"
                });
                console.log("otp", otp)
    
                req.session.pending_2fa = {
                    id: user.id
                }
                
                // todo: for mobile app, send otp to user phone number
                // await sendOtp(otp, user.phone_number);
    
                return {
                    message: "2FA is enabled, please verify your OTP",
                    otp: otp
                };
            } else {
                const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1d" });
    
                return {
                    id: user.id,
                    role: user.role,
                    is_mfa_active: user.is_mfa_active,
                    token: token
                }
            }
    
        } catch (err) {
            console.log(err);
            throw err;
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
                secret: secret.base32,
                qrImageUrl

            }

        }catch(err){
            console.log(err)
            throw err;
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
            throw err;
            
        }
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
            throw err;
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

    changePassword = async (req: any) => {
        const client = await pool.connect();
        try {
            const { oldPassword, newPassword } = req.body;
            const user = req.user;

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const result = await AuthRepo.updatePassword(client, { id: user.id, newPassword:hashedPassword });
            return {
                message: "Password changed successfully"
            };
        } catch (err) {
            console.log(err);
            throw err;
        } finally {
            client.release();
        }
    };

    forgotPassword = async (req: any) => {
        const client = await pool.connect();
        try {
            const { phone_number } = req.body;

            const user = await AuthRepo.checkExistUser(client, phone_number);
            if (!user) {
                return {
                    message: "User not found"
                };
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
            const expiry = Date.now() + 5 * 60 * 1000; // 5 mins

            // Save OTP and expiry to the database
            await AuthRepo.saveOtp(client, { phone_number, otp, expiry });
            // Send OTP to the user's phone number

            console.log("OTP sent to user:", otp);


            return {
                message: "OTP sent successfully",
                otp: otp,
                expiry: expiry  
            };
        } catch (err) {
            console.log(err);
            throw err;
        } finally {
            client.release();
        }
    };

    resetPassword = async (req: any) => {
        const client = await pool.connect();
        try {
            const { phone_number, otp, newPassword } = req.body;

            let hashedPassword;

            const user = await AuthRepo.checkExistUser(client, phone_number);
            if (!user) {
                return {
                    message: "User not found"
                };
            }
            if(!user.is_first_logged_in){

               hashedPassword = await bcrypt.hash(newPassword, 10);

            }else{
                if (Date.now() > parseInt(user.otp_expiry)) {
                    return {
                        message: "OTP expired"
                    };
                  }
    
                  if (user.otp !== otp) {
                    console.log("user otp", user.otp)
                    console.log("otp", otp)
                    console.log("otp expired", user.otp_expiry)
                    return {
                        message: "Invalid OTP"
                    };
                  }

                   hashedPassword = await bcrypt.hash(newPassword, 10);
            }
            

           
          
             
            const result = await AuthRepo.resetPassword(client, { phone_number, otp: null,expiry: null, hashedPassword });
            return {
                message: "Password reset successfully"
            };
        } catch (err) {
            console.log(err);
            throw err;
        } finally {
            client.release();
        }
    };
}

export default new AuthService();


