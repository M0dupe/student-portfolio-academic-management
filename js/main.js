// Shared JavaScript for the student portfolio website.
document.addEventListener("DOMContentLoaded", () => {
  // Keep the footer year current.
  document.querySelectorAll(".current-year").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  // Mobile navigation menu.
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".site-nav");
  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.textContent = isOpen ? "×" : "☰";
    });
  }

  // Academic planner: tasks are stored in this browser only.
  const taskForm = document.querySelector("#task-form");
  if (taskForm) {
    const taskInput = document.querySelector("#task-input");
    const taskList = document.querySelector("#task-list");
    const taskCount = document.querySelector("#task-count");
    const completedCount = document.querySelector("#completed-count");
    const clearCompleted = document.querySelector("#clear-completed");
    const storageKey = "modupeoluwaAcademicTasks";
    let tasks = [];

    try {
      tasks = JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch (error) {
      tasks = [];
    }

    function saveTasks() {
      localStorage.setItem(storageKey, JSON.stringify(tasks));
    }

    function renderTasks() {
      taskList.innerHTML = "";
      if (tasks.length === 0) {
        const empty = document.createElement("li");
        empty.className = "empty-state";
        empty.textContent = "No tasks yet. Add your first study task above.";
        taskList.appendChild(empty);
      }

      tasks.forEach((task) => {
        const item = document.createElement("li");
        item.className = task.completed ? "task-item done" : "task-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.id = `task-${task.id}`;
        checkbox.setAttribute("aria-label", `Mark ${task.text} as complete`);
        checkbox.addEventListener("change", () => {
          task.completed = checkbox.checked;
          saveTasks();
          renderTasks();
        });

        const label = document.createElement("label");
        label.htmlFor = checkbox.id;
        label.textContent = task.text;

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "delete-task";
        removeButton.textContent = "Delete";
        removeButton.addEventListener("click", () => {
          tasks = tasks.filter((entry) => entry.id !== task.id);
          saveTasks();
          renderTasks();
        });

        item.append(checkbox, label, removeButton);
        taskList.appendChild(item);
      });

      const completed = tasks.filter((task) => task.completed).length;
      taskCount.textContent = `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`;
      completedCount.textContent = `${completed} completed`;
    }

    taskForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const text = taskInput.value.trim();
      if (!text) return;
      tasks.push({ id: Date.now(), text, completed: false });
      saveTasks();
      renderTasks();
      taskForm.reset();
      taskInput.focus();
    });

    clearCompleted.addEventListener("click", () => {
      tasks = tasks.filter((task) => !task.completed);
      saveTasks();
      renderTasks();
    });

    renderTasks();
  }

  // Contact form validation demonstration (no message is sent to a server).
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const fields = {
        name: document.querySelector("#name").value.trim(),
        email: document.querySelector("#email").value.trim(),
        phone: document.querySelector("#phone").value.trim(),
        message: document.querySelector("#message").value.trim()
      };
      const errors = {
        name: fields.name ? "" : "Please enter your name.",
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email) ? "" : "Enter a valid email address.",
        phone: /^\d+$/.test(fields.phone) ? "" : "Use digits only for the phone number.",
        message: fields.message ? "" : "Please enter a message."
      };

      Object.entries(errors).forEach(([field, message]) => {
        document.querySelector(`#${field}-error`).textContent = message;
      });

      const feedback = document.querySelector("#form-feedback");
      const hasErrors = Object.values(errors).some(Boolean);
      feedback.textContent = hasErrors
        ? "Please correct the highlighted fields and try again."
        : "All fields are valid. This demonstration form does not send your message.";
      feedback.className = hasErrors ? "form-feedback error" : "form-feedback success";
    });
  }
});
