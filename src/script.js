// Clock
setInterval(function () {
  document.querySelector("#Current_Time").textContent = new Date().toLocaleString();
}, 500);

// Simple drag: drag window by its header (or whole window if no header)
function makeDraggable(element) {
  if (!element) return;
  var header = element.querySelector(".window-header") || element;

  header.addEventListener("pointerdown", function (e) {
    if (e.target.closest("button, input, textarea")) return;
    e.preventDefault();
    var offsetX = e.clientX - element.offsetLeft;
    var offsetY = e.clientY - element.offsetTop;

    function move(ev) {
      element.style.left = (ev.clientX - offsetX) + "px";
      element.style.top = (ev.clientY - offsetY) + "px";
    }
    function stop() {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", stop);
    }
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", stop);
  });
}

makeDraggable(document.querySelector("#WelcomeWindow"));
makeDraggable(document.querySelector("#IronPad"));

// Windows: show / hide by id
function openWindow(id) {
  document.getElementById(id).style.display = "flex";
}

function closeWindow(id) {
  document.getElementById(id).style.display = "none";
}

// Close buttons: new IronBook button + old Welcome "Close" text
document.querySelector("#closeIronPad").addEventListener("click", function () {
  closeWindow("IronPad");
});
document.querySelector("#closeWindow").addEventListener("click", function () {
  closeWindow("WelcomeWindow");
});

// Icons: first click selects, second click opens. Simple toggle.
function setupIcon(iconId, windowId) {
  var icon = document.querySelector(iconId);
  icon.addEventListener("click", function () {
    var isOpen = icon.classList.toggle("selected");
    document.getElementById(windowId).style.display = isOpen ? "flex" : "none";
  });
}

setupIcon("#WelcomeOpen", "WelcomeWindow");
setupIcon("#OpenA1", "IronPad");

// IronBook: plain text notes saved in localStorage
var IronBook = {
  notes: [],
  currentId: null,

  init: function () {
    this.notes = JSON.parse(localStorage.getItem("ironbook-notes")) || [];
    this.showList();
    document.querySelector("#newNoteBtn").addEventListener("click", () => this.newNote());
    document.querySelector("#saveNoteBtn").addEventListener("click", () => this.saveNote(false));
    document.querySelector("#saveAsNoteBtn").addEventListener("click", () => this.saveNote(true));
    document.querySelector("#deleteNoteBtn").addEventListener("click", () => this.deleteNote());
    document.querySelector("#notesList").addEventListener("click", (e) => {
      var li = e.target.closest("li");
      if (li) this.openNote(li.dataset.id);
    });
  },

  keep: function () {
    localStorage.setItem("ironbook-notes", JSON.stringify(this.notes));
  },

  showList: function () {
    var list = document.querySelector("#notesList");
    list.innerHTML = "";
    this.notes.forEach((note) => {
      var li = document.createElement("li");
      li.textContent = note.title || "Untitled";
      li.dataset.id = note.id;
      if (note.id === this.currentId) li.classList.add("active");
      list.appendChild(li);
    });
  },

  newNote: function () {
    this.currentId = null;
    document.querySelector("#noteTitle").value = "";
    document.querySelector("#noteContent").value = "";
    this.showList();
  },

  openNote: function (id) {
    var note = this.notes.find((n) => n.id === id);
    if (!note) return;
    this.currentId = id;
    document.querySelector("#noteTitle").value = note.title;
    document.querySelector("#noteContent").value = note.content;
    this.showList();
  },

  saveNote: function (saveAs) {
    var title = document.querySelector("#noteTitle").value.trim() || "Untitled";
    var content = document.querySelector("#noteContent").value;

    if (saveAs) {
      var name = prompt("Save as:", title);
      if (name === null) return; // cancelled
      title = name.trim() || "Untitled";
      document.querySelector("#noteTitle").value = title;
      this.currentId = null; // force new note
    }

    if (this.currentId === null) {
      this.currentId = Date.now().toString();
      this.notes.unshift({ id: this.currentId, title: title, content: content });
    } else {
      var note = this.notes.find((n) => n.id === this.currentId);
      note.title = title;
      note.content = content;
    }
    this.keep();
    this.showList();
  },

  deleteNote: function () {
    if (this.currentId === null) return;
    if (!confirm("Delete this note?")) return;
    this.notes = this.notes.filter((n) => n.id !== this.currentId);
    this.keep();
    this.newNote();
  }
};

IronBook.init();
