import bcrypt from "bcryptjs"

class AuthRepo {
    register = async (client:any,user:any) => {
        try{
         const query = {
             text: "INSERT INTO public.\"User\" (login_slug, password, role, phone_number, patient_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
             values: [user.login_slug, user.password, user.role, user.phone_number, user.patientid],
         };
     
         const responseData = await client.query(query);
         return responseData.rows[0];
     }catch(err){
         console.log(err)
     }
     
         
     }
     login = async (client:any,user:any) => {
        const {phone_number} = user
        // console.log(phone_number, "repo-ph")
        try{
            const query = {
                text: 'SELECT id, password, role, is_mfa_active FROM public."User" WHERE phone_number = $1',
                values: [phone_number],
            };
         const responseData = await client.query(query);
     
          const dbUser = responseData.rows[0];

         return dbUser;
     }catch(err){
         console.log(err)
     }
     }
     checkExistUser = async (client:any,phone_number:any) => {
        try{
            const query = {
                text: 'SELECT id, password, role, is_first_logged_in, otp, otp_expiry FROM public."User" WHERE phone_number = $1',
                values: [phone_number],
            };
         const responseData = await client.query(query);
         return responseData.rows[0];
     }catch(err){
         console.log(err)
     }
     }
     getUserbyID = async (client:any,userid:any) => {
        try{
            const query = {
                text: 'SELECT * FROM public."User" WHERE id = $1',
                values: [userid],
            };
         const responseData = await client.query(query);
         return responseData.rows[0];
     }catch(err){
         console.log(err)
     }
     }
     update2faSecret = async (client:any,data:any) => {
        try{
            const query = {
                text: 'UPDATE public."User" SET two_factor_secret = $1, is_mfa_active = $2 WHERE id = $3',
                values: [data.secret,data.is_mfa_active,data.id],
            };
         const responseData = await client.query(query);
         return responseData.rows[0];
     }catch(err){
         console.log(err)
     }
     }
     updatePassword = async (client:any,data:any) => {
        try{
            const query = {
                text: 'UPDATE public."User" SET password = $1 WHERE id = $2',
                values: [data.newPassword,data.id],
            };
         const responseData = await client.query(query);
         return responseData.rows[0];
     }catch(err){
         console.log(err)
     }
     }
     saveOtp = async (client:any,data:any) => {
        try{
            const query = {
                text: 'UPDATE public."User" SET otp = $1, otp_expiry = $3 WHERE phone_number = $2',
                values: [data.otp,data.phone_number,data.expiry],
            };
         const responseData = await client.query(query);
         return responseData.rows[0];
     }catch(err){
         console.log(err)
     }
     }
     resetPassword = async (client:any,data:any) => {
        try{
            const query = {
                text: 'UPDATE public."User" SET password = $1, otp = $3, otp_expiry = $4 WHERE phone_number = $2',
                values: [data.hashedPassword,data.phone_number, data.otp, data.expiry],
            };
         const responseData = await client.query(query);
         return responseData.rows[0];
     }catch(err){
         console.log(err)
     }
     }
}


export default new AuthRepo()