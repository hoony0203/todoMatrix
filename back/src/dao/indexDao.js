import { pool } from "../../database.js";

export const getUserRows = async () => {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const selectUserQuery = "SELECT * FROM Users";
      const [row] = await connection.query(selectUserQuery);
      return row;
    } catch (err) {
      console.error(`##### getUserRows Query error #####`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(`##### getUserRows DB error #####`);
    return false;
  }
};

export const insertTodo = async (userIdx, contents, type) => {
  try {
    //DB 연결 검사
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      //쿼리
      const insertTodoQuery =
        "INSERT INTO Todos (userIdx, contents, type) VALUES (?, ?, ?)";
      const insertTodoParams = [userIdx, contents, type];
      const [row] = await connection.query(insertTodoQuery, insertTodoParams);
      return row;
    } catch (err) {
      console.error(`##### insertTodo Query error ##### \n ${err}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(`##### insertTodo DB error ##### \n ${err}`);
    return false;
  }
};

export const selectTodoByType = async (userIdx, type) => {
  try {
    //DB 연결 검사
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      //쿼리
      const selectTodoQuery =
        "SELECT todoIdx, contents, status FROM Todos WHERE userIdx =? AND type=? AND NOT(status='D');";
      const selectTodoParams = [userIdx, type];
      const [row] = await connection.query(selectTodoQuery, selectTodoParams);
      return row;
    } catch (err) {
      console.error(`##### selectTodo Query error ##### \n ${err}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(`##### selectTodo DB error ##### \n ${err}`);
    return false;
  }
};

export const isValidTodo = async (userIdx, todoIdx) => {
  try {
    //DB 연결 검사
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      //쿼리
      const isValidTodoQuery =
        "SELECT * FROM Todos WHERE userIdx=? AND todoIdx=? AND NOT(status='D');";
      const isValidTodoParams = [userIdx, todoIdx];
      const [row] = await connection.query(isValidTodoQuery, isValidTodoParams);
      return row;
    } catch (err) {
      console.error(`##### isValidTodo Query error ##### \n ${err}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(`##### isValidTodo DB error ##### \n ${err}`);
    return false;
  }
};

export const updateTodo = async (userIdx, todoIdx, contents, status) => {
  try {
    //DB 연결 검사
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      //쿼리
      const updateTodoQuery =
        "UPDATE Todos SET contents=IFNULL(?, contents), status=IFNULL(?, status) WHERE userIdx=? AND todoIdx=?;";
      const updateTodoParams = [contents, status, userIdx, todoIdx]; // 쿼리와 순서 맞출것
      const [row] = await connection.query(updateTodoQuery, updateTodoParams);
      return row;
    } catch (err) {
      console.error(`##### updateTodo Query error ##### \n ${err}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(`##### updateTodo DB error ##### \n ${err}`);
    return false;
  }
};

export const deleteTodo = async (userIdx, todoIdx) => {
  try {
    //DB 연결 검사
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      //쿼리
      const deleteTodoQuery =
        "UPDATE Todos SET status='D' WHERE userIdx=? AND todoIdx=?";
      const deleteTodoParams = [userIdx, todoIdx]; // 쿼리와 순서 맞출것
      const [row] = await connection.query(deleteTodoQuery, deleteTodoParams);
      return row;
    } catch (err) {
      console.error(`##### deleteTodo Query error ##### \n ${err}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(`##### deleteTodo DB error ##### \n ${err}`);
    return false;
  }
};
