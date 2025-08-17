const quizQuestions = [
  { q: "Which Vikings defensive lineman recorded a safety in the 1970 season, showcasing the dominance of the Purple People Eaters?", o: ["Alan Page","Jim Marshall","Carl Eller","Gary Larsen"], a: 0 },
  { q: "Who led the Vikings in rushing yards during the 1970 season?", o: ["Dave Osborn","Chuck Foreman","Oscar Reed","Clint Jones"], a: 0 },
  { q: "Which Vikings player had the longest interception return in the 1970 season?", o: ["Paul Krause","Ed Sharockman","Charlie West","Karl Kassulke"], a: 1 },
  { q: "In 1970, which Vikings linebacker was known for his coverage skills and recorded multiple interceptions?", o: ["Roy Winston","Jeff Siemon","Wally Hilgenberg","Lonnie Warwick"], a: 3 },
  { q: "Which team handed the Vikings their first loss of the 1970 season, ending a 5-game win streak?", o: ["St. Louis Cardinals","San Francisco 49ers","Detroit Lions","Dallas Cowboys"], a: 0 },
  { q: "What was the Vikings' point differential at the end of the 1970 regular season?", o: ["+140","+124","+98","+112"], a: 1 },
  { q: "Which Vikings offensive lineman was selected to the Pro Bowl in 1970 for his run-blocking dominance?", o: ["Grady Alderman","Mick Tingelhoff","Ed White","Steve Riley"], a: 0 },
  { q: "Which Vikings wide receiver caught a 65-yard touchdown pass in the 1970 playoff loss to the 49ers?", o: ["Gene Washington","Bob Grim","John Beasley","John Henderson"], a: 1 },
  { q: "Who was the Vikings' punter in 1970, known for his hang time and directional kicking?", o: ["Mike Eischeid","Greg Coleman","Bob Lee","Tommy Kramer"], a: 0 },
  { q: "Which Vikings assistant coach in 1970 later became an NFL head coach and GM?", o: ["Jerry Burns","Pete Carroll","Tony Dungy","Mike Lynn"], a: 0 }
];

const els = {
  startBtn: document.getElementById('start-button'),
  start: document.getElementById('start-container'),
  quiz: document.getElementById('quiz-container'),
  questionBox: document.getElementById('question-container'),
  options: document.getElementById('options-container'),
  nextBtn: document.getElementById('next-button'),
  scoreWrap: document.getElementById('score-container'),
  score: document.getElementById('score-display'),
  restart: document.getElementById('restart-button'),
  summary: document.getElementById('summary-container'),
  prog: document.getElementById('quiz-progress'),
  progText: document.getElementById('progress-text')
};

let items = [];
let idx = 0;
let score = 0;

function shuffle(arr){
  for (let i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random()* (i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function startQuiz() {
  idx = 0; score = 0;
  items = quizQuestions.map(q => {
    const opts = q.o.map((t,i)=>({ t, correct: i === q.a }));
    shuffle(opts);
    return {
      q: q.q,
      opts: opts.map(o=>o.t),
      a: opts.findIndex(o=>o.correct),
      pick: null
    };
  });
  shuffle(items);
  els.summary.innerHTML = '';
  els.start.classList.add('d-none');
  els.scoreWrap.classList.add('d-none');
  els.quiz.classList.remove('d-none');
  updateProgress();
  renderQuestion();
}

function renderQuestion() {
  const cur = items[idx];
  els.questionBox.innerHTML = `
    <div id="question-row" class="mb-2 d-flex align-items-center justify-content-center gap-2 flex-wrap">
      <span class="badge bg-warning text-dark fs-6">Question ${idx+1} of ${items.length}</span>
      <div id="feedback-message"></div>
    </div>
    <h3 id="quiz-question" class="question-flex mt-2">${cur.q}</h3>
  `;
  els.options.innerHTML = cur.opts.map((t,i)=>
    `<button class="btn btn-warning w-100 fw-bold mb-2 option-btn" data-i="${i}">${t}</button>`
  ).join('');
  els.nextBtn.classList.add('invisible');
  els.options.querySelectorAll('.option-btn').forEach(b=>{
    b.onclick = () => handlePick(parseInt(b.dataset.i,10));
  });
  updateProgress(idx);
}

function handlePick(sel) {
  const cur = items[idx];
  if (cur.pick !== null) return;
  cur.pick = sel;
  const correct = sel === cur.a;
  if (correct) score++;

  els.options.querySelectorAll('.option-btn').forEach((btn,i)=>{
    btn.classList.remove('btn-warning','btn-success','btn-danger','btn-outline-dark');
    if (correct) {
      if (i === cur.a) { btn.classList.add('btn-success'); btn.disabled = false; }
      else { btn.classList.add('btn-outline-dark'); btn.disabled = true; }
    } else {
      if (i === cur.a) { btn.classList.add('btn-success'); btn.disabled = false; }
      else if (i === sel) { btn.classList.add('btn-danger'); btn.disabled = false; }
      else { btn.classList.add('btn-outline-dark'); btn.disabled = true; }
    }
  });

  const fb = document.getElementById('feedback-message');
  if (fb) fb.innerHTML = correct
    ? '<span class="text-success fw-bold">Correct!</span>'
    : '<span class="text-danger fw-bold">Incorrect!</span>';

  els.nextBtn.classList.remove('invisible');
  updateProgress(idx + 1);
}

function next() {
  idx++;
  if (idx < items.length) renderQuestion();
  else finish();
}

function finish() {
  els.quiz.classList.add('d-none');
  els.scoreWrap.classList.remove('d-none');
  els.score.textContent = `${score} / ${items.length}`;
  els.summary.innerHTML = items.map((it,i)=>{
    const ok = it.pick === it.a;
    return `<div class="mb-2 small text-start">
      <strong>Q${i+1}:</strong> ${it.q}<br>
      ${
        ok
          ? `You answered: <span class="text-success">${it.opts[it.a]}</span>`
          : `Your answer: <span class="text-danger">${it.pick!=null?it.opts[it.pick]:'<em>No answer</em>'}</span><br>
             Correct: <span class="text-success">${it.opts[it.a]}</span>`
      }
    </div>`;
  }).join('');
  updateProgress(items.length);
}

function updateProgress(done = 0) {
  if (!els.prog) return;
  const total = items.length || quizQuestions.length;
  const pct = Math.round((done / total) * 100);
  els.prog.value = pct;
  els.prog.setAttribute('aria-valuenow', pct);
  if (els.progText) els.progText.textContent = '';
}

els.startBtn.onclick = startQuiz;
els.nextBtn.onclick = next;
els.restart.onclick = () => {
  els.scoreWrap.classList.add('d-none');
  els.start.classList.remove('d-none');
  updateProgress(0);
  items = [];
};
