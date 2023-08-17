let todos = [];
let editingTodoIndex = -1;
let editingMode = false;
let deletedTodos = [];

// const undoButton = document.getElementById("undoButton");
// const googleSignInButton = document.getElementById("googleSignInButton");
// const signOutButton = document.getElementById("signOutButton");

const year = new Date().getFullYear();

const footerText = document.getElementById("footer-text");
footerText.innerHTML = `© ${year} — <a
href="https://github.com/preetsuthar17"
class=" p-color  ml-1"
rel="noopener noreferrer"
target="_blank"
>@preetsuthar17</a
>`;

//// Code for Todo functionality

function addTodo() {
  const nameInput = document.getElementById("name");
  const priorityInput = document.getElementById("priority");
  const dueDateInput = document.getElementById("dueDate");

  const name = nameInput.value.trim();
  const priority = priorityInput.value.trim();
  const dueDate = dueDateInput.value.trim();

  if (editingMode && editingTodoIndex !== -1) {
    todos[editingTodoIndex].name = name;
    todos[editingTodoIndex].priority = priority;
    todos[editingTodoIndex].dueDate = dueDate !== "" ? dueDate : "No Due Date";
    saveTodosToLocalStorage();
    renderTodos();
    hideModal();
    editingMode = false;
  } else {
    const newTodo = {
      name,
      priority,
      dueDate: dueDate !== "" ? dueDate : "No Due Date",
      completed: false,
    };

    todos.push(newTodo);
    saveTodosToLocalStorage();
    renderTodos();
  }

  nameInput.value = "";
  priorityInput.value = "Low";
  dueDateInput.value = "";

  const addButton = document.getElementById("addButton");
  addButton.textContent = "Add Todo";

  const formHeading = document.getElementById("formHeading");
  formHeading.textContent = "Add Todo";

  renderTodos();
}

function deleteTodo(index) {
  const deletedTodo = todos.splice(index, 1)[0];
  deletedTodos.push(deletedTodo);

  saveTodosToLocalStorage();
  renderTodos();

  const toastPopup = document.getElementById("toastPopup");
  const toastMessage = document.getElementById("toastMessage");
  const undoButton = document.getElementById("undoButton");
  const progressBar = document.getElementById("progressBar");

  toastMessage.textContent = `To-do deleted!`;
  toastPopup.classList.add("bounceInLeft");
  toastPopup.style.display = "block";

  undoButton.addEventListener("click", () => {
    setTimeout(() => {
      toastPopup.style.display = "none";
    }, 1000);
  });

  setTimeout(() => {
    const deletedIndex = deletedTodos.indexOf(deletedTodo);

    progressBar.style.width = "0%";
    toastPopup.classList.add("bounceOutRight");

    setTimeout(() => {
      toastPopup.classList.remove("bounceOutRight");
      toastPopup.style.display = "none";
    }, 1000);

    setTimeout(() => {
      progressBar.style.display = "block";
    }, 1000);

    if (deletedIndex !== -1) {
      deletedTodos.splice(deletedIndex, 1);
      saveTodosToLocalStorage();
      renderTodos();
    }
  }, 6000);
}

function markTodoCompleted(index) {
  todos[index].completed = !todos[index].completed;
  saveTodosToLocalStorage();
  renderTodos();
  if (todos[index].completed) {
    onTodoMarked();
  }
}

