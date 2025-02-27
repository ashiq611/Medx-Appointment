

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
}


export default new AuthRepo()