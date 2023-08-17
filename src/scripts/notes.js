const addNoteBtn = document.getElementById("addNoteBtn");
const addNoteDialog = document.getElementById("addNoteDialog");
const cancelAddNote = document.getElementById("cancelAddNote");
const addNoteForm = document.getElementById("addNoteForm");
const notesContainer = document.getElementById("notesContainer");
const viewNoteDialog = document.getElementById("viewNoteDialog");
const closeViewNote = document.getElementById("closeViewNote");
const viewNoteTitle = document.getElementById("viewNoteTitle");
const viewNoteContent = document.getElementById("viewNoteContent");

const confirmationDialog = document.getElementById("confirmationDialog");
const confirmDeleteButton = document.getElementById("confirmDelete");
const cancelDeleteButton = document.getElementById("cancelDelete");

let deletingIndex = -1;

const autoSavedText = document.getElementById("autoSaved");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

const updateNotesEvent = new Event("notesUpdated");
document.dispatchEvent(updateNotesEvent);

function renderNotes() {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];

  notesContainer.innerHTML = "";
  notes.forEach((note, index) => {
    if (note && note.title) {
      const card = document.createElement("div");
      card.className = `note-card rounded-lg lg:w-1/3 md:w-1/2 w-full p-4`;
      card.setAttribute("data-index", index);
      const deleteNoteBtn = document.getElementById("delete-note-btn");

      card.innerHTML = `
          <p class="note-card-heading text-lg mb-3">${note.title}</p>
          <p class="text-gray-600 p-color break-words text-base">${note.content.substring(
            0,
            50
          )}</p>
          <div class="note-card-buttons">
            <button id="delete-note-btn" class="delete-note btn" data-index="${index}">Delete</button>
          </div>`;
      card.addEventListener("click", () => {
        openViewNoteDialog(index);
      });

      notesContainer.appendChild(card);
    }
  });
}

function openAddNoteDialog() {
  addNoteDialog.classList.remove("hidden");
}

function closeAddNoteDialog() {
  addNoteDialog.classList.add("hidden");
  addNoteForm.reset();
}

function openViewNoteDialog(index) {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];

  const note = notes[index];
  viewNoteTitle.textContent = note.title;
  viewNoteContent.textContent = note.content;

  const editViewNoteTitle = document.getElementById("editViewNoteTitle");
  const editViewNoteContent = document.getElementById("editViewNoteContent");
  const closeViewNoteButton = document.getElementById("closeViewNote");

  let typingTimer;

  const doneTypingInterval = 1000;

  editViewNoteTitle.value = note.title;
  editViewNoteContent.value = note.content;

  viewNoteTitle.style.display = "none";
  editViewNoteTitle.style.display = "block";
  viewNoteContent.style.display = "none";
  editViewNoteContent.style.display = "block";

  editViewNoteTitle.addEventListener("input", () => {
    clearTimeout(typingTimer);
    let updatedTitle = editViewNoteTitle.value;
    let notesCopy = JSON.parse(JSON.stringify(notes));
    notesCopy[index].title = updatedTitle;
    localStorage.setItem("notes", JSON.stringify(notesCopy));
    notes = notesCopy;

    typingTimer = setTimeout(() => {
      autoSavedText.style.opacity = "1";
      renderNotes();
    }, doneTypingInterval);
  });

  editViewNoteContent.addEventListener("input", () => {
    clearTimeout(typingTimer);
    let updatedContent = editViewNoteContent.value;
    let notesCopy = JSON.parse(JSON.stringify(notes));
    notesCopy[index].content = updatedContent;
    localStorage.setItem("notes", JSON.stringify(notesCopy));
    notes = notesCopy;

    typingTimer = setTimeout(() => {
      renderNotes();
      autoSavedText.style.opacity = "1";
    }, doneTypingInterval);
  });

  viewNoteDialog.classList.remove("hidden");
}

function closeViewNoteDialog() {
  viewNoteDialog.classList.add("hidden");
}

function saveNote(index) {
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
}

function deleteNote(index) {
  notes.splice(index, 1);
  closeViewNoteDialog();
  saveNote();
}

// Events
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-note")) {
    closeViewNoteDialog();
    event.preventDefault();
    const noteCard = event.target.closest(".note-card");
    if (noteCard) {
      const index = parseInt(noteCard.dataset.index);
      deletingIndex = index;
      confirmationDialog.classList.remove("hidden");
      confirmDeleteButton.innerHTML = `Think again!`;
      setTimeout(() => {
        confirmDeleteButton.innerHTML = `Delete`;

        confirmDeleteButton.classList.remove("disabled");
        confirmDeleteButton.classList.remove("opacity-30");
        confirmDeleteButton.classList.remove("cursor-not-allowed");
      }, 4000);
    }
  }
});

confirmDeleteButton.addEventListener("click", () => {
  if (confirmDeleteButton.classList.contains("disabled")) {
    return;
  } else {
    if (deletingIndex !== -1) {
      deleteNote(deletingIndex);
    }
    deletingIndex = -1;
    confirmationDialog.classList.add("hidden");
    confirmDeleteButton.innerHTML = `Think again!`;

    confirmDeleteButton.classList.add("disabled");
    confirmDeleteButton.classList.add("opacity-30");
    confirmDeleteButton.classList.add("cursor-not-allowed");
  }
});

cancelDeleteButton.addEventListener("click", () => {
  deletingIndex = -1;

  confirmDeleteButton.classList.add("disabled");
  confirmDeleteButton.classList.add("opacity-30");
  confirmDeleteButton.classList.add("cursor-not-allowed");
  confirmationDialog.classList.add("hidden");
});

cancelAddNote.addEventListener("click", (event) => {
  event.preventDefault();
  closeAddNoteDialog();
});

addNoteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.getElementById("noteTitle").value;
  const content = document.getElementById("noteContent").value;
  notes.push({ title, content });
  saveNote();
  closeAddNoteDialog();
});

addNoteBtn.addEventListener("click", openAddNoteDialog);

closeViewNote.addEventListener("click", closeViewNoteDialog);

renderNotes();
