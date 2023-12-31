import bodyParser from "body-parser";
import express from "express";
import dbConnect  from "./config/dbConfig.js";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js"
import errorHandler from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 4000;
dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use("/api/user",authRouter)
app.use("/", (req, res) => {
  res.send("Hello from the server side");
});
app.use(errorHandler.notFound)
app.use(errorHandler.errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
