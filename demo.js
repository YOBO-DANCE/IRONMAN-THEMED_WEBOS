// TODO: clean this up later when I have time, audio context can be a bit annoying with browser autoplay policies
var stark_audio = {
  ctx: null,

  init: function () {
    // wait for first click to unlock audio context - browsers hate autoplay
    window.addEventListener("click", () => {
      if (!this.ctx) {
        // let's try to init the audio context
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
    }, { once: true });

    // Global click listener for UI sounds. Might be a bit heavy? Whatever, works for now.
    document.addEventListener("click", (e) => {
      if (typeof stark_control !== "undefined" && !stark_control.audio_enabled) return;
      
      // checking if clicked element is something we want to make noise for
      var target = e.target.closest("button, .desktop_icon, .explorer_item, .quick_link_card, .dir_item, input[type='checkbox'], .theme_btn, .wallpaper_btn");
      if (target) {
        this.play_beep(1200, 0.03); // standard click sound
      }
    });
  },

  play_beep: function (freq = 800, duration = 0.04) {
    if (typeof stark_control !== "undefined" && !stark_control.audio_enabled || !this.ctx) return;
    
    try {
      var osc = this.ctx.createOscillator();
      var gain = this.ctx.createGain();

      osc.type = "sine"; // maybe change to square later for a more retro vibe?
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.log("Audio not ready yet lol"); // Left a debug log in case it fails
    }
  }
};

// Stark Control Center & Settings Logic
// Putting all settings here so I don't lose track of them across files
var stark_control = {
  audio_enabled: true,

  init: function () {
    this.panel = document.querySelector("#stark_control_panel");
    if (!this.panel) return; // panel isn't on this page?

    var theme_btns = this.panel.querySelectorAll(".theme_btn");
    
    // Loop through theme buttons and add listeners
    for (var i = 0; i < theme_btns.length; i++) {
      let btn = theme_btns[i]; // using let so closure doesn't mess up inside the event listener
      btn.addEventListener("click", () => {
        // remove active class from all first
        theme_btns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.apply_theme(btn.dataset.theme);
      });
    }

    var audio_toggle = document.querySelector("#audio_feedback_toggle");
    if (audio_toggle) {
      audio_toggle.addEventListener("change", (e) => {
        this.audio_enabled = e.target.checked;
        console.log("Audio feedback set to: " + this.audio_enabled);
      });
    }

    var bg_btns = this.panel.querySelectorAll(".wallpaper_btn");
    bg_btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        bg_btns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.apply_wallpaper(btn.dataset.bg);
      });
    });
  },

  apply_theme: function (theme) {
    // Hardcoded themes for Jarvis UI
    if (theme === "cyan") {
      document.documentElement.style.setProperty("--accent-color", "#00f0ff");
    } else if (theme === "gold") {
      document.documentElement.style.setProperty("--accent-color", "#ffd600");
    } else {
      document.documentElement.style.setProperty("--accent-color", "#e53935"); // red / mark 3 default
    }
  },

  apply_wallpaper: function (bg_key) {
    // wallpapers backgrounds
    if (bg_key === "arc") {
      document.body.style.backgroundImage = "radial-gradient(circle, #001122 0%, #00050a 100%)";
    } else if (bg_key === "minimal") {
      document.body.style.backgroundImage = "none";
      document.body.style.backgroundColor = "#08080c";
    } else {
      // default gif wallpaper path
      document.body.style.backgroundImage = "url(../assets/iron-man-deep-space-aesthetic-gif-wallpaper-preview.gif)";
    }
  }
};

// init draggable if function exists globally
var controlPanelElem = document.querySelector("#stark_control_panel");
if (controlPanelElem && typeof make_draggable === "function") {
  make_draggable(controlPanelElem);
}

// Note: Make sure to add a desktop icon with id="#stark_control_open" in your HTML to open this window!
var close_control_btn = document.querySelector("#close_stark_control");
if (close_control_btn) {
  close_control_btn.addEventListener("click", () => {
    // just calling close window helper
    if (typeof close_window === "function") {
      close_window("stark_control_panel");
    } else {
      document.querySelector("#stark_control_panel").style.display = "none"; // fallback just in case
    }
  });
}

// Fire everything up
stark_audio.init();
stark_control.init();