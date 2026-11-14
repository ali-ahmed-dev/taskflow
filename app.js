let tasks = [];

const storedTasks = localStorage.getItem("tasks");

if (storedTasks !== null) {
  tasks = JSON.parse(storedTasks);
}

// Application State
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

// Data Management
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Task Filtering
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

// Task Sorting
function getSortedTasks() {
  const filteredTasks = getFilteredTasks();

  return [...filteredTasks].sort(function (a, b) {
    if (sortOrder === "newest") {
      return b.createdAt - a.createdAt;
    }

    return a.createdAt - b.createdAt;
  });
}

// Focus Management
function focusTaskButton(taskId, selector) {
  const taskItem = taskList.querySelector(`[data-task-id="${taskId}"]`);

  taskItem?.querySelector(selector)?.focus();
}

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
    li.dataset.taskId = task.id;

    if (task.completed) {
      li.classList.add("completed");
    }

    // Task Text
    const taskText = document.createElement("span");
    taskText.textContent = task.text;

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

        // Keyboard Support
        editInput.addEventListener("keydown", function (event) {
          if (event.key === "Enter") {
            event.preventDefault();
            editButton.click();
          }

          if (event.key === "Escape") {
            event.preventDefault();
            cancelButton.click();
          }
        });

        // Cancel Editing
        cancelButton.addEventListener("click", function () {
          editInput.replaceWith(taskText);

          editButton.textContent = "Edit";
          cancelButton.remove();

          isEditing = false;
          editButton.focus();
        });

        return;
      }

      // Save Changes
      const editInput = li.querySelector("input");
      const updatedText = editInput.value.trim();

      if (!updatedText) {
        editInput.focus();
        statusMessage.textContent = "Task cannot be empty.";
        return;
      }

      task.text = updatedText;

      saveTasks();
      renderTasks();

      focusTaskButton(task.id, ".edit-button");
    });

    // Complete Button
    const completeButton = document.createElement("button");
    completeButton.textContent = task.completed ? "Completed" : "Complete";

    completeButton.classList.add("complete-button");

    completeButton.addEventListener("click", function () {
      task.completed = !task.completed;

      saveTasks();
      renderTasks();

      focusTaskButton(task.id, ".complete-button");
    });

    // Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");

    deleteButton.addEventListener("click", function () {
      const index = tasks.findIndex(function (item) {
        return item.id === task.id;
      });

      if (index !== -1) {
        tasks.splice(index, 1);
      }

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
  taskInput.focus();

  statusMessage.textContent = "";
});

// Prevent Repeated Enter Key Submission
taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && event.repeat) {
    event.preventDefault();
  }
});

// Filter Tasks
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

// Clear Completed Tasks
clearCompletedButton.addEventListener("click", function () {
  tasks = tasks.filter(function (task) {
    return !task.completed;
  });

  saveTasks();
  renderTasks();
});
