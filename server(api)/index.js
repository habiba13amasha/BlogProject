import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRouter from "./routes/userRoutes.js"
dotenv.config() // يجب أن يكون هذا في بداية الكود

const app=express()

mongoose.connect(process.env.MONGO)
.then(()=>{console.log("Database is Connected")}).catch((err)=>{console.log("connection failed")})


app.listen(3000, () =>console.log("Server running on port 3000") );

app.use("/user",userRouter); //means route is /user/test 