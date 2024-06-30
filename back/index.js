import compression from "compression";
import cors from "cors";
import express from "express";
import { indexRouter } from "./src/router/indexRouter.js";
import { userRouter } from "./src/router/userRouter.js";
const app = express();
const port = 3000;

// 정적 파일 설정
app.use(express.static("front"));

// cors
app.use(cors());

// body json 파싱
app.use(express.json());

// HTTP 요청 압축
app.use(compression());

indexRouter(app);
userRouter(app);

app.listen(port, () => {
  console.log(`Express app listening at port: ${port}`);
});
