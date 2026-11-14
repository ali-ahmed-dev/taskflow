const tasks = [];

let currentFilter = "all";

let sortOrder = "newest";

// DOM Elements
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const sortSelect = document.querySelector("#sort-select");

const taskCount = document.querySelector("#task-count");
const emptyMessage = document.querySelector("#empty-message");
const statusMessage = document.querySelector("#status-message");

const filterButtons = document.querySelectorAll("[data-filter]");

// Render Tasks
function renderTasks() {
    taskList.replaceChildren();

    const visibleTasks = getSortedTasks();

    taskCount.textContent = `${visibleTasks.length} tasks`;

    if (tasks.length === 0) {
        emptyMessage.textContent = "No tasks yet. Add one above to get started.";
        emptyMessage.hidden = false;
    } else if (visibleTasks.length === 0) {
        emptyMessage.textContent = "No tasks found in this filter.";
        emptyMessage.hidden = false;
    } else {
        emptyMessage.hidden = true;
    }

    for (const task of visibleTasks) {
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

function getFilteredTasks() {
  if (currentFilter === "active") {
    return tasks.filter(function (task) {
      return !task.completed;
    });
  }

  if (currentFilter === "completed") {
    return tasks.filter(function (task) {
      return task.completed;
    });
  }

  return tasks;
}

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(function (btn) {
            const isActive = btn.dataset.filter === currentFilter;

            btn.classList.toggle("is-active", isActive);
            btn.setAttribute("aria-pressed", isActive);
        });

        renderTasks();
    });
});

sortSelect.addEventListener("change", function () {
    sortOrder = sortSelect.value;
    renderTasks();
});

function getSortedTasks() {
    const filteredTasks = getFilteredTasks();

    return [...filteredTasks].sort(function (a, b) {
        if (sortOrder === "newest") {
            return b.createdAt - a.createdAt;
        }

        return a.createdAt - b.createdAt;
    });
}