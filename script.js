// Clock
setInterval(function () {
  document.querySelector("#Current_Time").textContent = new Date().toLocaleString();
}, 500);

// Simple drag: drag window by its header
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

// Close buttons binding
document.querySelector("#closeIronPad").addEventListener("click", function () {
  closeWindow("IronPad");
});
document.querySelector("#closeWindow").addEventListener("click", function () {
  closeWindow("WelcomeWindow");
});

// Icons setup: first click selects, second click opens. Simple toggle.
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

// Resizable Windows
document.addEventListener("DOMContentLoaded", () => {
  setupWindowResizing();
});

function setupWindowResizing() {
  const directions = ['top', 'right', 'bottom', 'left', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
  const windows = document.querySelectorAll('.window');

  windows.forEach(win => {
    // 1. Inject the 8 resizer handles into each window
    directions.forEach(dir => {
      const resizer = document.createElement('div');
      resizer.className = `win-resizer ${dir}`;
      win.appendChild(resizer);

      // 2. Attach dragging mechanics
      resizer.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Stops click event propagation down to background panels

        // Get live geometric bounds
        let originalWidth = win.offsetWidth;
        let originalHeight = win.offsetHeight;
        let originalX = win.offsetLeft;
        let originalY = win.offsetTop;
        
        let originalMouseX = e.clientX;
        let originalMouseY = e.clientY;

        const minWidth = 250;
        const minHeight = 150;

        function resize(mouseEvent) {
          const widthDiff = mouseEvent.clientX - originalMouseX;
          const heightDiff = mouseEvent.clientY - originalMouseY;

          const isTop = dir.includes('top');
          const isBottom = dir.includes('bottom');
          const isLeft = dir.includes('left');
          const isRight = dir.includes('right');

          // Horizontal management
          if (isRight) {
            const width = originalWidth + widthDiff;
            if (width > minWidth) win.style.width = `${width}px`;
          } else if (isLeft) {
            const width = originalWidth - widthDiff;
            if (width > minWidth) {
              win.style.width = `${width}px`;
              win.style.left = `${originalX + widthDiff}px`;
            }
          }

          // Vertical management
          if (isBottom) {
            const height = originalHeight + heightDiff;
            if (height > minHeight) win.style.height = `${height}px`;
          } else if (isTop) {
            const height = originalHeight - heightDiff;
            if (height > minHeight) {
              win.style.height = `${height}px`;
              win.style.top = `${originalY + heightDiff}px`;
            }
          }
        }

        function stopResize() {
          window.removeEventListener('mousemove', resize);
          window.removeEventListener('mouseup', stopResize);
        }

        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResize);
      });
    });
  });
}

