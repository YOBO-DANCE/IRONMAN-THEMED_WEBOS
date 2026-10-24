// Clock (Thanks for the Jam, love it hehe)
setInterval(function () {
  document.querySelector("#current_time").textContent =
    new Date().toLocaleString();
}, 500);

// Iron PC Info
var ironpc_info = {
  init: function () {
    this.core_el = document.querySelector("#processor_value");
    this.temp_el = document.querySelector("#temp_value");
    this.ram_el = document.querySelector("#ram_value");

    this.update_metrics();
    setInterval(() => this.update_metrics(), 2000);
  },

  update_metrics: function () {
    if (this.core_el) {
      var core = (12.6 + Math.random() * 4.9).toFixed(1);
      this.core_el.textContent = core + "%";
    }
    if (this.temp_el) {
      var temp = Math.floor(24 + Math.random() * 5);
      this.temp_el.textContent = temp + "°C";
    }
    if (this.ram_el) {
      var ram = (89.8 + Math.random() * 0.8).toFixed(1);
      this.ram_el.textContent = ram + " GB";
    }
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => ironpc_info.init());
} else {
  ironpc_info.init();
}

let z_top = 10;
function bring_to_front(el) {
  if (el) el.style.zIndex = ++z_top;
}

function make_draggable(element) {
  if (!element) return;
  var header = element.querySelector(".window_header") || element;

  header.addEventListener("pointerdown", function (e) {
    bring_to_front(element);
    if (e.target.closest("button, input, textarea")) return;
    e.preventDefault();
    var offset_x = e.clientX - element.offsetLeft;
    var offset_y = e.clientY - element.offsetTop;

    function move(ev) {
      element.style.left = ev.clientX - offset_x + "px";
      element.style.top = ev.clientY - offset_y + "px";
    }
    function stop() {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", stop);
    }
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", stop);
  });
}

make_draggable(document.querySelector("#welcome_window"));
make_draggable(document.querySelector("#iron_pad"));

function open_window(id) {
  var el = document.getElementById(id);
  el.style.display = "flex";
  bring_to_front(el);
}

function close_window(id) {
  document.getElementById(id).style.display = "none";
}

function evaluate_math_expression(expr) {
  if (typeof expr !== "string") return null;

  const normalized = expr
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/π/g, "pi")
    .replace(/\s+/g, "");

  if (!normalized) return null;

  const with_implicit_multiplication = normalized.replace(
    /(\d|\))(?=\()/g,
    "$1*",
  );

  if (
    typeof window !== "undefined" &&
    window.math &&
    typeof window.math.evaluate === "function"
  ) {
    try {
      const value = window.math.evaluate(with_implicit_multiplication);
      if (typeof value === "number" && Number.isFinite(value)) return value;
      if (value && typeof value.valueOf === "function") {
        const raw_value = value.valueOf();
        if (typeof raw_value === "number" && Number.isFinite(raw_value)) {
          return raw_value;
        }
      }
    } catch (error) {
      // If the custom check fails, use the default native evaluator instead.
    }
  }

  try {
    const value = Function('"use strict"; return (' + with_implicit_multiplication + ")")();
    if (typeof value === "number" && Number.isFinite(value)) return value;
  } catch (error) {
    return null;
  }

  return null;
}

document
  .querySelector("#close_welcome_window")
  .addEventListener("click", () => {
    close_window("welcome_window");
  });

document.querySelector("#close_iron_pad").addEventListener("click", () => {
  close_window("iron_pad");
});

function setup_icon(icon_id, window_id) {
  var icon = document.querySelector(icon_id);
  icon.addEventListener("click", function () {
    var is_open = icon.classList.toggle("selected");
    var win = document.getElementById(window_id);
    win.style.display = is_open ? "flex" : "none";
    if (is_open) bring_to_front(win);
  });
}

setup_icon("#welcome_open", "welcome_window");
setup_icon("#iron_book_open", "iron_pad");

document.addEventListener("DOMContentLoaded", () => {
  setup_window_resizing();
});

