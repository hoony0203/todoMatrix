import * as indexDao from "../dao/indexDao.js";

export const indexController = (req, res) => {
  return res.send("EXPRESS ON");
};

export const createdTodo = async (req, res) => {
  const { userIdx } = req.verifiedToken;
  const { contents, type } = req.body;

  /** validation */
  if (!userIdx || !contents || !type) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "입력값이 누락됐습니다",
    });
  }

  //cotents 20 글자 초과 불가
  if (contents.length > 20) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "콘텐츠는 20글자 이하로 설정해주세요.",
    });
  }
  // type : do, decide, delete, delegate
  const validTypes = ["do", "decide", "delete", "delegate"];
  if (!validTypes.includes(type)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "유효한 타입이 아닙니다.",
    });
  }
  const insertTodoRow = await indexDao.insertTodo(userIdx, contents, type);
  if (!insertTodoRow) {
    return res.send({
      isSuccess: false,
      code: 403,
      message: "요청에 실패했습니다 관리자에게 문의해주세요.",
    });
  }

  return res.send({
    isSuccess: true,
    code: 200,
    message: "일정 생성 성공",
  });
};

export const readTodo = async (req, res) => {
  const { userIdx } = req.verifiedToken;
  const todos = {};
  const types = ["do", "decide", "delegate", "delete"];

  for (let type of types) {
    let selectTodoByTypeRows = await indexDao.selectTodoByType(userIdx, type);

    if (!selectTodoByTypeRows) {
      return res.send({
        isSuccess: false,
        code: 400,
        message: "일정 조회 실패. 관리자에게 문의해주세요.",
      });
    }

    todos[type] = selectTodoByTypeRows;
  }

  return res.send({
    result: todos,
    isSuccess: true,
    code: 200,
    message: "일정 조회 성공",
  });
};

export const updateTodo = async (req, res) => {
  const { userIdx } = req.verifiedToken;
  let { todoIdx, contents, status } = req.body;

  if (!userIdx || !todoIdx) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "todoIdx가 누락되었습니다.",
    });
  }

  if (!contents) {
    contents = null;
  }
  if (!status) {
    status = null;
  }

  const isValidTodoRaw = await indexDao.isValidTodo(userIdx, todoIdx);
  if (isValidTodoRaw.length < 1) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "userIdx와 tdodoIdx가 유효하지 않습니다.",
    });
  }
  const updateTodoResult = await indexDao.updateTodo(
    userIdx,
    todoIdx,
    contents,
    status
  );

  if (!updateTodoResult) {
    return res.send({
      isSuccess: false,
      code: 403,
      message: "업데이트 실패. 관리자에게 문의해주세요.",
    });
  }

  return res.send({
    isSuccess: true,
    code: 200,
    message: "일정 업데이트 성공",
  });
};

export const deleteTodo = async (req, res) => {
  const { userIdx } = req.verifiedToken;
  const { todoIdx } = req.params;

  if (!userIdx || !todoIdx) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "userIdx, todoIdx 누락되었습니다.",
    });
  }

  const isValidTodoRaw = await indexDao.isValidTodo(userIdx, todoIdx);
  if (isValidTodoRaw.length < 1) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "userIdx와 tdodoIdx가 유효하지 않습니다.",
    });
  }

  const deleteTodoResult = await indexDao.deleteTodo(userIdx, todoIdx);
  if (!deleteTodoResult) {
    return res.send({
      isSuccess: false,
      code: 403,
      message: "삭제 실패. 관리자에게 문의해주세요.",
    });
  }
  return res.send({
    isSuccess: true,
    code: 200,
    message: "일정 삭제 성공",
  });
};
