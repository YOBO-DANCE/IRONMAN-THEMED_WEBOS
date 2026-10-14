// Clock
setInterval(function () {
  document.querySelector("#Current_Time").textContent = new Date().toLocaleString();
}, 500);

// Simple drag: drag window by its header (or whole window if no header)
// ponytail: global zTop, per-window stack only if needed
let zTop = 10;
function bringToFront(el) {
  if (el) el.style.zIndex = ++zTop;
}

function makeDraggable(element) {
  if (!element) return;
  var header = element.querySelector(".window-header") || element;

  header.addEventListener("pointerdown", function (e) {
    bringToFront(element);
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
  var el = document.getElementById(id);
  el.style.display = "flex";
  bringToFront(el);
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
    var win = document.getElementById(windowId);
    win.style.display = isOpen ? "flex" : "none";
    if (isOpen) bringToFront(win);
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
    this.list = document.querySelector("#notesList");
    this.title = document.querySelector("#noteTitle");
    this.content = document.querySelector("#noteContent");
    this.showList();
    document.querySelector("#newNoteBtn").addEventListener("click", () => this.newNote());
    document.querySelector("#saveNoteBtn").addEventListener("click", () => this.saveNote(false));
    document.querySelector("#saveAsNoteBtn").addEventListener("click", () => this.saveNote(true));
    document.querySelector("#deleteNoteBtn").addEventListener("click", () => this.deleteNote());
    this.list.addEventListener("click", (e) => {
      var li = e.target.closest("li");
      if (li) this.openNote(li.dataset.id);
    });
  },

  keep: function () {
    localStorage.setItem("ironbook-notes", JSON.stringify(this.notes));
  },

  showList: function () {
    this.list.innerHTML = "";
    this.notes.forEach((note) => {
      var li = document.createElement("li");
      li.textContent = note.title || "Untitled";
      li.dataset.id = note.id;
      if (note.id === this.currentId) li.classList.add("active");
      this.list.appendChild(li);
    });
  },

  newNote: function () {
    this.currentId = null;
    this.title.value = "";
    this.content.value = "";
    this.showList();
  },

  openNote: function (id) {
    var note = this.notes.find((n) => n.id === id);
    if (!note) return;
    this.currentId = id;
    this.title.value = note.title;
    this.content.value = note.content;
    this.showList();
  },

  saveNote: function (saveAs) {
    var title = this.title.value.trim() || "Untitled";
    var content = this.content.value;

    if (saveAs) {
      var name = prompt("Save as:", title);
      if (name === null) return; // cancelled
      title = name.trim() || "Untitled";
      this.title.value = title;
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

// IronCalc: basic calculator, mouse + keyboard
var IronCalc = {
  disp: "",   // pretty text shown in display
  code: "",   // evaluable JS built alongside disp
  result: "0",

  // [label, class, display text, code text]
  keys: [
    ["AC", "special wide", "ac", "ac"], ["÷", "op", "÷", "/"], ["×", "op", "×", "*"],
    ["7", "num", "7", "7"], ["8", "num", "8", "8"], ["9", "num", "9", "9"], ["−", "op", "−", "-"],
    ["4", "num", "4", "4"], ["5", "num", "5", "5"], ["6", "num", "6", "6"], ["+", "op", "+", "+"],
    ["1", "num", "1", "1"], ["2", "num", "2", "2"], ["3", "num", "3", "3"], ["=", "special tall", "eq", "eq"],
    ["0", "num wide", "0", "0"], [".", "num", ".", "."]
  ],

  init: function () {
    this.exprEl = document.querySelector("#calcExpr");
    this.resEl = document.querySelector("#calcResult");
    this.keypad = document.querySelector("#calcKeypad");
    localStorage.removeItem("ironcalc-angle");
    this.renderKeypad();
    this.updateDisplay();
    this.bindKeys();
  },

  renderKeypad: function () {
    var self = this;
    this.keypad.innerHTML = "";
    this.keys.forEach(function (k) {
      var btn = document.createElement("button");
      btn.className = "calc-btn " + k[1];
      btn.textContent = k[0];
      btn.addEventListener("click", function () { self.handle(k[2], k[3]); });
      self.keypad.appendChild(btn);
    });
  },

  handle: function (disp, code) {
    if (code === "ac") { this.disp = ""; this.code = ""; this.result = "0"; }
    else if (code === "back") { this.disp = this.disp.slice(0, -1); this.code = this.code.slice(0, -1); }
    else if (code === "eq") { this.evaluate(); return; }
    else { this.disp += disp; this.code += code; }
    this.updateDisplay();
  },

  evaluate: function () {
    try {
      var code = this.code;
      if (!code) return;
      if (/[^0-9+\-*/(). ]/.test(code)) throw "Invalid";
      var value = Function('"use strict"; return (' + code + ')')();
      if (typeof value !== "number" || !isFinite(value)) throw "Invalid";
      this.result = String(Math.round(value * 1e10) / 1e10);
      this.disp = this.result;
      this.code = this.result;
    } catch (e) {
      this.result = "Error";
      this.disp = "";
      this.code = "";
    }
    this.updateDisplay();
  },

  updateDisplay: function () {
    this.exprEl.textContent = this.disp;
    this.resEl.textContent = this.result;
  },

  bindKeys: function () {
    var self = this;
    var map = {
      "0": ["0", "0"], "1": ["1", "1"], "2": ["2", "2"], "3": ["3", "3"], "4": ["4", "4"],
      "5": ["5", "5"], "6": ["6", "6"], "7": ["7", "7"], "8": ["8", "8"], "9": ["9", "9"],
      ".": [".", "."], "+": ["+", "+"], "-": ["−", "-"], "*": ["×", "*"], "/": ["÷", "/"],
      "Enter": ["eq", "eq"], "=": ["eq", "eq"],
      "Backspace": ["back", "back"], "Escape": ["ac", "ac"]
    };
    document.addEventListener("keydown", function (e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (document.querySelector("#IronCalc").style.display === "none") return;
      if (map[e.key]) { e.preventDefault(); self.handle(map[e.key][0], map[e.key][1]); }
    });
  }
};

// IronCalc wiring
makeDraggable(document.querySelector("#IronCalc"));
setupIcon("#CalcOpen", "IronCalc");
document.querySelector("#closeIronCalc").addEventListener("click", function () {
  closeWindow("IronCalc");
});
IronCalc.init();