// IronPlayer
var IronPlayer = {
    playlist: [
        {
            title: "Babydoll",
            artist: "Dominic Fike",
            src: "../Test_playlist/Babydoll.mp3"
        },
        {
            title: "Daylight",
            artist: "David Kushner",
            src: "../Test_playlist/David Kushner - Daylight Official Music Video.mp3"
        },
        {
            title: "End Of Beginning",
            artist: "Djo",
            src: "../Test_playlist/Djo - End Of Beginning Official Audio.mp3"
        },
        {
            title: "white keys",
            artist: "Dominic Fike",
            src: "../Test_playlist/Dominic Fike - white keys Lyrics.mp3"
        },
        {
            title: "Perfect",
            artist: "Ed Sheeran",
            src: "../Test_playlist/Ed Sheeran - Perfect Lyrics.mp3"
        },
        {
            title: "Sailor Song",
            artist: "Gigi Perez",
            src: "../Test_playlist/Gigi Perez - Sailor Song Official Music Video.mp3"
        },
        {
            title: "Too Sweet",
            artist: "Hozier",
            src: "../Test_playlist/Hozier - Too Sweet Official Video.mp3"
        },
        {
            title: "Earrings",
            artist: "Malcolm Todd",
            src: "../Test_playlist/Malcolm Todd - Earrings Official Visualizer.mp3"
        },
        {
            title: "back to friends",
            artist: "sombr",
            src: "../Test_playlist/sombr - back to friends official video.mp3"
        },
        {
            title: "Bad Habit",
            artist: "Steve Lacy",
            src: "../Test_playlist/Steve Lacy - Bad Habit Official Video.mp3"
        },
        {
          title: "Dracula",
          artist: "Tama Impala",
          src: "../Test_playlist/Tame Impala - Dracula Official Video.mp3"
        },
        {
          title: "Loser",
          artist: "Tama Impala",
          src: "../Test_playlist/Temper City - Self Aware Official Video.mp3"
        },
        {
          title: "Self Aware",
          artist: "Temper City",
          src: "../Test_playlist/Temper City - Self Aware Official Video.mp3"
        },
        {
          title: "Riptide",
          artist: "Vance Joy",
          src: "../Test_playlist/Vance Joy - Riptide Official Video.mp3"
        }
    ],
    currentIndex: 0,
    isPlaying: false,

    init: function () {
        // Cache DOM elements
        this.audio = document.getElementById("audioEngine");
        this.titleEl = document.getElementById("trackTitle");
        this.artistEl = document.getElementById("trackArtist");
        this.playBtn = document.getElementById("playPauseBtn");
        this.progress = document.getElementById("trackProgress");
        this.volume = document.getElementById("volumeSlider");
        this.select = document.getElementById("trackSelect");

        if (!this.audio) return;

        this.playlist.forEach((track, index) => {
            var opt = document.createElement("option");
            opt.value = index;
            opt.textContent = track.title;
            this.select.appendChild(opt);
        });

        // Event Listeners for controls
        this.playBtn.addEventListener("click", () => this.togglePlay());
        document.getElementById("prevTrackBtn").addEventListener("click", () => this.prevTrack());
        document.getElementById("nextTrackBtn").addEventListener("click", () => this.nextTrack());

        this.select.addEventListener("change", (e) => {
            this.loadTrack(parseInt(e.target.value));
            this.playTrack();
        });

        this.volume.addEventListener("input", (e) => {
            this.audio.volume = e.target.value / 100;
        });

        this.audio.addEventListener("timeupdate", () => {
            if (this.audio.duration) {
                this.progress.value = (this.audio.currentTime / this.audio.duration) * 100;
            }
        });

        this.progress.addEventListener("input", (e) => {
            if (this.audio.duration) {
                this.audio.currentTime = (e.target.value / 100) * this.audio.duration;
            }
        });

        this.audio.addEventListener("ended", () => {
            this.nextTrack();
        });

        // Initialize default volume and first track metadata
        this.audio.volume = this.volume.value / 100;
        this.loadTrack(0);
    },

    loadTrack: function (index) {
        this.currentIndex = index;
        var track = this.playlist[index];
        this.audio.src = track.src;
        this.titleEl.textContent = track.title;
        this.artistEl.textContent = track.artist;
        this.select.value = index;
    },

    togglePlay: function () {
        if (this.isPlaying) {
            this.audio.pause();
            this.playBtn.textContent = "▶";
            this.isPlaying = false;
        } else {
            this.playTrack();
        }
    },

    playTrack: function () {
        this.audio.play().then(() => {
            this.playBtn.textContent = "⏸";
            this.isPlaying = true;
        }).catch(err => {
            console.log("Playback prevented or error loading audio source.");
        });
    },

    nextTrack: function () {
        var next = (this.currentIndex + 1) % this.playlist.length;
        this.loadTrack(next);
        this.playTrack();
    },

    prevTrack: function () {
        var prev = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(prev);
        this.playTrack();
    }
};

makeDraggable(document.querySelector("#IronPlayer"));
setupIcon("#PlayerOpen", "IronPlayer");
document.querySelector("#closeIronPlayer").addEventListener("click", function () {
    closeWindow("IronPlayer");
});
IronPlayer.init();

// IronBook
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
      if (name === null) return;
      title = name.trim() || "Untitled";
      this.title.value = title;
      this.currentId = null;
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