function renderTodos() {
  const uncompletedTodos = [];
  const completedTodos = [];

  const todoList = document.getElementById("todoList");
  const sortCriteriaSelect = document.getElementById("sortCriteria");

  const savedSortValue = localStorage.getItem("savedSortValue");
  if (savedSortValue) {
    sortCriteriaSelect.value = savedSortValue;
  }

  todoList.innerHTML = "";

  function sortAndRenderTodos() {
    const sortCriteria = sortCriteriaSelect.value;

    todos.sort((a, b) => {
      if (!a || !b) {
        return 0;
      }
      if (sortCriteria === "priority") {
        const priorityOrder = {
          High: 1,
          Medium: 2,
          Low: 3,
        };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortCriteria === "dueDate") {
        if (a.dueDate === "No Due Date" && b.dueDate === "No Due Date")
          return 0;
        if (a.dueDate === "No Due Date") return 1;
        if (b.dueDate === "No Due Date") return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }

      return 0;
    });

    localStorage.setItem("savedSortValue", sortCriteria);
    renderTodos();
  }

  document
    .getElementById("sortCriteria")
    .addEventListener("change", sortAndRenderTodos);

  window.addEventListener("load", function () {
    const savedSortValue = localStorage.getItem("savedSortValue");

    const sortCriteriaSelect = document.getElementById("sortCriteria");

    if (savedSortValue) {
      sortCriteriaSelect.value = savedSortValue;
    }

    sortAndRenderTodos();
  });

  todos.forEach((todo, index) => {
    if (todo) {
      const li = document.createElement("div");
      li.classList.add("todo-item", "lg:w-1/3", "md:w-1/2", "w-full");

      const card = document.createElement("div");
      card.classList.add(
        "todo-card",
        "h-full",
        "flex",
        "flex-col",
        "rounded-lg",
        "p-4"
      );

      if (todo.priority === "High") {
        card.classList.add("border-red-500");
      } else if (todo.priority === "Medium") {
        card.classList.add("border-yellow-500");
      } else {
        card.classList.add("border-green-500");
      }

      const content = document.createElement("div");
      content.classList.add("flex-grow");
      const label = document.createElement("label");
      label.classList.add("flex", "items-center", "cursor-pointer");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add(
        "form-checkbox",
        "todo-header",
        "rounded",
        "h-5",
        "w-5"
      );
      checkbox.checked = todo.completed;
      checkbox.onclick = () => markTodoCompleted(index);

      const span = document.createElement("span");
      span.classList.add("todo-header", "font-medium", "ml-0");
      if (todo.completed) {
        span.classList.add("completed");
      }
      span.textContent = todo.name;

      const priority = document.createElement("p");
      priority.classList.add("priority-color", "text-base");
      if (todo.priority == "High") {
        priority.textContent = `- ${todo.priority} priority`;
      } else if (todo.priority == "Medium") {
        priority.textContent = `- ${todo.priority} priority`;
      } else {
        priority.textContent = `- ${todo.priority} priority`;
      }

      const dueDate = document.createElement("p");
      dueDate.classList.add("text-gray-500", "text-base");
      if (formatDate(todo.dueDate).includes("Overdue")) {
        dueDate.innerHTML = `<span class="thin-text text-red-500">${formatDate(
          todo.dueDate
        )}</span>`;
      } else if (formatDate(todo.dueDate).includes("Today")) {
        dueDate.innerHTML = `<span class="thin-text text-red-500">${formatDate(
          todo.dueDate
        )}</span>`;
      } else {
        dueDate.innerHTML = formatDate(todo.dueDate);
      }
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("text-red-500", "mt-2", "delete-text-card");
      deleteButton.onclick = () => deleteTodo(index);

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.classList.add("p-color", "ml-2");
      editButton.onclick = () => editTodo(index);

      label.appendChild(checkbox);
      label.appendChild(span);

      content.appendChild(label);
      content.appendChild(priority);
      content.appendChild(dueDate);
      content.appendChild(deleteButton);
      content.appendChild(editButton);

      card.appendChild(content);

      li.appendChild(card);

      todoList.appendChild(li);
    }
  });
}

function undoDelete(index) {
  const deletedTodo = deletedTodos.splice(index, 1)[0];
  todos.push(deletedTodo);
  saveTodosToLocalStorage();
  renderTodos();
}

function onTodoMarked() {
  showConfetti();
  setTimeout(() => {
    const emojiContainer = document.getElementById("emojiContainer");
    emojiContainer.style.visibility = "hidden";
  }, 3000);
}