function setup_window_resizing() {
  const directions = [
    "top",
    "right",
    "bottom",
    "left",
    "top_left",
    "top_right",
    "bottom_left",
    "bottom_right",
  ];
  const windows = document.querySelectorAll(".window");

  windows.forEach((win) => {
    directions.forEach((dir) => {
      const resizer = document.createElement("div");
      resizer.className = `win_resizer ${dir}`;
      win.appendChild(resizer);

      resizer.addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation();

        let original_width = win.offsetWidth;
        let original_height = win.offsetHeight;
        let original_x = win.offsetLeft;
        let original_y = win.offsetTop;

        let original_mouse_x = e.clientX;
        let original_mouse_y = e.clientY;

        const min_width = 250;
        const min_height = 150;

        function resize(mouse_event) {
          const width_diff = mouse_event.clientX - original_mouse_x;
          const height_diff = mouse_event.clientY - original_mouse_y;

          const is_top = dir.includes("top");
          const is_bottom = dir.includes("bottom");
          const is_left = dir.includes("left");
          const is_right = dir.includes("right");

          if (is_right) {
            const width = original_width + width_diff;
            if (width > min_width) win.style.width = `${width}px`;
          } else if (is_left) {
            const width = original_width - width_diff;
            if (width > min_width) {
              win.style.width = `${width}px`;
              win.style.left = `${original_x + width_diff}px`;
            }
          }

          if (is_bottom) {
            const height = original_height + height_diff;
            if (height > min_height) win.style.height = `${height}px`;
          } else if (is_top) {
            const height = original_height - height_diff;
            if (height > min_height) {
              win.style.height = `${height}px`;
              win.style.top = `${original_y + height_diff}px`;
            }
          }
        }

        function stop_resize() {
          window.removeEventListener("mousemove", resize);
          window.removeEventListener("mouseup", stop_resize);
        }

        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stop_resize);
      });
    });
  });
}

var iron_player = {
  playlist: [
    {
      title: "Iron Man",
      artist: "Black Sabbath",
      src: "../Test_playlist/black sabbath - Iron Man.mp3",
    },
    {
      title: "Babydoll",
      artist: "Dominic Fike",
      src: "../Test_playlist/Babydoll.mp3",
    },
    {
      title: "Daylight",
      artist: "David Kushner",
      src: "../Test_playlist/David Kushner - Daylight Official Music Video.mp3",
    },
    {
      title: "End Of Beginning",
      artist: "Djo",
      src: "../Test_playlist/Djo - End Of Beginning Official Audio.mp3",
    },
    {
      title: "white keys",
      artist: "Dominic Fike",
      src: "../Test_playlist/Dominic Fike - white keys Lyrics.mp3",
    },
    {
      title: "Perfect",
      artist: "Ed Sheeran",
      src: "../Test_playlist/Ed Sheeran - Perfect Lyrics.mp3",
    },
    {
      title: "Sailor Song",
      artist: "Gigi Perez",
      src: "../Test_playlist/Gigi Perez - Sailor Song Official Music Video.mp3",
    },
    {
      title: "Too Sweet",
      artist: "Hozier",
      src: "../Test_playlist/Hozier - Too Sweet Official Video.mp3",
    },
    {
      title: "Earrings",
      artist: "Malcolm Todd",
      src: "../Test_playlist/Malcolm Todd - Earrings Official Visualizer.mp3",
    },
    {
      title: "back to friends",
      artist: "sombr",
      src: "../Test_playlist/sombr - back to friends official video.mp3",
    },
    {
      title: "Bad Habit",
      artist: "Steve Lacy",
      src: "../Test_playlist/Steve Lacy - Bad Habit Official Video.mp3",
    },
    {
      title: "Dracula",
      artist: "Tame Impala",
      src: "../Test_playlist/Tame Impala - Dracula Official Video.mp3",
    },
    {
      title: "Loser",
      artist: "Tama Impala",
      src: "../Test_playlist/Temper City - Self Aware Official Video.mp3",
    },
    {
      title: "Self Aware",
      artist: "Temper City",
      src: "../Test_playlist/Temper City - Self Aware Official Video.mp3",
    },
    {
      title: "Riptide",
      artist: "Vance Joy",
      src: "../Test_playlist/Vance Joy - Riptide Official Video.mp3",
    },
  ],
  current_index: 0,
  is_playing: false,

  init: function () {
    this.audio = document.getElementById("audio_engine");
    this.title_el = document.getElementById("track_title");
    this.artist_el = document.getElementById("track_artist");
    this.play = document.getElementById("play_pause");
    this.progress = document.getElementById("track_progress");
    this.volume = document.getElementById("volume_slider");
    this.select = document.getElementById("track_select");

    if (!this.audio) return;

    this.playlist.forEach((track, index) => {
      var opt = document.createElement("option");
      opt.value = index;
      opt.textContent = track.title;
      this.select.appendChild(opt);
    });

    this.play.addEventListener("click", () => this.toggle_play());
    document
      .getElementById("prev_track")
      .addEventListener("click", () => this.prev_track());
    document
      .getElementById("next_track")
      .addEventListener("click", () => this.next_track());

    this.select.addEventListener("change", (e) => {
      this.load_track(parseInt(e.target.value));
      this.play_track();
    });

    this.volume.addEventListener("input", (e) => {
      this.audio.volume = e.target.value / 100;
    });

    this.audio.addEventListener("timeupdate", () => {
      if (this.audio.duration) {
        this.progress.value =
          (this.audio.currentTime / this.audio.duration) * 100;
      }
    });

    this.progress.addEventListener("input", (e) => {
      if (this.audio.duration) {
        this.audio.currentTime = (e.target.value / 100) * this.audio.duration;
      }
    });

    this.audio.addEventListener("ended", () => {
      this.next_track();
    });

    this.audio.volume = this.volume.value / 100;
    this.load_track(0);
  },

  load_track: function (index) {
    this.current_index = index;
    var track = this.playlist[index];
    this.audio.src = track.src;
    this.title_el.textContent = track.title;
    this.artist_el.textContent = track.artist;
    this.select.value = index;
  },

  toggle_play: function () {
    if (this.is_playing) {
      this.audio.pause();
      this.play.textContent = "▶";
      this.is_playing = false;
    } else {
      this.play_track();
    }
  },

  play_track: function () {
    this.audio
      .play()
      .then(() => {
        this.play.textContent = "⏸";
        this.is_playing = true;
      })
      .catch(() => {
        console.log("Playback prevented or error loading audio source.");
      });
  },

  next_track: function () {
    var next = (this.current_index + 1) % this.playlist.length;
    this.load_track(next);
    this.play_track();
  },

  prev_track: function () {
    var prev =
      (this.current_index - 1 + this.playlist.length) % this.playlist.length;
    this.load_track(prev);
    this.play_track();
  },
};

