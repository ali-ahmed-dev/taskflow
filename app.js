const tasks = [];

let currentFilter = "all";

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");

const taskCount = document.querySelector("#task-count");
const emptyMessage = document.querySelector("#empty-message");
const statusMessage = document.querySelector("#status-message");

const filterButtons = document.querySelectorAll("[data-filter]");


function renderTasks() {
    taskList.replaceChildren();
    taskCount.textContent = `${tasks.length} tasks`;
    emptyMessage.hidden = tasks.length > 0;

    for (const task of tasks) {
    const li = document.createElement("li");

    li.textContent = task.text;

    taskList.appendChild(li);
    }
}

renderTasks();