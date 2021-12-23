let BREAK_TIME = 5 * 1000 * 60;
let WORKING_TIME = 0.1 * 1000 * 60;
let boostrap;

(function () {
  let session = 0;
  let currentTime = 0;
  let isActive = false;
  let isModeWork = true;
  let interval = null;

  const icons = {
    play: "M19.376 12.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832z",
    pause: "M6 5h2v14H6V5zm10 0h2v14h-2V5z",
  };

  function formatNumber(number) {
    return number < 10 ? `0${number}` : number;
  }

  function formatTime(ms) {
    const minutes = formatNumber(Math.floor(ms / 60000));
    const seconds = formatNumber(((ms % 60000) / 1000).toFixed(0));
    return `${minutes}:${seconds}`;
  }

  function renderTime(value) {
    const timer = document.getElementById("timer");
    timer.innerHTML = formatTime(value);
  }

  function renderMode() {
    const mode = document.getElementById("mode");
    mode.innerHTML = isModeWork ? "work" : "break";

    const page = document.getElementById("page");
    return isModeWork
      ? page.classList.remove("page--secondary")
      : page.classList.add("page--secondary");
  }

  function renderIcon(icon) {
    const element = document.getElementById("actionButton");
    const iconPath = icons[icon] || icons.play;
    element.innerHTML = `
      <svg class="page__actions-button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill="currentColor" d="${iconPath}" />
      </svg>
    `;
  }

  function renderSessions() {
    const sessions = document.querySelectorAll("#session");
    sessions.forEach((element, index) => {
      element.classList.remove("active", "completed");

      if (session > index) {
        element.classList.add("completed");
      }

      if (index === session) {
        element.classList.add("active");
      }
    });
  }

  function renderProgress() {
    const activeTotal = isModeWork ? WORKING_TIME : BREAK_TIME;
    const percent = (currentTime * 100) / activeTotal;

    const circle = document.getElementById("progress");
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;

    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;

    const pointer = document.getElementById("pointer");
    const rotateDegrees = (percent * 360) / 100;
    pointer.style.transform = `rotate(${rotateDegrees}deg)`;
  }

  function startTimer() {
    interval = setInterval(() => {
      currentTime -= 1000;

      if (currentTime <= 0) {
        session += 1;
        renderSessions();

        isModeWork = !isModeWork;
        currentTime = isModeWork ? WORKING_TIME : BREAK_TIME;
        renderMode();
      }

      renderProgress();
      renderTime(currentTime);
    }, 1000);
  }

  function pauseTimer() {
    if (interval) clearInterval(interval);
  }

  boostrap = function () {
    session = 0;
    currentTime = WORKING_TIME;
    isActive = false;
    isModeWork = true;

    pauseTimer();
    renderTime(currentTime);
    renderIcon("play");
    renderMode();
    renderSessions();
    renderProgress();
  };

  const actionButton = document.getElementById("actionButton");
  actionButton.addEventListener("click", () => {
    if (!isActive) {
      isActive = true;
      startTimer();
      return renderIcon("pause");
    }
    isActive = false;
    pauseTimer();
    return renderIcon("play");
  });

  const stopButton = document.getElementById("stopButton");
  stopButton.addEventListener("click", boostrap);

  boostrap();
})();
