import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()



app.use(cors({
    origin: process.env.CORS_ORIGIN,

    credentials: true


}))



dotenv.config({
    path:"./.env"
})

app.use(express.json({limit:"20KB"}))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


//routes
import signupRoute from "./routes/signup.routes.js"
import loginRoute from "./routes/signin.routes.js"
import signoutRoute from "./routes/signout.routes.js"
import tailorRegistrationRoute from "./routes/tailor.route.js"
import refreshAccecssTokenRoute from "./routes/refreshAccessToken.routes.js"


app.use('/api/v1/signup',signupRoute)
app.use('/api/v1/signinPage',loginRoute)
app.use('/api/v1/signoutBtn',signoutRoute)
app.use('/api/v1/tailorRegistration',tailorRegistrationRoute)
app.use('/api/v1/refreshTokens',refreshAccecssTokenRoute);

export {app}