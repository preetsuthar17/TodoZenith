let todos = [];
let editingTodoIndex = -1;
let editingMode = false;
let deletedTodos = [];
let groups = JSON.parse(localStorage.getItem("groups")) || [];
let selectedGroup = null || "No groups";

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

function saveGroup() {
  const groupInput = document.getElementById("group");
  const groupName = groupInput.value.trim();

  if (groupName) {
    groups.push(groupName);
    localStorage.setItem("groups", JSON.stringify(groups));
    groupInput.value = "";

    updateGroupDropdown();

    const groupDropdown = document.getElementById("groupDropdown");
    groupDropdown.value = groupName;

    selectGroup();
  }
}

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
    todos[editingTodoIndex].group = selectedGroup || "No groups";
    saveTodosToLocalStorage();
    renderGroupButtons();
    renderTodos();
    hideModal();
    editingMode = false;
  } else {
    const newTodo = {
      name: nameInput.value.trim(),
      priority: priorityInput.value.trim(),
      dueDate: dueDateInput.value.trim() || "No Due Date",
      group: selectedGroup || "No groups",
    };

    todos.push(newTodo);
    saveTodosToLocalStorage();
    renderTodos();
    renderGroupButtons();
    if (!selectedGroup) {
      selectedGroup = null;
      const groupDropdown = document.getElementById("groupDropdown");
      groupDropdown.value = "";
    }
  }

  nameInput.value = "";
  priorityInput.value = "High";
  dueDateInput.value = "";

  const addButton = document.getElementById("addButton");
  addButton.textContent = "Add Todo";

  const formHeading = document.getElementById("formHeading");
  formHeading.textContent = "Add Todo";
  renderTodos();
}

function updateGroupDropdown() {
  const groupDropdown = document.getElementById("groupDropdown");

  while (groupDropdown.firstChild) {
    groupDropdown.removeChild(groupDropdown.firstChild);
  }

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "No group";
  groupDropdown.appendChild(defaultOption);

  groups.forEach((group) => {
    const option = document.createElement("option");
    option.value = group;
    option.textContent = group;
    groupDropdown.appendChild(option);
  });
}

function selectGroup() {
  const groupDropdown = document.getElementById("groupDropdown");
  selectedGroup = groupDropdown.value || null;

  renderTodos(selectedGroup);
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
    renderGroupButtons();
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

function renderTodos(group) {
  const todoListContainer = document.getElementById("todoList");
  const sortCriteriaSelect = document.getElementById("sortCriteria");

  let todos = getTodos(group);
  let selectedTodos = todos.filter((todo) => todo.group === group);

  selectedTodos.forEach((todo) => {
    console.log(
      `Name: ${todo.name}, Priority: ${todo.priority}, Due Date: ${todo.dueDate}`
    );
  });
  const savedSortValue = localStorage.getItem("savedSortValue");

  if (savedSortValue) {
    sortCriteriaSelect.value = savedSortValue;
  }

  const sortedTodos = sortTodos(todos);
  todoListContainer.innerHTML = "";

  sortedTodos.forEach((todo, index) => {
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
      const group = document.createElement("p");
      group.innerText = `${todo.group || "No group"}`;
      dueDate.classList.add("text-gray-500", "text-base");
      if (todo.dueDate) {
        const formattedDate = formatDate(todo.dueDate);

        if (
          formattedDate.includes("Overdue") ||
          formattedDate.includes("Today")
        ) {
          dueDate.innerHTML = `<span class="thin-text text-red-500">${formattedDate}</span>`;
        } else {
          dueDate.innerHTML = formattedDate;
        }
      } else {
        dueDate.innerHTML = "No due date";
      }

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.classList.add("p-color", "mr-2", "btn");
      editButton.onclick = () => editTodo(index);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("text-red-500", "mt-2", "delete-btn");
      deleteButton.onclick = () => deleteTodo(index);

      label.appendChild(checkbox);
      label.appendChild(span);

      content.appendChild(label);
      content.appendChild(priority);
      content.appendChild(group);
      content.appendChild(dueDate);
      content.appendChild(editButton);
      content.appendChild(deleteButton);

      card.appendChild(content);

      li.appendChild(card);

      todoListContainer.appendChild(li);
    }
  });
}

function getTodos(group) {
  const allTodos = JSON.parse(localStorage.getItem("todos")) || [];
  return group ? allTodos.filter((todo) => todo.group === group) : allTodos;
}

function renderGroupButtons() {
  const groupButtonsContainer = document.getElementById(
    "groupButtonsContainer"
  );
  groupButtonsContainer.innerHTML = "";

  const allButtonContainer = document.createElement("div");
  const allButton = document.createElement("button");
  allButton.textContent = "All";
  allButton.className = `btn ${
    selectedGroup === null ? "bg-green-500" : "bg-gray-200"
  } py-1 rounded`;
  allButton.onclick = () => {
    selectedGroup = null;
    renderTodos(selectedGroup);
    renderGroupButtons();
  };
  allButtonContainer.appendChild(allButton);
  groupButtonsContainer.appendChild(allButtonContainer);

  groups.forEach((group) => {
    const buttonContainer = document.createElement("div");

    const button = document.createElement("button");
    button.textContent = group;
    button.className = `btn ${
      selectedGroup === group ? "bg-green-500" : "bg-gray-200"
    } py-1 rounded`;
    button.onclick = () => {
      selectedGroup = group;
      renderTodos(selectedGroup);
      renderGroupButtons();
    };

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path fill="currentColor" d="M9 17h2V8H9zm4 0h2V8h-2zm-8 4V6H4V4h5V3h6v1h5v2h-1v15z"/></svg>';
    deleteButton.classList.add("text-red-500", "ml-2");

    deleteButton.onclick = () => deleteGroup(group);

    buttonContainer.appendChild(button);
    buttonContainer.appendChild(deleteButton);
    groupButtonsContainer.appendChild(buttonContainer);
  });
}

function deleteGroup(groupToDelete) {
  if (
    confirm(`Are you sure you want to delete the group "${groupToDelete}"?`)
  ) {
    todos = todos.map((todo) => ({
      ...todo,
      group: todo.group === groupToDelete ? "No groups" : todo.group,
    }));

    const groupIndex = groups.indexOf(groupToDelete);
    if (groupIndex !== -1) {
      groups.splice(groupIndex, 1);
    }

    saveTodosToLocalStorage();
    localStorage.setItem("groups", JSON.stringify(groups));

    updateGroupDropdown();
    renderTodos();
    renderGroupButtons();
  }
}

function undoDelete(index) {
  const deletedTodo = deletedTodos.splice(index, 1)[0];
  todos.push(deletedTodo);
  saveTodosToLocalStorage();
  renderTodos();
  renderGroupButtons();
}

function createTodoCard(todo) {
  const todoCard = document.createElement("div");
  todoCard.classList.add("p-2", "lg:w-1/3", "md:w-1/2", "w-full");

  let dueDateSection = "";
  if (todo.dueDate) {
    const parsedDueDate = new Date(todo.dueDate);
    if (!isNaN(parsedDueDate.getTime())) {
      dueDateSection = `<p class="text-gray-500">Due Date: ${parsedDueDate.toDateString()}</p>`;
    } else {
      // Handle invalid dueDate
      dueDateSection = `<p class="text-gray-500">Invalid Due Date</p>`;
    }
  }

  return todoCard;
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
  renderGroupButtons();
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

function sortTodos(todos) {
  return todos.sort((a, b) => {
    // Add your sorting logic here
    // For example, sorting by due date
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    return dateA - dateB;
  });
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
updateGroupDropdown();
renderGroupButtons();
