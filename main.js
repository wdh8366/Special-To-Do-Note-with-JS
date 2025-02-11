let taskInput = document.getElementById("task-input");
let addButton = document.getElementById("add-button");
let tabs = document.querySelectorAll(".task-tabs a");
let underLine = document.getElementById("under-line");
let navItems = document.querySelectorAll("nav:first-child a");
let taskList = JSON.parse(localStorage.getItem("tasks")) || []; // 로컬 스토리지에서 불러오기
let filterList = [];
let mode = "all";

addButton.addEventListener("click", addTask);

navItems.forEach((menu) => {
  menu.addEventListener("click", (e) => navigator(e));
});

function navigator(e) {
  underLine.style.left = e.currentTarget.offsetLeft + "px";
  underLine.style.width = e.currentTarget.offsetWidth + "px";
  underLine.style.top = e.currentTarget.offsetTop + (e.currentTarget.offsetHeight - 3) + "px";
}

for (let i = 0; i < tabs.length; i++) {
  tabs[i].addEventListener("click", function (event) {
    filter(event);
  });
}

function addTask() {
  if (taskInput.value.trim() === "") return; // 빈 입력 방지

  // if(taskList.filter(v => v === taskInput.value.trim())) return; // 중복입력방지

  let task = {
    id: randomIDGenerate(),
    taskContent: taskInput.value,
    isComplete: false,
  };
  
  taskList.push(task);
  saveToLocalStorage();
  taskInput.value = ""; // 입력창 초기화
  render();
}

function render() {
  let list = mode === "all" ? taskList : filterList;

  list.sort((a, b) => a.isComplete - b.isComplete);

  let resultHTML = "";
  
  list.forEach((task) => {
    resultHTML += `
      <div class="task">
        <div class="${task.isComplete ? "task-done" : ""}">
          ${task.taskContent}
        </div>
        <div>
          <button onclick="toggleComplete('${task.id}')">Check</button>
          <button onclick="deleteTask('${task.id}')">Delete</button>
        </div>
      </div>
    `;
  });
  document.getElementById("task-board").innerHTML = resultHTML;
}

function toggleComplete(id) {
  taskList = taskList.map((task) =>
    task.id === id ? { ...task, isComplete: !task.isComplete } : task
  );
  filterList = filterList.filter((task) => task.id !== id);
  saveToLocalStorage();
  render();
}

function deleteTask(id) {
  taskList = taskList.filter((task) => task.id !== id);
  saveToLocalStorage();
  render();
}

function filter(event) {
  mode = event.target.id;
  filterList = mode === "all" ? taskList : taskList.filter(task => mode === "done" ? task.isComplete : !task.isComplete);
  render();
}

// 로컬 스토리지에 저장
function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(taskList));
}

// ID 생성 함수
function randomIDGenerate() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// 페이지 로드 시 기존 데이터 렌더링
document.addEventListener("DOMContentLoaded", render);