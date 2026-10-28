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
    if (e.target.closest("button.close, input, textarea")) return;
    e.preventDefault();

    var rect = element.getBoundingClientRect();

    element.style.left = rect.left + "px";
    element.style.top = rect.top + "px";
    element.style.transform = "none";


    var offset_x = e.clientX - rect.left;
    var offset_y = e.clientY - rect.top;

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

// Iron Explorer
var iron_explorer = {
  current_path: "/System",
  file_system: {
   "/System": [
      { name: "core_kernel.sys", type: "file", icon: "../assets/sys_icon.svg", content: "IRON_OS KERNEL v4.8 - STABLE ARCHITECTURE" },
      { name: "Jarvis.dat", type: "file", icon: "../assets/code_icon.svg", content: "Just A Rather Very Intelligent System - AI Core online." },
      { name: "security_protocols.cfg", type: "file", icon: "../assets/cfg_icon.svg", content: "LOCKDOWN_LEVEL: ALPHA\nACCESS: AUTHORIZED (YOBO-DANCE)" }
    ],
    "/Documents": [
      { name: "Welcome_Note.txt", type: "file", icon: "../assets/txt_icon.svg", content: "Welcome to Iron OS! Enjoy exploring this futuristic workspace." },
      { name: "Project_Stardance.txt", type: "file", icon: "../assets/txt_icon.svg", content: "Hack Club Stardance submission checklist: maximum features [x], clean vanilla code [x]." }
    ],
    "/Music": [
      { name: "Iron_Man_BS.mp3", type: "audio", icon: "../assets/audio_icon.svg", track_index: 0 },
      { name: "Babydoll.mp3", type: "audio", icon: "../assets/audio_icon.svg", track_index: 1 },
      { name: "Daylight.mp3", type: "audio", icon: "../assets/audio_icon.svg", track_index: 2 },
      { name: "End_Of_Beginning.mp3", type: "audio", icon: "../assets/audio_icon.svg", track_index: 3 },
      { name: "White_Keys.mp3", type: "audio", icon: "../assets/audio_icon.svg", track_index: 4 },
      { name: "Perfect.mp3", type: "audio", icon: "../assets/audio_icon.svg", track_index: 5 },
      { name: "Sailor_Song.mp3", type: "audio", icon: "../assets/audio_icon.svg", track_index: 6 },
      { name: "Too_Sweet.mp3", type: "audio", icon: "../assets/audio_icon.svg", track_index: 7 },
      { name: "Earrings.mp3", type: "audio", icon: "../assets/audio_icon.svg", track_index: 8 },
      { name: "Back_To_Friends.mp3", type: "audio", icon: "../assets/audio_icon.svg", track_index: 9 },
      { name: "Bad_Habit.mp3", type: "audio", icon: "../assets/audio_icon.svg", track_index: 10 },
      { name: "Dracula.mp3", type: "audio", icon: "../assets/audio_icon.svg", track_index: 11 },
      { name: "Loser.mp3", type: "audio", icon: "../assets/audio_icon.svg", track_index: 12 },
      { name: "Self_Aware.mp3", type: "audio", icon: "../assets/audio_icon.svg", track_index: 13 },
      { name: "Riptide.mp3", type: "audio", icon: "../assets/audio_icon.svg", track_index: 14 }
    ],
    "/Hidden_from_fury": [
      { name: "Mark_LXXXV_Schematics.enc", type: "file", icon: "../assets/secure_icon.svg", content: "CONFIDENTIAL: Nano-tech energy distribution matrix optimized." },
      { name: "Doom_Protocol.key", type: "file", icon: "../assets/key_icon.svg", content: "WARNING: Do not activate unless Stark core stability drops below 5%." }
    ]
  },

  init: function () {
    this.grid_el = document.querySelector("#explorer_grid");
    this.path_el = document.querySelector("#current_path_display");
    this.dir_list_el = document.querySelector("#dir_list");
    this.new_file_btn = document.querySelector("#new_file_btn");

    if (!this.grid_el) return;

    var saved_fs = localStorage.getItem("iron_files_system");
    if (saved_fs) {
      try {
        this.file_system = JSON.parse(saved_fs);
      } catch (err) {
        console.log("oops, couldn't parse saved file system, using default instead");
      }
    }

    this.dir_list_el.addEventListener("click", (e) => {
      var li = e.target.closest(".dir_item");
      if (!li) return;

      // remove active class from everyone first, a bit redundant but works fine
      var all_dirs = document.querySelectorAll(".dir_item");
      for(var i=0; i < all_dirs.length; i++) {
        all_dirs[i].classList.remove("active");
      }

      li.classList.add("active");
      this.current_path = li.dataset.path;
      this.render_directory();
    });

    // button to make a new file
    this.new_file_btn.addEventListener("click", () => {
      var file_name = prompt("Enter new file name (eg. iron_note.txt)", "new_document.txt");

      if (!file_name) return;
      file_name = file_name.trim();

      var folder = this.file_system[this.current_path];

      // checking if file already exists
      var file_exists = false;
      
      for(var j = 0; j < folder.length; j++) {
        if(folder[j].name === file_name) {
          file_exists = true;
          break;
        }
      }

      if (file_exists) {
        alert("A file with that name already exists!")
        return;
      }

      var ext = file_name.split(".").pop().toLowerCase();
      var icon_path = "../assets/txt_icon.svg"; // default fallback icon

      if (ext === "mp3" || ext === "wav") {
        icon_path = "../assets/audio_icon.svg";
      } 
      
      else if (ext === "sys") {
        icon_path = "../assets/sys_icon.svg";
      } 
      
      else if (ext === "cfg" || ext === "json") {
        icon_path = "../assets/cfg_icon.svg";
      } 
      
      else if (ext === "enc" || ext === "key") {
        icon_path = "../assets/secure_icon.svg";
      }

      folder.push({
        name: file_name,
        type: (ext === "mp3" || ext === "wav") ? "audio": "file",
        icon: icon_path,
        content: "Newly created document in Iron_Explorer"
      });
      
      this.save_fs();
      this.render_directory();
    });

    // clicking on a file item in the grid
    this.grid_el.addEventListener("click", (e) => {
      var item = e.target.closest(".explorer_item");
      if (!item) return;
      
      var file_name = item.dataset.name;
      var file_obj = null;
      var current_folder_files = this.file_system[this.current_path];
      
      for(var k = 0; k < current_folder_files.length; k++) {
        if(current_folder_files[k].name === file_name) {
          file_obj = current_folder_files[k];
          break;
        }
      }

      if (!file_obj) return;

      if (file_obj.type === "audio") {
        if (typeof open_window === "function") {
          open_window("iron_player");
        }
        if (typeof iron_player !== "undefined" && typeof iron_player.load_track === "function") {
          iron_player.load_track(file_obj.track_index || 0);
          iron_player.play_track();
        }
      } 
      
      else {
        if (typeof open_window === "function") {
          open_window("iron_pad");
        }
        if (typeof iron_book !== "undefined") {
          // searching notes in iron_book manually
          var existing_note = null;

          if(iron_book.notes) {
            for(var n = 0; n < iron_book.notes.length; n++) {
              if(iron_book.notes[n].title === file_obj.name) {
                existing_note = iron_book.notes[n];
                break;
              }
            }
          }

          if (existing_note) {
            iron_book.open_note(existing_note.id);
          }
          
          else {
            iron_book.current_id = null;
            iron_book.title.value = file_obj.name;
            iron_book.content.value = file_obj.content || "";
            iron_book.show_list();
          }
        }
      }
    });

    const splitter = document.querySelector("#explorer_splitter");
    const sidebar = document.querySelector(".explorer_sidebar");

    if (splitter && sidebar) {
      splitter.addEventListener("mousedown", function (e) {
        e.preventDefault();
        let startX = e.clientX;
        let startWidth = sidebar.offsetWidth;

        const handleMove = (ev) => {
          let diff = ev.clientX - startX;
          let calculatedWidth = startWidth + diff;

          if (calculatedWidth >= 100 && calculatedWidth <= 300) {
            sidebar.style.width = calculatedWidth + "px";
          }
        };

        const handleUp = () => {
          document.removeEventListener("mousemove", handleMove);
          document.removeEventListener("mouseup", handleUp);
        };

        document.addEventListener("mousemove", handleMove);
        document.addEventListener("mouseup", handleUp);
      });
    }

    this.render_directory();
  },

  save_fs: function () {
    localStorage.setItem("iron_files_system", JSON.stringify(this.file_system));
  },

  render_directory: function () {
    this.path_el.textContent = "Path: " + this.current_path;
    this.grid_el.innerHTML = "";
    
    var files = this.file_system[this.current_path] || [];

    if (files.length === 0) {
      this.grid_el.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: rgba(255,255,255,0.4); font-size: 0.8rem; margin-top: 20px;">Directory is empty.</p>';
      return;
    }

    // building file grid elements using a simple loop instead of modern array methods everywhere
    for(var i = 0; i < files.length; i++) {
      var file = files[i];
      var div = document.createElement("div");
      div.className = "explorer_item";
      div.dataset.name = file.name;

      div.innerHTML = '<div class="file_icon_wrap"><img src="' + file.icon + '" alt="file icon" class="explorer_svg_img" /></div><span class="explorer_name">' + file.name + '</span>';
      
      this.grid_el.appendChild(div);
    }
  },

  
};
iron_explorer.init()

