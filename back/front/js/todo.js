async function readTodo() {
  // 토큰이 없으면 return
  const token = localStorage.getItem("x-access-token");
  if (!token) {
    return;
  }
  // 일정 조회 API 호출
  const config = {
    method: "get",
    url: url + "todos",
    headers: { "x-access-token": token },
  };
  try {
    const res = await axios(config);
    if (res.data.code !== 200) {
      alert(res.data.message);
      return false;
    }

    const todoDataSet = res.data.result;
    for (let section in todoDataSet) {
      //각 섹션에 해당하는 ul 태그 선택
      const sectionUL = document.querySelector(`#${section} ul`);
      // 각 섹션에 해당하는 데이터
      const arryForEachSection = todoDataSet[section];

      let result = "";
      for (let todo of arryForEachSection) {
        let element = `
         <li class="list-item" id=${todo.todoIdx}>
            <div class="done-text-container">
                <input type="checkbox" name="" id="" class="todo-done" ${
                  todo.status === "C" ? "checked" : ""
                } />
                <p class="todo-text">
                ${todo.contents}
                </p>
            </div>
            <div class="update-delete-container">
                <i class="todo-update fa-solid fa-pencil"></i>
                <i class="todo-delete fa-solid fa-trash"></i>
            </div>
        </li>`;
        result += element;
      }
      sectionUL.innerHTML = result;
    }
  } catch (err) {
    console.log(err);
  }
}

readTodo();

/** 일정 CUD */
const matrixContainer = document.querySelector(".matrix-container");

matrixContainer.addEventListener("keypress", cudController);
matrixContainer.addEventListener("click", cudController);

function cudController(e) {
  // 토큰이 없으면 return
  const token = localStorage.getItem("x-access-token");
  if (!token) {
    return;
  }
  const target = e.target;
  const targetTagName = target.tagName;
  const eventType = e.type;
  const key = e.key;

  /** create 이벤트 처리 */
  if (targetTagName == "INPUT" && key == "Enter") {
    createTodo(e, token);
    return;
  }

  /** update 이벤트 처리*/

  //체크박스 업데이트
  if (target.className === "todo-done" && eventType === "click") {
    updateTodoDone(e, token);
    return;
  }

  // 컨텐츠 업데이트
  const targetClassList = target.classList;
  if (targetClassList.contains("todo-update") && eventType === "click") {
    updateTodoContents(e, token);
    return;
  }

  // 일정 삭제
  if (targetClassList.contains("todo-delete") && eventType === "click") {
    deleteTodo(e, token);
    return;
  }
}

async function createTodo(e, token) {
  const contents = e.target.value;
  const type = e.target.closest(".matrix-item").id;
  if (!contents) {
    alert("내용을 입력해주세요.");
    return false;
  }

  const config = {
    method: "post",
    url: url + "todo",
    headers: { "x-access-token": token },
    data: {
      contents: contents,
      type: type,
    },
  };

  try {
    const res = await axios(config);
    console.log(res);
    if (res.data.code !== 200) {
      alert(res.data.message);
      return false;
    }

    readTodo();
    e.target.value = "";
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function updateTodoDone(e, token) {
  const status = e.target.checked ? "C" : "A";
  const todoIdx = e.target.closest("li").id;

  const config = {
    method: "patch",
    url: url + "todo",
    headers: { "x-access-token": token },
    data: {
      todoIdx: todoIdx,
      status: status,
    },
  };
  try {
    const res = await axios(config);
    if (res.data.code !== 200) {
      alert(res.data.message);
      return false;
    }
    readTodo();
  } catch (err) {
    console.log(err);
  }
}

async function updateTodoContents(e, token) {
  const contents = prompt("내용을 입력해주세요");
  const todoIdx = e.target.closest("li").id;
  const config = {
    method: "patch",
    url: url + "todo",
    headers: { "x-access-token": token },
    data: {
      todoIdx: todoIdx,
      contents: contents,
    },
  };
  try {
    const res = await axios(config);
    if (res.data.code !== 200) {
      alert(res.data.message);
      return false;
    }
    readTodo();
  } catch (err) {
    console.log(err);
  }
}

async function deleteTodo(e, token) {
  const todoIdx = e.target.closest("li").id;
  const config = {
    method: "delete",
    url: url + `todo/${todoIdx}`,
    headers: { "x-access-token": token },
  };
  try {
    if (!confirm("삭제하시겠습니까?")) {
      return false;
    }
    const res = await axios(config);
    if (res.data.code !== 200) {
      alert(res.data.message);
      return false;
    }
    readTodo();
  } catch (err) {
    console.log(err);
  }
}
