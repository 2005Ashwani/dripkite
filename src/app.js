import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()



app.use(cors({
    origin: process.env.CORS_ORIGIN,
    crendentials: true
}))



dotenv.config({
    path:"./.env"
})



app.use(express.json({limit:"20KB"}))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


export {app}