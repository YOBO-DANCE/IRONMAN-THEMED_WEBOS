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

// All windows draggable, icons auto-wired via data-window, one close handler
document.querySelectorAll(".window").forEach(makeDraggable);

document.addEventListener("click", function (e) {
  var closeBtn = e.target.closest(".close-btn, #closeWindow");
  if (closeBtn) closeWindow(closeBtn.closest(".window").id);
});

document.querySelectorAll("[data-window]").forEach(function (icon) {
  icon.addEventListener("click", function () {
    var isOpen = icon.classList.toggle("selected");
    document.getElementById(icon.dataset.window).style.display = isOpen ? "flex" : "none";
  });
});

// Windows: show / hide by id
function openWindow(id) {
  document.getElementById(id).style.display = "flex";
}

function closeWindow(id) {
  document.getElementById(id).style.display = "none";
}

// Shared localStorage helper
var Store = {
  get: function (key, fallback) {
    try {
      var value = JSON.parse(localStorage.getItem(key));
      return value === null || value === undefined ? fallback : value;
    } catch (e) {
      return fallback;
    }
  },
  set: function (key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// IronBook: plain text notes saved in localStorage
var IronBook = {
  notes: [],
  currentId: null,

  init: function () {
    this.notes = Store.get("ironbook-notes", []);
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
    Store.set("ironbook-notes", this.notes);
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

// IronCalc: scientific calculator, mouse + keyboard, DEG/RAD toggle
var IronCalc = {
  tokens: [], // [{d: display text, c: code text}]
  result: "0",
  angleMode: "deg",

  // [label, class, code?, display?] — code and display default to label
  keys: [
    ["(", "fn"], [")", "fn"], ["AC", "special", "ac"], ["⌫", "special", "back"],
    ["sin(", "fn", "Math.sin("], ["cos(", "fn", "Math.cos("], ["tan(", "fn", "Math.tan("], ["÷", "op", "/"],
    ["asin(", "fn", "Math.asin("], ["acos(", "fn", "Math.acos("], ["atan(", "fn", "Math.atan("], ["×", "op", "*"],
    ["log(", "fn", "Math.log10("], ["ln(", "fn", "Math.log("], ["√(", "fn", "Math.sqrt("], ["−", "op", "-"],
    ["xʸ", "fn", "Math.pow(", "pow("], ["π", "fn", "Math.PI"], ["e", "fn", "Math.E"], ["+", "op"],
    ["7", "num"], ["8", "num"], ["9", "num"], ["DEG", "special", "mode"],
    ["4", "num"], ["5", "num"], ["6", "num"], ["=", "special tall", "eq"],
    ["1", "num"], ["2", "num"], ["3", "num"],
    ["0", "num wide"], [".", "num"]
  ],

  // Degree-mode wrappers, prepended at eval time
  degHelpers: `var DSIN=function(x){return Math.sin(x*Math.PI/180)};
var DCOS=function(x){return Math.cos(x*Math.PI/180)};
var DTAN=function(x){return Math.tan(x*Math.PI/180)};
var DASIN=function(x){return Math.asin(x)*180/Math.PI};
var DACOS=function(x){return Math.acos(x)*180/Math.PI};
var DATAN=function(x){return Math.atan(x)*180/Math.PI};`,

  init: function () {
    this.exprEl = document.querySelector("#calcExpr");
    this.resEl = document.querySelector("#calcResult");
    this.modeEl = document.querySelector("#calcMode");
    this.keypad = document.querySelector("#calcKeypad");
    this.angleMode = Store.get("ironcalc-angle", "deg");
    this.renderKeypad();
    this.updateDisplay();
    this.bindKeys();
  },

  renderKeypad: function () {
    var self = this;
    this.keypad.innerHTML = "";
    this.keys.forEach(function (k) {
      var btn = document.createElement("button");
      btn.className = "btn calc-btn " + k[1];
      btn.textContent = k[0];
      btn.addEventListener("click", function () { self.handle(k[3] || k[0], k[2] || k[0]); });
      self.keypad.appendChild(btn);
    });
  },

  handle: function (disp, code) {
    if (code === "ac") { this.tokens = []; this.result = "0"; }
    else if (code === "back") { this.tokens.pop(); }
    else if (code === "eq") { this.evaluate(); return; }
    else if (code === "mode") { this.toggleAngleMode(); return; }
    else { this.tokens.push({ d: disp, c: code }); }
    this.updateDisplay();
  },

  text: function (key) {
    return this.tokens.map(function (t) { return t[key]; }).join("");
  },

  toggleAngleMode: function () {
    this.angleMode = this.angleMode === "deg" ? "rad" : "deg";
    Store.set("ironcalc-angle", this.angleMode);
    this.modeEl.textContent = this.angleMode.toUpperCase();
  },

  evaluate: function () {
    try {
      var code = this.text("c");
      if (!code || /[+\-*/(,.]$/.test(code)) throw "Invalid";
      var pre = "";
      if (this.angleMode === "deg") {
        code = code
          .replace(/Math\.sin\(/g, "DSIN(")
          .replace(/Math\.cos\(/g, "DCOS(")
          .replace(/Math\.tan\(/g, "DTAN(")
          .replace(/Math\.asin\(/g, "DASIN(")
          .replace(/Math\.acos\(/g, "DACOS(")
          .replace(/Math\.atan\(/g, "DATAN(");
        pre = this.degHelpers;
      }
      var value = Function('"use strict";' + pre + ' return (' + code + ')')();
      if (typeof value !== "number" || !isFinite(value)) throw "Invalid";
      this.result = String(Math.round(value * 1e10) / 1e10);
      this.tokens = [{ d: this.result, c: this.result }];
    } catch (e) {
      this.result = "Error";
      this.tokens = [];
    }
    this.updateDisplay();
  },

  updateDisplay: function () {
    this.exprEl.textContent = this.text("d");
    this.resEl.textContent = this.result;
    this.modeEl.textContent = this.angleMode.toUpperCase();
  },

  bindKeys: function () {
    var self = this;
    var map = {
      "0": ["0", "0"], "1": ["1", "1"], "2": ["2", "2"], "3": ["3", "3"], "4": ["4", "4"],
      "5": ["5", "5"], "6": ["6", "6"], "7": ["7", "7"], "8": ["8", "8"], "9": ["9", "9"],
      ".": [".", "."], "+": ["+", "+"], "-": ["−", "-"], "*": ["×", "*"], "/": ["÷", "/"],
      "(": ["(", "("], ")": [")", ")"], "Enter": ["eq", "eq"], "=": ["eq", "eq"],
      "Backspace": ["back", "back"], "Escape": ["ac", "ac"]
    };
    document.addEventListener("keydown", function (e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (document.querySelector("#IronCalc").style.display === "none") return;
      if (map[e.key]) { e.preventDefault(); self.handle(map[e.key][0], map[e.key][1]); }
    });
  }
};

// IronCalc auto-wired above via .window + data-window + .close-btn
IronCalc.init();
