import mongoose from "mongoose";
import { app } from "../app.js";
import {DB_NAME} from "../constants.js"



const dbConnection = async()=>{

    try{

      const connInstance =  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

    //   app.on(error,(req,res,error)=>{
    //         console.log(`DB Connected but not able to Communicate!`,err);
    //     })

        console.log(`Connected to Database `,connInstance.connection.host);

    }
    catch(err){
        console.log("ERROR in DB Folder: ",err);
        process.exit(1);
    }

}

export default dbConnection