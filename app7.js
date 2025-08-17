const quizQuestions = [
  {
    question: "Which Vikings defensive lineman recorded a safety in the 1970 season, showcasing the dominance of the Purple People Eaters?",
    options: ["Alan Page", "Jim Marshall", "Carl Eller", "Gary Larsen"],
    correctAnswer: 0
  },
  {
    question: "Who led the Vikings in rushing yards during the 1970 season?",
    options: ["Dave Osborn", "Chuck Foreman", "Oscar Reed", "Clint Jones"],
    correctAnswer: 0
  },
  {
    question: "Which Vikings player had the longest interception return in the 1970 season?",
    options: ["Paul Krause", "Ed Sharockman", "Charlie West", "Karl Kassulke"],
    correctAnswer: 1
  },
  {
    question: "In 1970, which Vikings linebacker was known for his coverage skills and recorded multiple interceptions?",
    options: ["Roy Winston", "Jeff Siemon", "Wally Hilgenberg", "Lonnie Warwick"],
    correctAnswer: 3
  },
  {
    question: "Which team handed the Vikings their first loss of the 1970 season, ending a 5-game win streak?",
    options: ["St. Louis Cardinals", "San Francisco 49ers", "Detroit Lions", "Dallas Cowboys"],
    correctAnswer: 0
  },
  {
    question: "What was the Vikings' point differential at the end of the 1970 regular season?",
    options: ["+140", "+124", "+98", "+112"],
    correctAnswer: 1
  },
  {
    question: "Which Vikings offensive lineman was selected to the Pro Bowl in 1970 for his run-blocking dominance?",
    options: ["Grady Alderman", "Mick Tingelhoff", "Ed White", "Steve Riley"],
    correctAnswer: 0
  },
  {
    question: "Which Vikings wide receiver caught a 65-yard touchdown pass in the 1970 playoff loss to the 49ers?",
    options: ["Gene Washington", "Bob Grim", "John Beasley", "John Henderson"],
    correctAnswer: 1
  },
  {
    question: "Who was the Vikings' punter in 1970, known for his hang time and directional kicking?",
    options: ["Mike Eischeid", "Greg Coleman", "Bob Lee", "Tommy Kramer"],
    correctAnswer: 0
  },
  {
    question: "Which Vikings assistant coach in 1970 later became an NFL head coach and GM?",
    options: ["Jerry Burns", "Pete Carroll", "Tony Dungy", "Mike Lynn"],
    correctAnswer: 0
  }
];

let currentQuestionIndex = 0;
let score = 0;
let shuffledQuestions = [];

// Simple shuffle helper
function shuffleArray(arr) {
  arr.sort(() => Math.random() - 0.5);
}

// Get DOM elements
const startContainer = document.getElementById('start-container'),
      quizContainer = document.getElementById('quiz-container'),
      questionContainer = document.getElementById('question-container'),
      optionsContainer = document.getElementById('options-container'),
      nextButton = document.getElementById('next-button'),
      scoreContainer = document.getElementById('score-container'),
      scoreDisplay = document.getElementById('score-display'),
      restartButton = document.getElementById('restart-button'),
      progressBar = document.getElementById('progress-bar'),
      summaryContainer = document.getElementById('summary-container');

// Start quiz button click
document.getElementById('start-button').onclick = () => {
  startContainer.classList.add('d-none');
  quizContainer.classList.remove('d-none');
  currentQuestionIndex = score = 0;
  // Shuffle questions and options
  shuffledQuestions = quizQuestions.map(q => {
    const optionObjs = q.options.map((opt, i) => ({
      text: opt,
      isCorrect: i === q.correctAnswer
    }));
    shuffleArray(optionObjs);
    return {
      question: q.question,
      options: optionObjs.map(opt => opt.text),
      correctAnswer: optionObjs.findIndex(opt => opt.isCorrect),
      userSelected: null // Track user's answer
    };
  });
  shuffleArray(shuffledQuestions);
  showQuestion();
  updateProgressBar();
  summaryContainer.innerHTML = ""; // Clear summary on new quiz
};

