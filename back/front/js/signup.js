//import * as RegEx from "common.js";

/** 토큰 검사 */
const token = localStorage.getItem("x-access-token");
if (token) {
  alert("로그아웃 후 이용해주세요");
  location.href = "index.html";
}

const emailRegEx =
  /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
const passwordRegEx = /^(?=.*[a-zA-Z])(?=.*[!@$%^&*])(?=.*[0-9]).{7,19}$/; // 영문, 숫자, 특수문자(!@$%^&*)조합 8~20자 입력
const nicknameRegEx = /^[a-zA-Z][0-9a-zA-Z]{1,9}$/; // 영문, 영문 숫자 조합 2-10자

/** 입력값 유효성 검사 */

// 이메일
const inputEmail = document.getElementById("email");
const emailMessage = document.querySelector("div.email-message");
inputEmail.addEventListener("input", () =>
  isValid(inputEmail, emailRegEx, emailMessage)
);

// 비밀번호
const inputPassword = document.getElementById("password");
const passwordMessage = document.querySelector("div.password-message");
inputPassword.addEventListener("input", () =>
  isValid(inputPassword, passwordRegEx, passwordMessage)
);

// 비밀번호 확인
const inputPasswordConfirm = document.getElementById("password-confirm");
const passwordConfirmMessage = document.querySelector(
  "div.password-confirm-message"
);
inputPasswordConfirm.addEventListener("input", () =>
  isConfirmedPw(inputPasswordConfirm, inputPassword, passwordConfirmMessage)
);

// 닉네임
const inputNickname = document.getElementById("inputNickname");
const nickNameMessage = document.querySelector("div.nickname-message");
inputNickname.addEventListener("input", () =>
  isValid(inputNickname, nicknameRegEx, nickNameMessage)
);

// 통합 형식 검사
function isValid(input, RegEx, message) {
  const currentInput = input.value;
  if (!RegEx.test(currentInput)) {
    message.style.visibility = "visible";
    return false;
  }
  message.style.visibility = "hidden";
  return true;
}

// 비번 일치 검사
function isConfirmedPw(input, pwInput, message) {
  const currentConfirmInput = input.value;
  const currentPwInput = pwInput.value;
  if (currentConfirmInput !== currentPwInput) {
    message.style.visibility = "visible";
    return false;
  }
  message.style.visibility = "hidden";
  return true;
}

// 이메일 형식 검사
// function isEmailValid(event) {
//   const currentEmail = inputEmail.value;
//   const emailRegEx =
//     /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
//   if (!emailRegEx.test(currentEmail)) {
//     emailMessage.style.visibility = "visible";
//     return false;
//   }
//   emailMessage.style.visibility = "hidden";
//   return true;
// }

/** 회원가입 API 요청 */

const signUpButton = document.getElementById("sign-up");
signUpButton.addEventListener("click", signUp);

// validation
async function signUp(event) {
  const isValidReq =
    isValid(inputEmail, emailRegEx, emailMessage) &&
    isValid(inputPassword, passwordRegEx, passwordMessage) &&
    isConfirmedPw(
      inputPasswordConfirm,
      inputPassword,
      passwordConfirmMessage
    ) &&
    isValid(inputNickname, nicknameRegEx, nickNameMessage);

  if (!isValidReq) {
    alert("회원 정보를 확인해주세요.");
    return false;
  }

  // axios
  const currentEmail = inputEmail.value;
  const currentPassword = inputPassword.value;
  const currentNickname = inputNickname.value;

  const config = {
    method: "post",
    url: url + "/user",
    data: {
      email: currentEmail,
      password: currentPassword,
      nickname: currentNickname,
    },
  };
  try {
    const res = await axios(config);

    if (res.data.code === 400) {
      alert(res.data.message);
      location.reload();
      return false;
    }
    if (res.data.code === 200) {
      alert(res.data.message);
      location.href = "signIn.html";
      return true;
    }
  } catch (err) {
    console.log(err);
  }
}
