import * as userDao from "../dao/userDao.js";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../../secret.js";

export const signUp = async function (req, res) {
  const { email, password, nickname } = req.body;

  if (!email || !password || !nickname) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "회원가입 입력 값을 입력해주세요",
    });
  }

  const emailRegEx =
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

  if (!emailRegEx.test(email)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "이메일 형식을 확인해주세요.",
    });
  }

  const passwordRegEx = /^(?=.*[a-zA-Z])(?=.*[!@$%^&*])(?=.*[0-9]).{7,19}$/; // 영문, 숫자, 특수문자(!@$%^&*)조합 8~20자 입력

  if (!passwordRegEx.test(password)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message:
        "비밀번호 형식을 확인해주세요. 영문, 숫자, 특수문자(!@$%^&*)조합 8~20자 입력",
    });
  }

  const nicknameRegEx = /^[a-zA-Z][0-9a-zA-Z]{1,9}$/; // 영문, 영문 숫자 조합만 가능
  if (!nicknameRegEx.test(nickname)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "닉네임 형식 확인. 영문, 영문 숫자 조합 2-10자 조합만 가능",
    });
  }
  // 중복 회원 검사
  const isDuplicatedUser = await userDao.selectUserByEmailNickName(
    email,
    nickname
  );
  if (isDuplicatedUser.length > 0) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "중복되는 이메일, 닉네임 사용 불가",
    });
  }

  // DB 입력
  const insertUserRow = await userDao.insertUser(email, password, nickname);
  if (!insertUserRow) {
    return res.send({
      isSuccess: false,
      code: 403,
      message: "회원 가입 실패. 개발자에게 문의.",
    });
  }
  return res.send({
    isSuccess: true,
    code: 200,
    message: "회원 가입 성공",
  });
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.send({
      isSuccess: true,
      code: 400,
      message: "로그인 실패. 개발자에게 문의",
    });
  }

  // 회원 여부 검사
  const isValidUser = await userDao.selectUser(email, password);
  if (!isValidUser) {
    return res.send({
      isSuccess: false,
      code: 410,
      message: "DB에러 담당자에게 문의해주세요",
    }); /// 오류 미들웨어 처리 해볼 것
  }
  if (isValidUser.length < 1) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "유효한 아이디가 없거나, 아이디와 비밀번호가 일치하지 않습니다.",
    });
  }

  // jwt 토큰 발급
  const [userInfo] = isValidUser;
  const userIdx = userInfo.userIdx;

  const token = jwt.sign(
    { userIdx }, //페이로드
    jwtSecret // 시크릿키
  );

  return res.send({
    result: { token: token },
    isSuccess: true,
    code: 200,
    message: "로그인 성공",
  });
};

export const getNicknameByToken = async (req, res) => {
  const { userIdx } = req.verifiedToken;

  const [userInfo] = await userDao.selectUserNicknameByUserIdx(userIdx);
  const nickname = userInfo.nickname;

  if (!nickname) {
    res.send({
      isSuccess: false,
      code: 403,
      message: "닉네임 조회 실패",
    });
  }

  return res.send({
    result: {
      nickname: nickname,
    },
    isSuccess: true,
    code: 200,
    message: "토큰 검증 성공",
  });
};
