const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const nextBtn = document.getElementById("next-btn");
const explanationElement = document.getElementById("explanation");
const progressBar = document.getElementById("progress-bar");

let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 15;
let username = "";
let difficulty = "easy";

function startQuiz(level) {
  username = document.getElementById("username").value;

  if (username.trim() === "") {
    alert("Please enter your name");
    return;
  }

  difficulty = level;

  if (difficulty === "easy") {
    timeLeft = 15;
  } else if (difficulty === "medium") {
    timeLeft = 10;
  } else {
    timeLeft = 7;
  }

  startScreen.classList.remove("active");
  quizScreen.classList.add("active");

  loadQuestion();
}

function loadQuestion() {
  clearInterval(timer);

  if (currentQuestion >= questions.length) {
    showResult();
    return;
  }

  const current = questions[currentQuestion];

  questionElement.innerText = current.question;
  optionsContainer.innerHTML = "";
  explanationElement.innerText = "";
  nextBtn.style.display = "none";

  current.options.forEach(option => {
    const button = document.createElement("button");
     button.innerText = option;
    button.classList.add("option-btn");

    button.addEventListener("click", () => checkAnswer(button, option));

    optionsContainer.appendChild(button);
  });

  updateProgressBar();
  startTimer();
}

function checkAnswer(button, selectedOption) {
  clearInterval(timer);

  const correctAnswer = questions[currentQuestion].answer;

  const allButtons = document.querySelectorAll(".option-btn");

  allButtons.forEach(btn => btn.disabled = true);

  if (selectedOption === correctAnswer) {
    button.classList.add("correct");
    score++;
    scoreElement.innerText = score;
  } else {
    button.classList.add("wrong");

    allButtons.forEach(btn => {
      if (btn.innerText === correctAnswer) {
        btn.classList.add("correct");
      }
    });
  }

  explanationElement.innerText = questions[currentQuestion].explanation;

  nextBtn.style.display = "block";
}

nextBtn.addEventListener("click", () => {
  currentQuestion++;
  loadQuestion();
});

function startTimer() {
  let currentTime;

  if (difficulty === "easy") {
    currentTime = 15;
  } else if (difficulty === "medium") {
    currentTime = 10;
  } else {
    currentTime = 7;
  }

  timerElement.innerText = currentTime;

  timer = setInterval(() => {
    currentTime--;
    timerElement.innerText = currentTime;

    if (currentTime <= 0) {
         clearInterval(timer);

      const correctAnswer = questions[currentQuestion].answer;

      document.querySelectorAll(".option-btn").forEach(btn => {
        btn.disabled = true;

        if (btn.innerText === correctAnswer) {
          btn.classList.add("correct");
        }
      });

      explanationElement.innerText = "⏰ Time's up! " + questions[currentQuestion].explanation;

      nextBtn.style.display = "block";
    }
  }, 1000);
}

function updateProgressBar() {
  const progress = ((currentQuestion) / questions.length) * 100;
  progressBar.style.width = progress + "%";
}

function showResult() {
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");

  document.getElementById("final-score").innerText = `${username}, Your Score: ${score}/${questions.length}`;

  let message = "";

  if (score === questions.length) {
    message = "Excellent! You are highly cyber aware 🔥";
  } else if (score >= 3) {
    message = "Good job! Keep improving your cyber security knowledge 💡";
  } else {
    message = "You should learn more about online safety ⚠️";
  }

  document.getElementById("message").innerText = message;

  saveLeaderboard();
  displayLeaderboard();
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  scoreElement.innerText = 0;

  resultScreen.classList.remove("active");
  startScreen.classList.add("active");
}

function saveLeaderboard() {
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  leaderboard.push({
    name: username,
    score: score
  });
    leaderboard.sort((a, b) => b.score - a.score);

  leaderboard = leaderboard.slice(0, 5);

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

function displayLeaderboard() {
  const leaderboardList = document.getElementById("leaderboard-list");
  leaderboardList.innerHTML = "";

  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  leaderboard.forEach(player => {
    const li = document.createElement("li");
    li.innerText = `${player.name} - ${player.score}`;
    leaderboardList.appendChild(li);
  });
}