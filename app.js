const tasks = [];

let currentFilter = "all";

// DOM Elements
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");

const taskCount = document.querySelector("#task-count");
const emptyMessage = document.querySelector("#empty-message");
const statusMessage = document.querySelector("#status-message");

const filterButtons = document.querySelectorAll("[data-filter]");

// Render Tasks
function renderTasks() {
  taskList.replaceChildren();

  taskCount.textContent = `${tasks.length} tasks`;
  emptyMessage.hidden = tasks.length > 0;

  for (const task of tasks) {
    const li = document.createElement("li");

    if (task.completed) {
      li.classList.add("completed");
    }

    // Task Text
    const taskText = document.createElement("span");
    taskText.textContent = task.text;

    // Complete Button
    const completeButton = document.createElement("button");
    completeButton.textContent = task.completed ? "Completed" : "Complete";

    completeButton.addEventListener("click", () => {
      task.completed = !task.completed;
      renderTasks();
    });

    // Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");

    deleteButton.addEventListener("click", function () {
      const index = tasks.findIndex(function (item) {
        return item.id === task.id;
      });

      tasks.splice(index, 1);

      renderTasks();
    });

    // Append Elements
    li.appendChild(taskText);
    li.appendChild(completeButton);
    li.appendChild(deleteButton);

    taskList.appendChild(li);
  }
}

// Initial Render
renderTasks();

// Create Task
taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = taskInput.value.trim();

  if (!text) {
    statusMessage.textContent = "Please enter a task.";
    return;
  }

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false,
    createdAt: Date.now(),
  };

  tasks.push(newTask);

  renderTasks();

  taskInput.value = "";
  statusMessage.textContent = "";
});