// Wiring it up
make_draggable(document.querySelector("#iron_explorer"));
setup_icon("#explorer_open", "iron_explorer");

var close_explorer_btn = document.querySelector("#close_iron_explorer");
if (close_explorer_btn) {
  close_explorer_btn.addEventListener("click", () => {
    close_window("iron_explorer");
  });
}

// Stark Net
var stark_net = {
  internal_pages: {
    "internal://stark_home": `<div style="padding: 20px; color: #ffd600; font-family: 'Eurostile', sans-serif;">
          <h2 style="color: #e53935; border-bottom: 1px solid #e53935; padding-bottom: 6px; margin-bottom: 12px;">STARK INDUSTRIES ARCHIVES</h2>
          <p style="font-size: 0.85rem; color: #fff; margin-bottom: 10px;">Classification: Level 10 Security Clearance Required.</p>
          <ul style="font-size: 0.8rem; line-height: 1.6; color: rgba(255,255,255,0.8); margin-left: 20px;">
            <li>Arc Reactor Mk. L: Energy output stable at 100%.</li>
            <li>Vibranium-Nanotech Alloy: Tensile strength verified.</li>
            <li>Orbital Protocol: Satellite uplink active.</li>
          </ul>
        </div>`,

    "internal://avengers_intel": `<div style="padding: 20px; color: #ffd600; font-family: 'Eurostile', sans-serif;">
          <h2 style="color: #ffd600; border-bottom: 1px solid #ffd600; padding-bottom: 6px; margin-bottom: 12px;">AVENGERS GLOBAL NETWORK</h2>
          <p style="font-size: 0.85rem; color: #fff; margin-bottom: 10px;">Status Report: Active Operations</p>
          <div style="background: rgba(229,57,53,0.15); border: 1px solid #e53935; padding: 10px; border-radius: 6px; font-size: 0.8rem;">
            <strong style="color: #e53935;">WARNING:</strong> Threat monitoring system active. Defense systems online.
          </div>
        </div>`,
  },

  history: [""],
  history_index: 0,

  init: function () {
    this.url_bar = document.querySelector("#url_bar");
    this.go_btn = document.querySelector("#go_btn");
    this.iframe = document.querySelector("#viewport");
    this.home_view = document.querySelector("#stark_page");
    this.refresh_btn = document.querySelector("#browser_refresh");
    this.back_btn = document.querySelector("#browser_back");
    this.forward_btn = document.querySelector("#browser_forward");
    this.home_btn = document.querySelector("#browser_home");

    // just in case it isn't on the page yet
    if (!this.url_bar) {
      console.log("Wait, couldn't find the url bar element?");
      return;
    }

    this.original_home_content = this.home_view.innerHTML;

    this.go_btn.addEventListener("click", () => {
      this.navigate(this.url_bar.value.trim(), true);
    });

    this.url_bar.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.navigate(this.url_bar.value.trim(), true);
      }
    });

    if (this.refresh_btn) {
      this.refresh_btn.addEventListener("click", () => {
        this.load_current_state();
      });
    }

    if (this.back_btn) {
      this.back_btn.addEventListener("click", () => {
        if (this.history_index > 0) {
          this.history_index--;
          this.load_current_state();
        }
      });
    }

    if (this.forward_btn) {
      this.forward_btn.addEventListener("click", () => {
        if (this.history_index < this.history.length - 1) {
          this.history_index++;
          this.load_current_state();
        }
      });
    }

    if (this.home_btn) {
      this.home_btn.addEventListener("click", () => {
        this.navigate("", true);
      });
    }

    this.bind_quick_links();
  },


    // Quick links setup
    bind_quick_links: function () {
    var quick_links = this.home_view.querySelectorAll(".quick_link_card");
    quick_links.forEach((card) => {
      card.addEventListener("click", () => {
        var target_url = card.dataset.url;
        this.url_bar.value = target_url;
        this.navigate(target_url, true);
      });
    });
  },

  navigate: function (raw_url, push_history = true) {
    if (push_history) {
      this.history = this.history.slice(0, this.history_index + 1);
      this.history.push(raw_url);
      this.history_index = this.history.length - 1;
    }
    this.load_current_state();
  },

  load_current_state: function () {
    var raw_url = this.history[this.history_index] || "";
    this.url_bar.value = raw_url;

    if (!raw_url) {
      this.iframe.style.display = "none";
      this.home_view.innerHTML = this.original_home_content;
      this.home_view.style.display = "block";
      this.bind_quick_links();
      return;
    }

    if (this.internal_pages[raw_url]) {
      this.iframe.style.display = "none";
      this.home_view.innerHTML = this.internal_pages[raw_url];
      this.home_view.style.display = "block";
      return;
    }

    var formatted_url = raw_url;
    if (!formatted_url.startsWith("http://") && !formatted_url.startsWith("https://")) {
      formatted_url = "https://" + formatted_url;
    }

    this.home_view.style.display = "none";
    this.iframe.style.display = "block";
    this.iframe.src = formatted_url;
  }
};

// Wiring it up!
make_draggable(document.querySelector("#stark_net"));
setup_icon("#stark_net_open", "stark_net");

var close_stark_net_btn = document.querySelector("#close_stark_net");
if (close_stark_net_btn) {
  close_stark_net_btn.addEventListener("click", () => {
    close_window("stark_net");
  });
}

stark_net.init();

// Iron Control Center

