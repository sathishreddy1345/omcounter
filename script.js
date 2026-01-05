let count = 0;
let isListening = false;

const display = document.getElementById("count");
const msg = document.getElementById("statusMsg");
const targetInput = document.getElementById("target");
const bar = document.getElementById("bar");
const mic = document.getElementById("mic");
const historyList = document.getElementById("history");
const beep = document.getElementById("beep");
const themeBtn = document.getElementById("themeBtn");

/* ---------- Restore saved values ---------- */
count = Number(localStorage.getItem("count")) || 0;
display.innerText = count;

targetInput.value = localStorage.getItem("target") || "";

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

/* ---------- Speech Recognition ---------- */
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recog = new SpeechRecognition();
recog.lang = "en-US";
recog.interimResults = false;
recog.continuous = true;

function updateCount() {
  display.innerText = count;
  localStorage.setItem("count", count);

  const target = Number(targetInput.value);
  localStorage.setItem("target", targetInput.value);

  if (target) {
    let percent = Math.min((count / target) * 100, 100);
    bar.style.width = percent + "%";

    if (count >= target) {
      msg.innerText = "🎯 Target reached";
      beep.play();
      navigator.vibrate && navigator.vibrate(200);
    }
  }
}

function addHistory() {
  let li = document.createElement("li");
  li.innerText = "Om detected | Count: " + count;
  historyList.prepend(li);
}

/* Speech result */
recog.onresult = function(e) {
  const text =
    e.results[e.results.length-1][0].transcript.toLowerCase();

  msg.innerText = "Heard: " + text;

  if (text.includes("om") || text.includes("aum")) {
    count++;
    updateCount();
    addHistory();
  }
};

/* Restart listening automatically */
recog.onend = function() {
  if (isListening) recog.start();
};

/* Buttons */
document.getElementById("startBtn").onclick = function () {
  if (!isListening) {
    recog.start();
    isListening = true;
    mic.classList.add("listening");
    msg.innerText = "🎤 Listening... say Om";
  }
};

document.getElementById("stopBtn").onclick = function () {
  isListening = false;
  recog.stop();
  mic.classList.remove("listening");
  msg.innerText = "⛔ Stopped";
};

document.getElementById("resetBtn").onclick = function () {
  count = 0;
  updateCount();
  historyList.innerHTML = "";
  msg.innerText = "Counter reset";
};

/* Theme toggle */
themeBtn.onclick = function () {
  document.body.classList.toggle("dark");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
};