// Display current question and options
function showQuestion() {
  const q = shuffledQuestions[currentQuestionIndex];
  questionContainer.innerHTML = `
    <div id="question-row" class="mb-2" style="display: flex; align-items: center; justify-content: center; gap: 1rem;">
      <span class="badge bg-warning text-dark fs-6">Question ${currentQuestionIndex + 1} of ${shuffledQuestions.length}</span>
      <div id="feedback-message"></div>
    </div>
    <p></p>
    <h3 id="quiz-question" class="question-flex">${q.question}</h3>
  `;
  optionsContainer.innerHTML = q.options.map((opt, i) =>
    `<button class="btn btn-warning w-100 fw-bold mb-2 option-btn" onclick="handleAnswerSelection(${i})">${opt}</button>`
  ).join('');
  nextButton.classList.add('invisible');

  // Dynamically adjust font size to fit within 2 lines
  const questionEl = document.getElementById('quiz-question');
  let fontSize = 2; // rem
  const maxLines = 2;
  const lineHeight = 1.2;
  const containerHeight = fontSize * lineHeight * maxLines * 16; // 16px per rem

  // Shrink font size until it fits within two lines or reaches minimum
  while (questionEl.scrollHeight > containerHeight && fontSize > 1.1) {
    fontSize -= 0.1;
    questionEl.style.fontSize = fontSize + 'rem';
  }
}

// Handle answer selection
window.handleAnswerSelection = function(selectedIndex) {
  const q = shuffledQuestions[currentQuestionIndex];
  q.userSelected = selectedIndex; // Store user's answer
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.classList.toggle('btn-success', i === q.correctAnswer);
    btn.classList.toggle('btn-danger', i !== q.correctAnswer);
    btn.classList.remove('btn-warning');
    btn.style.opacity = i === q.correctAnswer ? '1' : '0.3';
    btn.disabled = true;
  });
  const feedback = selectedIndex === q.correctAnswer
    ? '<span class="text-success fw-bold">Correct!</span>'
    : '<span class="text-danger fw-bold">Incorrect!</span>';
  document.getElementById('feedback-message').innerHTML = feedback;
  if (selectedIndex === q.correctAnswer) score++;
  nextButton.classList.remove('invisible');
};

// Next question button click
nextButton.onclick = () => {
  currentQuestionIndex++;
  currentQuestionIndex < shuffledQuestions.length ? (showQuestion(), updateProgressBar()) : showScore();
};

// Show final score and summary
function showScore() {
  quizContainer.classList.add('d-none');
  scoreContainer.classList.remove('d-none');
  scoreDisplay.textContent = `${score} / ${shuffledQuestions.length}`;

  // Build summary HTML
  let summaryHTML = '<div class="mt-3">';
  shuffledQuestions.forEach((q, idx) => {
    const userAnswered = q.userSelected !== null;
    const isCorrect = userAnswered && q.userSelected === q.correctAnswer;
    summaryHTML += `
      <div class="mb-2 small text-start">
        <strong>Q${idx + 1}:</strong> ${q.question}<br>
        <span>
          ${
            isCorrect
              ? `You answered correctly: <span class="text-success">${q.options[q.correctAnswer]}</span>`
              : `Your answer: <span class="text-danger">${userAnswered ? q.options[q.userSelected] : '<em>No answer</em>'}</span>
                 <br>Correct answer: <span class="text-success">${q.options[q.correctAnswer]}</span>`
          }
        </span>
      </div>
    `;
  });
  summaryHTML += '</div>';
  summaryContainer.innerHTML = summaryHTML;
}

document.body.classList.add('noscroll'); // Prevent scrolling at start

function showScoreContainer() {
  // ...existing code to show score container...
  document.getElementById('score-container').classList.remove('d-none');
  document.body.classList.remove('noscroll'); // Allow scrolling now
}

// Restart quiz button click
restartButton.onclick = () => {
  scoreContainer.classList.add('d-none');
  startContainer.classList.remove('d-none');
  progressBar.style.width = '0%';
  progressBar.setAttribute('aria-valuenow', 0);
  summaryContainer.innerHTML = "";
};

// Update progress bar
function updateProgressBar() {
  const percent = Math.round((currentQuestionIndex / shuffledQuestions.length) * 100);
  progressBar.style.width = `${percent}%`;
  progressBar.setAttribute('aria-valuenow', percent);
}

