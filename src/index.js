import { app } from "./app.js";
import dbConnection from "./db/index.js";


dbConnection()
.then(()=>{

    app.listen(process.env.PORT || 3200, (req,res,next)=>{
        console.log(`Server is listening at http://localhost:${process.env.PORT}`);
    })
    app.get('/',(req,res,next)=>{
        res.send("You are at the HomePage!");
    })


})
.catch((error)=>{
    console.log("Could not connect to DB");
})