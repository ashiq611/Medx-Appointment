import bcrypt from "bcryptjs"
import { RoleNamesEnum } from "../utils/RoleNames";

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
                text: `SELECT 
    u.id,
    u.password,
    u.role,
    u.is_first_logged_in,
    u.is_mfa_active,
    u.phone_number,
    CASE
        WHEN u.role = 'Doctor' THEN d.name
        WHEN u.role = 'Patient' THEN p.name -- Replace with actual column names
        WHEN u.role = 'Admin' THEN a.name   -- Replace with actual column names
        WHEN u.role = 'Receptionist' THEN r.name  -- Replace with actual column names
        ELSE NULL
    END AS name
FROM public."User" u
LEFT JOIN Doctor d ON u.doctor_id = d.DoctorID
LEFT JOIN Patient p ON u.patient_id = p.PatientID
LEFT JOIN Admin a ON u.admin_id = a.AdminID
LEFT JOIN Receptionist r ON u.receptionist_id = r.ReceptionistID
WHERE u.phone_number = $1;`,
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
     userDetails = async (client:any,userid:any) => {
        try{
            const query = {
                text: `SELECT 
                u.id,
                u.password,
                u.role,
                u.is_first_logged_in,
                u.is_mfa_active,
                u.phone_number,
                CASE
                    WHEN u.role = 'Doctor' THEN d.name
                    WHEN u.role = 'Patient' THEN p.name
                    WHEN u.role = 'Admin' THEN a.name
                    WHEN u.role = 'Receptionist' THEN r.name
                    ELSE NULL
                END AS name,
                CASE
                    WHEN u.role = 'Doctor' THEN u.doctor_id
                    WHEN u.role = 'Patient' THEN u.patient_id
                    WHEN u.role = 'Admin' THEN u.admin_id
                    WHEN u.role = 'Receptionist' THEN u.receptionist_id
                    ELSE NULL
                END AS personalId
            FROM public."User" u
            LEFT JOIN Doctor d ON u.doctor_id = d.DoctorID
            LEFT JOIN Patient p ON u.patient_id = p.PatientID
            LEFT JOIN Admin a ON u.admin_id = a.AdminID
            LEFT JOIN Receptionist r ON u.receptionist_id = r.ReceptionistID
            WHERE u.id = $1;`,
                values: [userid],
            };
         const responseData = await client.query(query);
         return responseData.rows[0];
     }catch(err){
         console.log(err)
     }
     }
     addDoctorUser = async (client:any,data:any) => {
        try{
            const query = {
                text: 'INSERT INTO public."User" (login_slug, password, role, phone_number, doctor_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
                values: [data.contactinformation, data.password, RoleNamesEnum.DOCTOR, data.contactinformation, data.id],
            };
         const responseData = await client.query(query);
         return responseData.rows[0];
     }catch(err){
         console.log(err)
     }
     }
     addAdminUser = async (client:any,data:any) => {
        try{
            const query = {
                text: 'INSERT INTO public."User" (login_slug, password, role, phone_number, admin_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
                values: [data.phone_number, data.password, RoleNamesEnum.ADMIN, data.phone_number, data.admin_id],
            };
         const responseData = await client.query(query);
         return responseData.rows[0];
     }catch(err){
         console.log(err)
     }
     }
     addAdmin = async (client:any,data:any) => {
        try{
            const query = {
                text: 'INSERT INTO public."admin" (name, contactinformation) VALUES ($1, $2) RETURNING *;',
                values: [data.name, data.phone_number],
            };
         const responseData = await client.query(query);
         return responseData.rows[0];
     }catch(err){
         console.log(err)
     }
     }
     addReceptionistUser = async (client:any,data:any) => {
        try{
            const query = {
                text: 'INSERT INTO public."User" (login_slug, password, role, phone_number, receptionist_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
                values: [data.phone_number, data.password, RoleNamesEnum.RECEPTION, data.phone_number, data.receptionist_id],
            };
         const responseData = await client.query(query);
         return responseData.rows[0];
     }catch(err){
         console.log(err)
     }
     }
     addReceptionist = async (client:any,data:any) => {
        try{
            const query = {
                text: 'INSERT INTO public."receptionist" (name, contactinformation) VALUES ($1, $2) RETURNING *;',
                values: [data.name, data.phone_number],
            };
         const responseData = await client.query(query);
         return responseData.rows[0];
     }catch(err){
         console.log(err)
     }
     }
     getAllAdmin = async (client:any) => {
        try{
            const query = {
                text: 'SELECT * FROM public."admin" join "User" on admin.adminid = "User".admin_id',
                values: [],
            };
         const responseData = await client.query(query);
         return responseData.rows;
     }catch(err){
         console.log(err)
     }
    }
        getAllReceptionist = async (client:any) => {
            try{
                const query = {
                    text: 'SELECT * FROM public."receptionist" join "User" on receptionist.receptionistid = "User".receptionist_id',
                    values: [],
                };
            const responseData = await client.query(query);
            return responseData.rows;
        }catch(err){
            console.log(err)
        }
        }

}


export default new AuthRepo()