function editTodo(index) {
  showModal();
  editingTodoIndex = index;
  editingMode = true;

  const todoToEdit = todos[index];

  const nameInput = document.getElementById("name");
  const priorityInput = document.getElementById("priority");
  const dueDateInput = document.getElementById("dueDate");

  nameInput.value = todoToEdit.name;
  priorityInput.value = todoToEdit.priority;
  dueDateInput.value = todoToEdit.dueDate;

  const addButton = document.getElementById("addButton");
  addButton.textContent = "Save";

  const formHeading = document.getElementById("formHeading");
  formHeading.textContent = "Edit Todo";
}

function saveEditedTodo() {
  const nameInput = document.getElementById("name");
  const priorityInput = document.getElementById("priority");
  const dueDateInput = document.getElementById("dueDate");

  const editedName = nameInput.value.trim();
  const editedPriority = priorityInput.value.trim();
  const editedDueDate = dueDateInput.value.trim();

  if (editingTodoIndex !== -1) {
    todos[editingTodoIndex].name = editedName;
    todos[editingTodoIndex].priority = editedPriority;
    todos[editingTodoIndex].dueDate =
      editedDueDate !== "" ? editedDueDate : "No Due Date";

    saveTodosToLocalStorage();
    renderTodos();
    hideModal();
    editingTodoIndex = -1;
  }
}

function saveTodosToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodosFromLocalStorage() {
  const storedTodos = localStorage.getItem("todos");
  todos = storedTodos ? JSON.parse(storedTodos) : [];
}

function showModal() {
  document.getElementById("todoModal").style.display = "block";
}

function hideModal() {
  document.getElementById("todoModal").style.display = "none";
}

function validateForm() {
  const nameInput = document.getElementById("name");
  const priorityInput = document.getElementById("priority");

  const nameWarn = document.getElementById("form-warning1");
  const priorityWarn = document.getElementById("form-warning2");

  const nameValue = nameInput.value.trim();
  const priorityValue = priorityInput.value.trim();

  if (nameValue === "" || priorityValue === "") {
    nameWarn.style.display = "block";
    priorityWarn.style.display = "block";
    return false;
  }

  return true;
}

function formatDate(dateString) {
  if (dateString === "No Due Date") {
    return "";
  }

  const date = new Date(dateString);
  const currentDate = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  if (date.toDateString() === currentDate.toDateString()) {
    return `- Today's Due`;
  } else if (date < currentDate) {
    return `- Overdue since ${day}/${month}/${year}`;
  } else {
    return `- Due on ${day}/${month}/${year}`;
  }
}

function showConfetti() {
  const emojiContainer = document.getElementById("emojiContainer");
  emojiContainer.innerHTML = "";

  const emojis = ["🎉", "🥳", "🎈"];

  for (let i = 0; i < 20; i++) {
    const emojiElement = document.createElement("span");
    emojiElement.textContent =
      emojis[Math.floor(Math.random() * emojis.length)];
    emojiElement.style.rotate = `${Math.floor(Math.random() * 10)}deg`;
    emojiElement.style.left = `${Math.random() * 90}vw`;
    emojiElement.style.animationDuration = `${Math.random() * 2 + 3}s`;
    emojiContainer.appendChild(emojiElement);
    emojiContainer.appendChild(emojiElement);
  }

  emojiContainer.style.visibility = "visible";
}

//// Firebase

// firebase.initializeApp(firebaseConfig);

// function updateUI(user) {
//   const signInContainer = document.getElementById("signInContainer");
//   const userNameContainer = document.getElementById("userNameContainer");
//   const signOutButton = document.getElementById("signOutButton");
//   const googleSignInButton = document.getElementById("googleSignInButton");

