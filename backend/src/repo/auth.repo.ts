import bcrypt from "bcryptjs"

class AuthRepo {
    register = async (client:any,user:any) => {
        try{
         const query = {
             text: "INSERT INTO public.\"User\" (login_slug, password, role, phone_number) VALUES ($1, $2, $3, $4) RETURNING *;",
             values: [user.login_slug, user.password, user.role, user.phone_number],
         };
     
         const responseData = await client.query(query);
         return responseData.rows[0];
     }catch(err){
         console.log(err)
     }
     
         
     }
     login = async (client:any,user:any) => {
        try{
            const query = {
                text: 'SELECT id, password, role FROM public."User" WHERE phone_number = $1',
                values: [user.phone_number],
            };
         const responseData = await client.query(query);
     
          const dbUser = responseData.rows[0];

         // If user does not exist or passwords do not match
         if (!dbUser || !bcrypt.compareSync(user.password, dbUser.password)) {
             return null; // Invalid username or password
         }

         return dbUser;
     }catch(err){
         console.log(err)
     }
     }
     checkExistUser = async (client:any,phone_number:any) => {
        try{
            const query = {
                text: 'SELECT userid, password, role FROM public."User" WHERE phone_number = $1',
                values: [phone_number],
            };
         const responseData = await client.query(query);
         return responseData.rows[0];
     }catch(err){
         console.log(err)
     }
     }
}


export default new AuthRepo()