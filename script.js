document.addEventListener("DOMContentLoaded", function () {
    const sessionOptions = document.querySelectorAll('input[name="session"]');
    const startButton = document.getElementById("start-btn");
    const homeScreen = document.getElementById("home-screen");
    const timerScreen = document.getElementById("timer-screen");
    const timerLabel = document.getElementById("timer-label");
    const countdownDisplay = document.getElementById("countdown");

    // Sound files
    const eyeBreakSound = new Audio("eye_break.mp3");
    const sessionEndSound = new Audio("session_end.mp3");
    const breakEndSound = new Audio("break_end.mp3");

    let sessionDuration = 0;
    let breakDuration = 0;
    let eyeBreakInterval = 20 * 60; // 20 minutes
    let lastEyeBreakTime = 0; // Track last eye break
    let timerInterval;

    // Session options mapping
    const sessionTimes = {
        "1": { work: 1, break: 1 },  // 1 min test mode
        "20": { work: 20, break: 5 },
        "30": { work: 30, break: 10 },
        "45": { work: 45, break: 15 },
        "60": { work: 60, break: 20 },
        "90": { work: 90, break: 25 },
        "120": { work: 120, break: 30 }
    };

    startButton.addEventListener("click", function () {
        let selectedSession = document.querySelector('input[name="session"]:checked');
        if (!selectedSession) {
            alert("Please select a session duration.");
            return;
        }

        sessionDuration = sessionTimes[selectedSession.value].work * 60;
        breakDuration = sessionTimes[selectedSession.value].break * 60;

        startSession();
    });

    function startSession() {
        homeScreen.classList.add("hidden");
        timerScreen.classList.remove("hidden");
        timerLabel.textContent = "Work Session";
        lastEyeBreakTime = sessionDuration;  // Reset eye break tracking
        startCountdown(sessionDuration, true, startBreak);
    }

    function startBreak() {
        timerLabel.textContent = "Break Time!";
        sessionEndSound.play();
        startCountdown(breakDuration, false, returnToHome);
    }

    function returnToHome() {
        breakEndSound.play();
        timerScreen.classList.add("hidden");
        homeScreen.classList.remove("hidden");
    }

    function startCountdown(duration, eyeBreaks, callback) {
        let remainingTime = duration;
        let eyeBreakPlayed = false; // Prevents overlap

        function updateCountdown() {
            let minutes = Math.floor(remainingTime / 60);
            let seconds = remainingTime % 60;
            countdownDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

            if (eyeBreaks && duration >= 21 * 60) { // Only if session is 21 min or more
                if (remainingTime <= lastEyeBreakTime - eyeBreakInterval) {
                    eyeBreakSound.play();
                    lastEyeBreakTime = remainingTime;
                }
            }

            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                if (!eyeBreakPlayed) {
                    eyeBreakPlayed = true; // Ensures no double sound
                    if (callback) callback();
                }
            } else {
                remainingTime--;
            }
        }

        updateCountdown();
        timerInterval = setInterval(updateCountdown, 1000);
    }
});