make_draggable(document.querySelector("#iron_player"));
setup_icon("#player_open", "iron_player");
document
  .querySelector("#close_iron_player")
  .addEventListener("click", function () {
    close_window("iron_player");
  });
iron_player.init();

var iron_book = {
  notes: [],
  current_id: null,

  init: function () {
    this.notes = JSON.parse(localStorage.getItem("iron_book_notes")) || [];
    this.list = document.querySelector("#notes_list");
    this.title = document.querySelector("#note_title");
    this.content = document.querySelector("#note_content");
    this.show_list();
    document
      .querySelector("#new_note")
      .addEventListener("click", () => this.new_note());
    document
      .querySelector("#save_note")
      .addEventListener("click", () => this.save_note(false));
    document
      .querySelector("#save_as_note")
      .addEventListener("click", () => this.save_note(true));
    document
      .querySelector("#delete_note")
      .addEventListener("click", () => this.delete_note());
    this.list.addEventListener("click", (e) => {
      var li = e.target.closest("li");
      if (li) this.open_note(li.dataset.id);
    });
  },

  keep: function () {
    localStorage.setItem("iron_book_notes", JSON.stringify(this.notes));
  },

  show_list: function () {
    this.list.innerHTML = "";
    this.notes.forEach((note) => {
      var li = document.createElement("li");
      li.textContent = note.title || "Untitled";
      li.dataset.id = note.id;
      if (note.id === this.current_id) li.classList.add("active");
      this.list.appendChild(li);
    });
  },

  new_note: function () {
    this.current_id = null;
    this.title.value = "";
    this.content.value = "";
    this.show_list();
  },

  open_note: function (id) {
    var note = this.notes.find((n) => n.id === id);
    if (!note) return;
    this.current_id = id;
    this.title.value = note.title;
    this.content.value = note.content;
    this.show_list();
  },

  save_note: function (save_as) {
    var title = this.title.value.trim() || "Untitled";
    var content = this.content.value;

    if (save_as) {
      var name = prompt("Save as:", title);
      if (name === null) return;
      title = name.trim() || "Untitled";
      this.title.value = title;
      this.current_id = null;
    }

    if (this.current_id === null) {
      this.current_id = Date.now().toString();
      this.notes.unshift({
        id: this.current_id,
        title: title,
        content: content,
      });
    } else {
      var note = this.notes.find((n) => n.id === this.current_id);
      note.title = title;
      note.content = content;
    }
    this.keep();
    this.show_list();
  },

  delete_note: function () {
    if (this.current_id === null) return;
    if (!confirm("Delete this note?")) return;
    this.notes = this.notes.filter((n) => n.id !== this.current_id);
    this.keep();
    this.new_note();
  },
};

