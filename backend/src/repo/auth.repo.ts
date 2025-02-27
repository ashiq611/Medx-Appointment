import bcrypt from "bcryptjs"

class AuthRepo {
    register = async (client:any,user:any) => {
        try{
         const query = {
             text: "INSERT INTO public.\"User\" (username, password, role) VALUES ($1, $2, $3)",
             values: [user.username, user.password, user.role],
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
                text: 'SELECT userid, password, role FROM public."User" WHERE username = $1',
                values: [user.username],
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
}


export default new AuthRepo()