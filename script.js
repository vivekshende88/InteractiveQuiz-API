let quizData = [];
let currentQuestion = 0;
let score = 0;
let username = null;
let timeLeft = 30;
let timerInterval;

// UI Element References
const quizSection = document.getElementById('quiz-section');
const questionEl = document.querySelector('.question');
const optionsEl = document.querySelector('.options');
const timerEl = document.getElementById('time');
const resultEl = document.querySelector('.result');
const scoreEl = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');
const nextBtn = document.getElementById('next-btn');
const feedbackEl = document.getElementById('feedback');
const loginform = document.getElementById('loginform');
const registerform = document.getElementById('registerform');

// Login/Register Handler (simple demo)
loginform.addEventListener('submit', function(e){
  e.preventDefault();
  username = loginform.querySelector('input').value.trim();
  document.querySelector('.container').classList.add('hidden');
  quizSection.classList.remove('hidden');
  fetchQuestions();
});
registerform.addEventListener('submit', function(e){
  e.preventDefault();
  username = registerform.querySelector('input').value.trim();
  document.querySelector('.container').classList.add('hidden');
  quizSection.classList.remove('hidden');
  fetchQuestions();
});

// Fetch quiz questions
function fetchQuestions() {
  fetch('https://opentdb.com/api.php?amount=5&type=multiple')
    .then(response => response.json())
    .then(data => {
      quizData = data.results.map(q => ({
        question: decodeHTML(q.question),
        options: shuffle([...q.incorrect_answers.map(decodeHTML), decodeHTML(q.correct_answer)]),
        answer: decodeHTML(q.correct_answer)
      }));
      currentQuestion = 0;
      score = 0;
      loadQuestion();
    });
}
function decodeHTML(html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function loadQuestion() {
  if (currentQuestion >= quizData.length) {
    endQuiz();
    return;
  }
  clearInterval(timerInterval);
  timeLeft = 30;
  timerEl.textContent = timeLeft;
  feedbackEl.textContent = "";
  startTimer();
  const currentQuiz = quizData[currentQuestion];
  questionEl.textContent = currentQuiz.question;
  resultEl.style.display = "none";
  optionsEl.innerHTML = '';
  nextBtn.classList.add('hidden');
  currentQuiz.options.forEach(option => {
    const button = document.createElement('button');
    button.classList.add('option');
    button.textContent = option;
    button.tabIndex = 0;
    button.onclick = () => checkAnswer(option, button);
    button.onkeyup = (e) => { if (e.key === 'Enter') checkAnswer(option, button); };
    optionsEl.appendChild(button);
  });
}
function checkAnswer(selectedOption, button) {
  Array.from(optionsEl.children).forEach(btn => btn.disabled = true);
  if (selectedOption === quizData[currentQuestion].answer) {
    score++;
    feedbackEl.textContent = "Correct! 👍";
    button.classList.add('selected');
  } else {
    feedbackEl.textContent = `Wrong! Correct answer: ${quizData[currentQuestion].answer}`;
    button.classList.add('selected');
  }
  nextBtn.classList.remove('hidden');
  clearInterval(timerInterval);
}
function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      checkAnswer("Time's up", {classList:{add:() => {}}});
    }
  }, 1000);
}
function endQuiz() {
  clearInterval(timerInterval);
  questionEl.textContent = `Quiz Over! Well done, ${username || 'player'}!`;
  optionsEl.innerHTML = "";
  feedbackEl.textContent = "";
  resultEl.style.display = 'block';
  scoreEl.textContent = score;
  restartBtn.classList.remove('hidden');
  nextBtn.classList.add('hidden');
}
restartBtn.addEventListener('click', () => {
  restartBtn.classList.add('hidden');
  fetchQuestions();
});
nextBtn.addEventListener('click', () => {
  currentQuestion++;
  loadQuestion();
});