iron_book.init();

var iron_calc = {
  disp: "",
  code: "",
  result: "0",

  keys: [
    ["AC", "special wide", "ac", "ac"],
    ["÷", "op", "÷", "/"],
    ["×", "op", "×", "*"],
    ["7", "num", "7", "7"],
    ["8", "num", "8", "8"],
    ["9", "num", "9", "9"],
    ["−", "op", "−", "-"],
    ["4", "num", "4", "4"],
    ["5", "num", "5", "5"],
    ["6", "num", "6", "6"],
    ["+", "op", "+", "+"],
    ["1", "num", "1", "1"],
    ["2", "num", "2", "2"],
    ["3", "num", "3", "3"],
    ["=", "special tall", "eq", "eq"],
    ["0", "num wide", "0", "0"],
    [".", "num", ".", "."],
  ],

  init: function () {
    this.expr_el = document.querySelector("#calc_expr");
    this.res_el = document.querySelector("#calc_result");
    this.keypad = document.querySelector("#calc_keypad");
    localStorage.removeItem("iron_calc_angle");
    this.render_keypad();
    this.update_display();
    this.bind_keys();
  },

  render_keypad: function () {
    var self = this;
    this.keypad.innerHTML = "";
    this.keys.forEach(function (key) {
      var btn = document.createElement("button");
      btn.className = "calc " + key[1];
      btn.textContent = key[0];
      btn.addEventListener("click", function () {
        self.handle(key[2], key[3]);
      });
      self.keypad.appendChild(btn);
    });
  },

  handle: function (disp, code) {
    if (code === "ac") {
      this.disp = "";
      this.code = "";
      this.result = "0";
    } else if (code === "back") {
      this.disp = this.disp.slice(0, -1);
      this.code = this.code.slice(0, -1);
    } else if (code === "eq") {
      this.evaluate();
      return;
    } else {
      this.disp += disp;
      this.code += code;
    }
    this.update_display();
  },

  evaluate: function () {
    try {
      var code = this.code;
      if (!code) return;
      var value = evaluate_math_expression(code);
      if (value === null || typeof value !== "number" || !isFinite(value))
        throw "Invalid";
      this.result = String(Math.round(value * 1e10) / 1e10);
      this.disp = this.result;
      this.code = this.result;
    } catch (e) {
      this.result = "Error";
      this.disp = "";
      this.code = "";
    }
    this.update_display();
  },

  update_display: function () {
    this.expr_el.textContent = this.disp;
    this.res_el.textContent = this.result;
  },

  bind_keys: function () {
    var self = this;
    var map = {
      0: ["0", "0"],
      1: ["1", "1"],
      2: ["2", "2"],
      3: ["3", "3"],
      4: ["4", "4"],
      5: ["5", "5"],
      6: ["6", "6"],
      7: ["7", "7"],
      8: ["8", "8"],
      9: ["9", "9"],
      ".": [".", "."],
      "+": ["+", "+"],
      "-": ["−", "-"],
      "*": ["×", "*"],
      "/": ["÷", "/"],
      Enter: ["eq", "eq"],
      "=": ["eq", "eq"],
      Backspace: ["back", "back"],
      Escape: ["ac", "ac"],
    };
    document.addEventListener("keydown", function (e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;
      if (document.querySelector("#iron_calc").style.display === "none") return;
      if (map[e.key]) {
        e.preventDefault();
        self.handle(map[e.key][0], map[e.key][1]);
      }
    });
  },
};

