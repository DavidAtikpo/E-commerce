import bodyParser from "body-parser";
import express from "express";
import dbConnect  from "./config/dbConfig.js";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js"
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import productRouter from "./routes/productRouter.js"
import morgan from "morgan";


const app = express();
const PORT = process.env.PORT || 4000;
dbConnect();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())



app.use("/api/user",authRouter)
app.use("/api/product",productRouter)
app.use("/", (req, res) => {
  res.send("Hello from the server side");
});
app.use(errorHandler.notFound)
app.use(errorHandler.errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
