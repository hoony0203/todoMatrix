import { pool } from "../../database.js";

export const selectUserByEmailNickName = async (email, nickname) => {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const selectUserByEmailNicknameQuery =
        "SELECT * FROM Users WHERE email= ? OR nickname= ?;";
      const selectUserByEmailNicknameParams = [email, nickname];
      const [row] = await connection.query(
        selectUserByEmailNicknameQuery,
        selectUserByEmailNicknameParams
      );
      return row;
    } catch (err) {
      console.error(`##### selectUserByEmailNicknameRows Query error #####`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(`##### selectUserByEmailNicknameRows DB error #####`);
    return false;
  }
};

export const insertUser = async (email, password, nickname) => {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const insertUserQuery =
        "INSERT INTO Users (email, password, nickname) VALUES(?, ?, ?)";
      const insertUserParams = [email, password, nickname];
      const [row] = await connection.query(insertUserQuery, insertUserParams);
      return row;
    } catch (err) {
      console.error(`##### insertUserRows Query error #####`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(`##### insertUserRows DB error #####`);
    return false;
  }
};

export const selectUser = async (email, password) => {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const selectUserQuery =
        "SELECT * FROM Users WHERE email=? AND password=?;";
      const selectUserParams = [email, password];
      const [row] = await connection.query(selectUserQuery, selectUserParams);
      return row;
    } catch (err) {
      console.error(`##### selectUserRows Query error #####`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(`##### selectUserRows DB error #####`);
    return false;
  }
};

export const selectUserNicknameByUserIdx = async (userIdx) => {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const selectNicknameQuery = "SELECT nickname FROM Users WHERE userIdx=?;";
      const selectNicknameParams = [userIdx];
      const [row] = await connection.query(
        selectNicknameQuery,
        selectNicknameParams
      );
      return row;
    } catch (err) {
      console.error(`##### selectNicknameRows Query error #####`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(`##### selectNicknameRows DB error #####`);
    return false;
  }
};
