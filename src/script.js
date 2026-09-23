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

// IronCalc: scientific calculator, mouse + keyboard, DEG/RAD toggle
var IronCalc = {
  disp: "",   // pretty text shown in display
  code: "",   // evaluable JS built alongside disp
  result: "0",
  angleMode: "deg",

  // [label, class, display text, code text]
  keys: [
    ["(", "fn", "(", "("], [")", "fn", ")", ")"], ["AC", "special", "ac", "ac"], ["⌫", "special", "back", "back"],
    ["sin", "fn", "sin(", "Math.sin("], ["cos", "fn", "cos(", "Math.cos("], ["tan", "fn", "tan(", "Math.tan("], ["÷", "op", "÷", "/"],
    ["asin", "fn", "asin(", "Math.asin("], ["acos", "fn", "acos(", "Math.acos("], ["atan", "fn", "atan(", "Math.atan("], ["×", "op", "×", "*"],
    ["log", "fn", "log(", "Math.log10("], ["ln", "fn", "ln(", "Math.log("], ["√", "fn", "√(", "Math.sqrt("], ["−", "op", "−", "-"],
    ["xʸ", "fn", "pow(", "Math.pow("], ["π", "fn", "π", "Math.PI"], ["e", "fn", "e", "Math.E"], ["+", "op", "+", "+"],
    ["7", "num", "7", "7"], ["8", "num", "8", "8"], ["9", "num", "9", "9"], ["DEG", "special", "mode", "mode"],
    ["4", "num", "4", "4"], ["5", "num", "5", "5"], ["6", "num", "6", "6"], ["=", "special tall", "eq", "eq"],
    ["1", "num", "1", "1"], ["2", "num", "2", "2"], ["3", "num", "3", "3"],
    ["0", "num wide", "0", "0"], [".", "num", ".", "."]
  ],

  // Degree-mode wrappers, defined once and prepended at eval time
  degHelpers: "var DSIN=function(x){return Math.sin(x*Math.PI/180)};"
    + "var DCOS=function(x){return Math.cos(x*Math.PI/180)};"
    + "var DTAN=function(x){return Math.tan(x*Math.PI/180)};"
    + "var DASIN=function(x){return Math.asin(x)*180/Math.PI};"
    + "var DACOS=function(x){return Math.acos(x)*180/Math.PI};"
    + "var DATAN=function(x){return Math.atan(x)*180/Math.PI};",

  init: function () {
    this.exprEl = document.querySelector("#calcExpr");
    this.resEl = document.querySelector("#calcResult");
    this.modeEl = document.querySelector("#calcMode");
    this.keypad = document.querySelector("#calcKeypad");
    this.angleMode = localStorage.getItem("ironcalc-angle") || "deg";
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
    else if (code === "mode") { this.toggleAngleMode(); return; }
    else { this.disp += disp; this.code += code; }
    this.updateDisplay();
  },

  toggleAngleMode: function () {
    this.angleMode = this.angleMode === "deg" ? "rad" : "deg";
    localStorage.setItem("ironcalc-angle", this.angleMode);
    this.modeEl.textContent = this.angleMode.toUpperCase();
  },

  evaluate: function () {
    try {
      var code = this.code;
      if (!code) return;
      // Only allow safe characters (built from our own buttons + keyboard map)
      if (/[^0-9+\-*/()., MathsincotagrlqpwPIE]/.test(code)) throw "Invalid";
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

// IronCalc wiring
makeDraggable(document.querySelector("#IronCalc"));
setupIcon("#CalcOpen", "IronCalc");
document.querySelector("#closeIronCalc").addEventListener("click", function () {
  closeWindow("IronCalc");
});
IronCalc.init();
