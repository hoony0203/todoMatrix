import * as userController from "../controller/userController.js";
import { jwtMiddleware } from "../../jwtMiddleware.js";

export const userRouter = (app) => {
  // 회원가입 API
  app.post("/user", userController.signUp);
  // 로그인 API
  app.post("/signIn", userController.signIn);
  // jwt 검증 API
  app.get("/jwt", jwtMiddleware, userController.getNicknameByToken);
};
