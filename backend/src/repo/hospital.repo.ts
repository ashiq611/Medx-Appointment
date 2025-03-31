class HospitalRepo {
    async getBranch(client: any) {
        try {
            const query = {
                text: "SELECT * FROM HospitalBranch join Hospital_Institute h on HospitalBranch.HospitalID = h.HospitalID",
            };
            const responseData = await client.query(query);
            return responseData.rows;
        } catch (err) {
            console.log(err);
        }
    }

}

export default new HospitalRepo();