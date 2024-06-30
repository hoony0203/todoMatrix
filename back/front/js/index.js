async function setHeader() {
  // 로컬 스토리이제 토큰 존재여부 검사
  const token = localStorage.getItem("x-access-token");
  // 토큰이 없다면 signed에 hidden 클래스
  if (!token) {
    const signed = document.querySelector(".signed");
    signed.classList.add("hidden");
    return;
  }

  const config = {
    method: "get",
    url: url + "/jwt",
    headers: {
      "x-access-token": token,
    },
  };
  try {
    const res = await axios(config);
    if (res.data.code !== 200) {
      console.log("잘못된 토큰");
      return false;
    }
    const nickname = res.data.result.nickname;
    const spanNickname = document.querySelector("span.nickname");
    spanNickname.innerText = nickname;
    // 토큰이 있다면 unsigned에 hidden 클래스
    const unsigned = document.querySelector(".unsigned");
    unsigned.classList.add("hidden");
    return true;
  } catch (err) {
    console.log(err);
  }
}

setHeader();

/** 로그아웃 */
const signOutButton = document.querySelector("#sign-out");
signOutButton.addEventListener("click", signOut);

function signOut(event) {
  localStorage.removeItem("x-access-token");
  location.reload();
}
