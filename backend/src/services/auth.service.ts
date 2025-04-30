
import bcrypt from "bcryptjs"
import AuthRepo from "../repo/auth.repo";
import pool from "../config/db";
import { RoleNames } from "../utils/RoleNames";
import jwt from "jsonwebtoken"
import userRepo from "../repo/user.repo";
import speakeasy from 'speakeasy'
import qrCode from 'qrcode'
import { authenticate } from "passport";
import {conflictResponse, createdResponse, errorResponse, notFoundResponse, successResponse, unauthorizedResponse, validationErrorResponse } from "../utils/response";
import { NextFunction, Response,Request } from "express";
import { UserWithMFA } from "../Types/authType";




class AuthService { 

    register = async (req: Request,res: Response,next: NextFunction) => {
        const client = await pool.connect();
        try{
            client.query("BEGIN");
            const { name,password, phone_number} = req.body;
            const role = "Patient"

            // check exist user by contact number
            const isExistUser = await AuthRepo.checkExistUser(client, phone_number);
            console.log(isExistUser, "isExistUser")

            if (isExistUser) {
                return conflictResponse(res, "User already exists");
              }

            // generate username
            const login_slug = `${name}_${Date.now()}`;

            if (!RoleNames.includes(role)) {
                return {

                  message: "Invalid role",
                };
              }

            if(!phone_number || !password){

                return validationErrorResponse(res, "phone_number and password are required")
                
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

            return createdResponse(res, { ...newUser, patientid }, "User registered successfully");
        
    
        }catch(err){
            await client.query("ROLLBACK");
            console.log(err)
            throw err;
        }finally{
            client.release();
        }
       
        
    }
    login = async (req: Request,res: Response,next: NextFunction) => {
        // const client = await pool.connect();
        // const { phone_number, password } = req.body;
        // try {
        //     const user = await AuthRepo.checkExistUser(client, phone_number);
        //     if (!user) {
        //         return notFoundResponse(res, "User not found");
        //     }
    
        //     const isMatch = await bcrypt.compare(password, user.password);
        //     if (!isMatch) {
        //         return notFoundResponse(res, "Invalid credentials");
        //     }
        //     console.log("user", user)
    
        //     // if(user.is_mfa_active){
        //     //     const secret = user.two_factor_secret;
        //     //     const otp = speakeasy.totp({
        //     //         secret: secret,
        //     //         encoding: "base32"
        //     //     });
        //     //     console.log("otp", otp)
    
        //     //     // req.session.pending_2fa = {
        //     //     //     id: user.id
        //     //     // }
                
        //     //     // todo: for mobile app, send otp to user phone number
        //     //     // await sendOtp(otp, user.phone_number);
    
        //     //    return successResponse(res, { otp }, "2FA OTP sent successfully");
        //     // } else {
        //         const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1d" });

        //         // res.cookie("token", token, {
        //         //     httpOnly: true,  // Can't be accessed via JavaScript
        //         //     // secure: process.env.NODE_ENV === "production", // Only for HTTPS
        //         //     // sameSite: "Strict", // CSRF protection
        //         //     maxAge: 24 * 60 * 60 * 1000, // Optional: set expiration time for the cookie
        //         //   });
    
        //         return successResponse(res, {
        //                 id: user.id,
        //                 name: user.name,
        //                 phone_number: user.phone_number,
        //                 role: user.role,
        //                 is_mfa_active: user.is_mfa_active,
        //                 token: token,

        //         }, "User logged in successfully");
        //     // }

        const client = await pool.connect();

        try{
            // const user = req.user as any;

            const userDetails = await AuthRepo.userDetails(client, (req.user as UserWithMFA).id);
            console.log(userDetails, "userDetails") 

    // const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1d" });

    return successResponse(res, {
        authenticate: req.isAuthenticated(),
        id: (req.user as UserWithMFA).id,
        role: (req.user as UserWithMFA).role,
        is_mfa_active: (req.user as UserWithMFA).is_mfa_active,
        name: userDetails.name,
        phone_number: userDetails.phone_number,
        personalId: userDetails.personalid
    }, "User logged in successfully");
    
        } catch (err) {
            console.log(err);
            throw err;
        } finally {
            client.release();
        }
    };
    status = async (req: Request, res: Response, next: NextFunction) => {
        
        const client = await pool.connect();
        try{
            console.log("the req user is",req.user)

        
        if (!req.user) {
            return unauthorizedResponse(res, "Unauthorized user");
        }

        const userDetails = await AuthRepo.userDetails(client, (req.user as UserWithMFA).id);
        console.log(userDetails, "userDetails") 

        return successResponse(res, {
            authenticate: req.isAuthenticated(),
            id: (req.user as UserWithMFA).id,
            role: (req.user as UserWithMFA).role,
            is_mfa_active: (req.user as UserWithMFA).is_mfa_active,
            name: userDetails.name,
            phone_number: userDetails.phone_number,
            personalId: userDetails.personalid
        }, "User status");
    }catch(err){
        console.log(err)
        next(err);
    }finally{

        client.release();
    }
    }
    setup2fa = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const client = await pool.connect();
            console.log("the req user is",req.user)
            if (!req.user) {
                return unauthorizedResponse(res, "Unauthorized user");
            }
            const user = req.user;
            var secret = speakeasy.generateSecret();
            // update the twoFactorSecrect in db
            await AuthRepo.update2faSecret(client,{id:(user as UserWithMFA).id, secret:secret.base32, is_mfa_active:true});
            const url = speakeasy.otpauthURL({
                secret: secret.base32,
                label: `${(user as UserWithMFA).id}`,
                issuer: "Medx",
                encoding: "base32"
            })
            const qrImageUrl = await qrCode.toDataURL(url);
            return successResponse(res, { secret: secret.base32, qrImageUrl }, "2FA setup successful");

        }catch(err){
            console.log(err)
            throw err;
        }
    }
    verify2fa = async (req: Request, res: Response, next: NextFunction) => {
        try{    
            const user = req.user;
            const { token } = req.body;
            console.log("token", token)
            console.log("sue", user)

            const isValid = speakeasy.totp.verify({
                secret: (user as any).two_factor_secret,
                encoding: "base32",
                token,
                window: 2
            });
            console.log(isValid, "isValid")
            if (isValid) {
            //    const jwtToken = jwt.sign({ id: (user as UserWithMFA).id, role: (user as UserWithMFA).role }, process.env.JWT_SECRET!, { expiresIn: "1d" });
                return successResponse(res, {
                    authenticate: true,
                    user: {
                        id: (user as UserWithMFA).id,
                    role: (user as UserWithMFA).role,
                    is_mfa_active: (user as UserWithMFA).is_mfa_active
                    }
                }, "2FA verified successfully");
            } else {
                return validationErrorResponse(res, "Invalid 2FA token");
            }    
        }catch(err){
            console.log(err)
            throw err;
            
        }
    }
    reset2fa = async (req: Request, res: Response, next: NextFunction) => {
        try{
            if (!req.user) {
                return unauthorizedResponse(res, "Unauthorized user");
            }
            const user = req.user;
            const client = await pool.connect();
            await AuthRepo.update2faSecret(client,{id:(user as UserWithMFA).id, secret:null, is_mfa_active:false});
            return successResponse(res, null, "2FA reset successfully");
        }catch(err){
            console.log(err)
            throw err;
        }
    }
    logout = async (req: any,res: any, next: any) => {
        if (!req.user) {
            return unauthorizedResponse(res, "Unauthorized user");
        }
        const result = req.logout((error: any) => { 
            if (error) {
                console.log(error);
                return errorResponse(res, error);
            }
            return successResponse(res, result, "User logged out successfully")
        });
    };

    changePassword = async (req: Request, res: Response, next: NextFunction) => {
        const client = await pool.connect();
        try {
            const { oldPassword, newPassword } = req.body;
            const user = req.user;

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const result = await AuthRepo.updatePassword(client, { id: (user as UserWithMFA).id, newPassword:hashedPassword });
            return successResponse(res, result, "Password updated successfully");
        } catch (err) {
            console.log(err);
            throw err;
        } finally {
            client.release();
        }
    };

    forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        const client = await pool.connect();
        try {
            const { phone_number } = req.body;

            const user = await AuthRepo.checkExistUser(client, phone_number);
            if (!user) {
                return notFoundResponse(res, "User not found");
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
            const expiry = Date.now() + 5 * 60 * 1000; // 5 mins

            // Save OTP and expiry to the database
            await AuthRepo.saveOtp(client, { phone_number, otp, expiry });
            // Send OTP to the user's phone number

            console.log("OTP sent to user:", otp);


            return successResponse(res, { otp, expiry }, "OTP sent successfully");
        } catch (err) {
            console.log(err);
            throw err;
        } finally {
            client.release();
        }
    };

    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        const client = await pool.connect();
        try {
            const { phone_number, otp, newPassword } = req.body;

            let hashedPassword;

            const user = await AuthRepo.checkExistUser(client, phone_number);
            if (!user) {
                return notFoundResponse(res, "User not found");
            }
            if(!user.is_first_logged_in){

               hashedPassword = await bcrypt.hash(newPassword, 10);

            }else{
                if (Date.now() > parseInt(user.otp_expiry)) {
                    return errorResponse(res, "OTP expired");
                  }
    
                  if (user.otp !== otp) {
                    console.log("user otp", user.otp)
                    console.log("otp", otp)
                    console.log("otp expired", user.otp_expiry)
                    return errorResponse(res, "Invalid OTP");
                  }

                   hashedPassword = await bcrypt.hash(newPassword, 10);
            }
            

           
          
             
            const result = await AuthRepo.resetPassword(client, { phone_number, otp: null,expiry: null, hashedPassword });
            return successResponse(res, result, "Password reset successfully");
        } catch (err) {
            console.log(err);
            throw err;
        } finally {
            client.release();
        }
    };
}

export default new AuthService();