make_draggable(document.querySelector("#iron_calc"));
setup_icon("#calc_open", "iron_calc");
document
  .querySelector("#close_iron_calc")
  .addEventListener("click", function () {
    close_window("iron_calc");
  });
iron_calc.init();

var jarvis_terminal = {
  history: [],
  history_index: -1,

  init: function () {
    this.output_el = document.querySelector("#terminal_output");
    this.input_el = document.querySelector("#terminal_input");

    if (!this.input_el || !this.output_el) {
      console.error("Jarvis_Terminal elements missing from DOM!");
      return;
    }

    this.input_el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.code === "Enter" || e.keyCode === 13) {
        e.preventDefault();
        e.stopPropagation();

        var cmd = this.input_el.value.trim();

        if (cmd !== "") {
          this.execute_command(cmd);
          this.history.push(cmd);
          this.history_index = this.history.length;
          this.input_el.value = "";
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (this.history_index > 0) {
          this.history_index--;
          this.input_el.value = this.history[this.history_index];
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (this.history_index < this.history.length - 1) {
          this.history_index++;
          this.input_el.value = this.history[this.history_index];
        } else {
          this.history_index = this.history.length;
          this.input_el.value = "";
        }
      }
    });

    var term_body = document.querySelector(".terminal_body");
    if (term_body) {
      term_body.addEventListener("click", () => {
        this.input_el.focus();
      });
    }
  },

  print_line: function (text, is_html = false) {
    var p = document.createElement("p");
    if (is_html) {
      p.innerHTML = text;
    } else {
      p.textContent = text;
    }
    this.output_el.appendChild(p);
    this.output_el.scrollTop = this.output_el.scrollHeight;
  },

  execute_command: function (raw_cmd) {
    this.print_line(`iron@jarvis:~$ ${raw_cmd}`);

    var parts = raw_cmd.split(" ");
    var cmd = parts[0].toLowerCase();
    var args = parts.slice(1);

    switch (cmd) {
      case "help":
        this.print_line("Available commands:");
        this.print_line("  help             - Show this help menu");
        this.print_line("  clear            - Clear terminal screen");
        this.print_line("  time             - Display current system time");
        this.print_line("  echo [text]      - Echo back text");
        this.print_line("  calc [expr]      - Evaluate math expression");
        this.print_line(
          "  open [app]       - Launch app (notepad, calc, player)",
        );
        break;

      case "clear":
        this.output_el.innerHTML = "";
        break;

      case "time":
        this.print_line(`System Time: ${new Date().toLocaleString()}`);
        break;

      case "echo":
        this.print_line(args.join(" ") || "");
        break;

      case "calc":
        try {
          var expr = args.join("");
          if (!expr) throw new Error("No expression");
          var res = evaluate_math_expression(expr);
          if (res === null || typeof res !== "number" || !isFinite(res)) {
            throw new Error("Invalid characters");
          }
          this.print_line(`Result: ${res}`);
        } catch (err) {
          this.print_line("Error: Invalid calculation syntax.");
        }
        break;

      case "open":
        var target = (args[0] || "").toLowerCase();
        if (target === "notepad" || target === "ironbook") {
          if (typeof open_window === "function") open_window("iron_pad");
          this.print_line("Opening IronBook...");
        } else if (target === "calc" || target === "calculator") {
          if (typeof open_window === "function") open_window("iron_calc");
          this.print_line("Opening IronCalc...");
        } else if (target === "player" || target === "music") {
          if (typeof open_window === "function") open_window("iron_player");
          this.print_line("Opening IronPlayer...");
        } else {
          this.print_line(
            `Unknown app: '${args[0]}'. Try 'notepad', 'calc', or 'player'.`,
          );
        }
        break;

      default:
        this.print_line(
          `Command not recognized: '${cmd}'. Type 'help' for options.`,
        );
        break;
    }
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => jarvis_terminal.init());
} else {
  jarvis_terminal.init();
}

make_draggable(document.querySelector("#jarvis_terminal"));
setup_icon("#term_open", "jarvis_terminal");
document
  .querySelector("#close_jarvis_terminal")
  .addEventListener("click", function () {
    close_window("jarvis_terminal");
  });
jarvis_terminal.init();