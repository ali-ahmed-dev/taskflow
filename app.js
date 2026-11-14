let tasks = [];

const storedTasks = localStorage.getItem("tasks");

if (storedTasks !== null) {
  tasks = JSON.parse(storedTasks);
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

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
const clearCompletedButton = document.querySelector("#clear-completed");

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
      saveTasks();
      renderTasks();
    });

    // Edit Button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-button");

    let isEditing = false;

    editButton.addEventListener("click", function () {
      // Enter Edit Mode
      if (!isEditing) {
        isEditing = true;

        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = task.text;

        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel";
        cancelButton.classList.add("cancel-button");

        taskText.replaceWith(editInput);

        editButton.textContent = "Save";
        editButton.after(cancelButton);

        editInput.focus();

        // Cancel Editing
        cancelButton.addEventListener("click", function () {
          editInput.replaceWith(taskText);

          editButton.textContent = "Edit";
          cancelButton.remove();

          isEditing = false;
        });

        return;
      }

      // Save Changes
      const editInput = li.querySelector("input");
      const updatedText = editInput.value.trim();

      if (!updatedText) {
        editInput.focus();
        return;
      }

      task.text = updatedText;

      saveTasks();
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

      saveTasks();
      renderTasks();
    });

    // Append Elements
    li.appendChild(taskText);
    li.appendChild(editButton);
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

  saveTasks();
  renderTasks();

  taskInput.value = "";
  statusMessage.textContent = "";
});

// Filter Tasks
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

// Sort Tasks
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

clearCompletedButton.addEventListener("click", function () {
    tasks = tasks.filter(function (task) {
        return !task.completed;
    });

    saveTasks();
    renderTasks();
});