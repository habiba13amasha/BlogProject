// server(api)/index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authRoutes.js";
import postRouter from "./routes/postRoutes.js";
import commentRouter from "./routes/commentRoutes.js";

import cors from "cors"
import cookieParser from "cookie-parser";
dotenv.config(); // يجب أن يكون هذا في بداية الكود

const app = express();
// إضافة الهيدر "Cross-Origin-Opener-Policy" لكل الطلبات
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});


app.use(cors({credentials: true}));

// Middleware لتحليل JSON
app.use(express.json());
app.use(cookieParser())
// Routes
app.use("/api/user", userRouter); // يعني route هو /api/user/test
app.use("/api/auth", authRouter);
app.use("/api/post",postRouter);
app.use("/api/comment",commentRouter);

// Error Handling Middleware
app.use((err, req, res, next) => {     
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});

// الاتصال بقاعدة البيانات والبدء في تشغيل الخادم بعد النجاح
mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => { 
  console.log("Database is Connected"); 
  // بدء الخادم بعد الاتصال بقاعدة البيانات
  app.listen(3000, () => console.log("Server running on port 3000"));
})
.catch((err) => { 
  console.log("Connection failed:", err.message); 
  process.exit(1); // إنهاء العملية إذا فشل الاتصال
});
