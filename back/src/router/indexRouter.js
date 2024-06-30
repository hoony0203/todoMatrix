import * as indexController from "../controller/indexController.js";
import { jwtMiddleware } from "../../jwtMiddleware.js";

export const indexRouter = (app) => {
  // 일정 CRUD API
  app.get("/", indexController.indexController);
  app.post("/todo", jwtMiddleware, indexController.createdTodo); // create
  app.get("/todos", jwtMiddleware, indexController.readTodo); // read // 토큰사용 이전에는 :userIdx등 사용
  app.patch("/todo", jwtMiddleware, indexController.updateTodo); // update
  app.delete("/todo/:todoIdx", jwtMiddleware, indexController.deleteTodo); //delete
};
