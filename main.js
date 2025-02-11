const taskInput = document.getElementById("task-input");
const addButton = document.getElementById("add-button");
const tabs = document.querySelectorAll(".task-tabs a");
const underLine = document.getElementById("under-line");
const navItems = document.querySelectorAll("nav:first-child a");
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let filterList = [];
let mode = "all";

const navigator = (e) => {
  underLine.style.left = `${e.currentTarget.offsetLeft}px`;
  underLine.style.width = `${e.currentTarget.offsetWidth}px`;
  underLine.style.top = `${e.currentTarget.offsetTop + (e.currentTarget.offsetHeight - 3)}px`;
};

const addTask = () => {
  const taskContent = taskInput.value.trim();
  if (!taskContent) return;

  const task = {
    id: randomIDGenerate(),
    taskContent,
    isComplete: false,
  };

  taskList.push(task);
  saveToLocalStorage();
  taskInput.value = "";
  render();
};

const render = () => {
  const list = mode === "all" ? taskList : filterList;
  list.sort((a, b) => a.isComplete - b.isComplete);

  const resultHTML = list
    .map(
      (task) => `
      <div class="task">
        <div class="${task.isComplete ? "task-done" : ""}">${task.taskContent}</div>
        <div>
          <button onclick="toggleComplete('${task.id}')">Check</button>
          <button onclick="deleteTask('${task.id}')">Delete</button>
        </div>
      </div>`
    )
    .join("");

  document.getElementById("task-board").innerHTML = resultHTML;
};

const toggleComplete = (id) => {
  taskList = taskList.map((task) =>
    task.id === id ? { ...task, isComplete: !task.isComplete } : task
  );
  filterList = filterList.filter((task) => task.id !== id);
  saveToLocalStorage();
  render();
};

const deleteTask = (id) => {
  taskList = taskList.filter((task) => task.id !== id);
  saveToLocalStorage();
  render();
};

const filter = (event) => {
  mode = event.target.id;
  filterList = taskList.filter((task) =>
    mode === "done" ? task.isComplete : !task.isComplete
  );
  render();
};

const saveToLocalStorage = () =>
  localStorage.setItem("tasks", JSON.stringify(taskList));

const randomIDGenerate = () => `_${Math.random().toString(36).substr(2, 9)}`;

addButton.addEventListener("click", addTask);
navItems.forEach((menu) => menu.addEventListener("click", navigator));
tabs.forEach((tab) => tab.addEventListener("click", filter));
document.addEventListener("DOMContentLoaded", render);