//   if (user) {
//     signInContainer.style.display = "none";
//     userNameContainer.style.display = "block";
//     userNameContainer.innerHTML = `Hello there 👋, ${user.displayName} &nbsp;`;
//     signOutButton.style.display = "block";
//     googleSignInButton.style.display = "none";
//   } else {
//     signInContainer.style.display = "block";
//     userNameContainer.style.display = "none";
//     signOutButton.style.display = "none";
//     googleSignInButton.style.display = "flex";
//   }
// }

// function signInWithGoogle() {
//   const provider = new firebase.auth.GoogleAuthProvider();

//   firebase
//     .auth()
//     .signInWithPopup(provider)
//     .then((result) => {
//       const user = result.user;
//       console.log("Google user signed in:", user.displayName, user.email);

//       updateUI(user);
//     })
//     .catch((error) => {
//       console.error("Google sign-in error:", error);
//     });
// }

// function signOut() {
//   firebase
//     .auth()
//     .signOut()
//     .then(() => {
//       console.log("User signed out");

//       const signInContainer = document.getElementById("signInContainer");
//       const signOutContainer = document.getElementById("signOutContainer");

//       signInContainer.style.display = "block";
//       signOutContainer.style.display = "none";
//     })
//     .catch((error) => {
//       console.error("Sign-out error:", error);
//     });
// }

// firebase.auth().onAuthStateChanged((user) => {
//   updateUI(user);
// });

// firebase.auth().onAuthStateChanged((user) => {
//   if (user) {
//     signOutButton.style.display = "block";
//   } else {
//     signOutButton.style.display = "none";
//   }
// });

//// Code for notification functionality

function updateAndRenderTodos() {
  getTodosFromLocalStorage();
  renderTodos();

  todos.forEach((todo) => {
    if (todo.dueDate !== "No Due Date") {
      const dueDate = new Date(todo.dueDate);
      sendDueDateNotification(todo.name, dueDate);
    }
  });
}

if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

function sendDueDateNotification(todoName, dueDate) {
  if (Notification.permission === "granted") {
    const currentDate = new Date();
    const timeDifference = dueDate.getTime() - currentDate.getTime();

    if (timeDifference <= 0) {
      const dueOptions = {
        body: `❗ Due Today: Your task "${todoName}" is due today. Due on ${formatDate(
          dueDate
        )}`,
      };
      const dueNotification = new Notification("Due Date Reminder", dueOptions);
    } else if (timeDifference <= 86400000) {
      // 1 day in milliseconds
      const reminderOptions = {
        body: `⚠️ Reminder: Your task "${todoName}" is due in less than 24 hours. Due on ${formatDate(
          dueDate
        )}`,
      };
      const reminderNotification = new Notification(
        "Due Date Reminder",
        reminderOptions
      );

      setTimeout(() => {
        const dueOptions = {
          body: `❗ Due Today: Your task "${todoName}" is due today. Due on ${formatDate(
            dueDate
          )}`,
        };
        const dueNotification = new Notification(
          "Due Date Reminder",
          dueOptions
        );
      }, timeDifference);
    }
  }
}

//// Events

window.addEventListener("load", function () {
  setTimeout(function () {
    document.getElementById("loader").style.display = "none";
  }, 1500);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    hideModal();
  }
});

undoButton.addEventListener("click", () => {
  const toastPopup = document.getElementById("toastPopup");
  toastPopup.classList.add("bounceOutRight");
  setTimeout(() => {
    toastPopup.classList.remove("bounceOutRight");
    toastPopup.classList.remove("bounceInLeft");
    toastPopup.style.display = "none";
  }, 1000);
  if (deletedTodos.length > 0) {
    const lastDeletedTodo = deletedTodos.pop();
    todos.push(lastDeletedTodo);
    saveTodosToLocalStorage();
    renderTodos();
  }
});

window.addEventListener("load", renderTodos());

// googleSignInButton.addEventListener("click", signInWithGoogle);
// signOutButton.addEventListener("click", signOut);

getTodosFromLocalStorage();
renderTodos();
