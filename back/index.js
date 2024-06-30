import compression from "compression";
import cors from "cors";
import express from "express";
import { indexRouter } from "./src/router/indexRouter.js";
import { userRouter } from "./src/router/userRouter.js";
const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

app.use(compression());

indexRouter(app);
userRouter(app);

app.listen(port, () => {
  console.log(`Express app listening at port: ${port}`);
});