// IronCalc
var IronCalc = {
  disp: "",
  code: "",
  result: "0",

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

makeDraggable(document.querySelector("#IronCalc"));
setupIcon("#CalcOpen", "IronCalc");
document.querySelector("#closeIronCalc").addEventListener("click", function () {
  closeWindow("IronCalc");
});
IronCalc.init();

// Javis_Terminal
var Javis_Terminal = {
    history: [],
    historyIndex: -1,

    init: function () {
        this.outputEl = document.querySelector("#terminalOutput");
        this.inputEl = document.querySelector("#terminalInput");
        
        if (!this.inputEl || !this.outputEl) return;

        this.inputEl.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                var cmd = this.inputEl.value.trim();
                if (cmd) {
                    this.executeCommand(cmd);
                    this.history.push(cmd);
                    this.historyIndex = this.history.length;
                    this.inputEl.value = "";
                }
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.inputEl.value = this.history[this.historyIndex];
                }
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                if (this.historyIndex < this.history.length - 1) {
                    this.historyIndex++;
                    this.inputEl.value = this.history[this.historyIndex];
                } else {
                    this.historyIndex = this.history.length;
                    this.inputEl.value = "";
                }
            }
        });

        var termWin = document.querySelector("#Javis_Terminal");
        if (termWin) {
            termWin.addEventListener("click", () => {
                this.inputEl.focus();
            });
        }
    },

    printLine: function (text, isHtml = false) {
        var p = document.createElement("p");
        if (isHtml) {
            p.innerHTML = text;
        } else {
            p.textContent = text;
        }
        this.outputEl.appendChild(p);
        this.outputEl.scrollTop = this.outputEl.scrollHeight;
    },

    executeCommand: function (rawCmd) {
        this.printLine(`iron@jarvis:~$ ${rawCmd}`);
        
        var parts = rawCmd.split(" ");
        var cmd = parts[0].toLowerCase();
        var args = parts.slice(1);

        switch (cmd) {
            case "help":
                this.printLine("Available commands:");
                this.printLine("  help             - Show this help menu");
                this.printLine("  clear            - Clear terminal screen");
                this.printLine("  time             - Display current date and time");
                this.printLine("  echo [text]      - Echo back provided text");
                this.printLine("  calc [expr]      - Evaluate math expression (e.g. calc 25 * 4)");
                this.printLine("  open [app]       - Launch app (notepad, calc)");
                break;

            case "clear":
                this.outputEl.innerHTML = "";
                break;

            case "time":
                this.printLine(`System Time: ${new Date().toLocaleString()}`);
                break;

            case "echo":
                this.printLine(args.join(" ") || "");
                break;

            case "calc":
                try {
                    var expr = args.join("");
                    if (!expr) throw new Error("No expression");
                    if (/[^0-9+\-*/(). ]/.test(expr)) throw new Error("Invalid characters");
                    var res = Function('"use strict"; return (' + expr + ')')();
                    this.printLine(`Result: ${res}`);
                } catch (err) {
                    this.printLine("Error: Invalid calculation syntax.");
                }
                break;

            case "open":
                var target = (args[0] || "").toLowerCase();
                if (target === "notepad" || target === "ironbook") {
                    openWindow("IronPad");
                    this.printLine("Opening IronBook...");
                } else if (target === "calc" || target === "calculator") {
                    openWindow("IronCalc");
                    this.printLine("Opening IronCalc...");
                } else {
                    this.printLine(`Unknown app: '${args[0]}'. Try 'notepad' or 'calc'.`);
                }
                break;

            default:
                this.printLine(`Command not recognized: '${cmd}'. Type 'help' for options.`);
                break;
        }
    }
};

makeDraggable(document.querySelector("#Javis_Terminal"));
setupIcon("#TermOpen", "Javis_Terminal");
document.querySelector("#closeJavis_Terminal").addEventListener("click", function () {
    closeWindow("Javis_Terminal");
});
Javis_Terminal.init();