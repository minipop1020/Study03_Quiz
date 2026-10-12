// ===== 모드 규칙과 상태 =====
const CATEGORIES = ["한국사", "세계지리", "과학", "예술과 문화"];

const MODES = {
  practice: { label: "연습",   timeLimit: null, hint: false, ranked: false },
  speed:    { label: "스피드", timeLimit: 15,   hint: false, ranked: true  },
  hint:     { label: "힌트",   timeLimit: null, hint: true,  ranked: true  },
};

let state = {
  mode: "practice",
  category: "한국사",
  questions: [],    // 이번 판의 문항(섞인 상태)
  index: 0,         // 지금 몇 번째 문항인지
  results: [],      // 문항별 결과 { id, correct, usedHint, score }
  timerId: null,
  timeLeft: 0,
  isRetry: false,   // 틀린 문제 다시 풀기 중인지
  saved: false,     // 이번 판 기록을 저장했는지
  firstScore: null, // 다시 풀기 중 처음 판 점수
  hintUsed: false,  // 지금 문항에서 힌트를 썼는지
};

// ===== 화면 =====
function showScreen(name) {
  stopTimer();
  document.querySelectorAll("section").forEach((s) => {
    s.hidden = s.id !== "screen-" + name;
  });
}

// ===== 진행 =====
const $ = (id) => document.getElementById(id);
const choiceButtons = () => [...document.querySelectorAll("#choices .choice")];
const currentQuestion = () => state.questions[state.index];
const hasResult = () => state.results.length > state.index;

function startGame(mode, category) {
  const picked = QUESTIONS.filter((q) => q.category === category).map(prepareQuestion);
  state.mode = mode;
  state.category = category;
  state.questions = shuffle(picked);
  state.index = 0;
  state.results = [];
  state.isRetry = false;
  state.saved = false;
  state.firstScore = null;
  showScreen("quiz");
  renderQuestion();
}

function renderQuestion() {
  const q = currentQuestion();
  state.hintUsed = false;
  $("quiz-meta").textContent =
    `${state.category} · ${MODES[state.mode].label} · ${state.index + 1} / ${state.questions.length}`;
  $("question-text").textContent = q.question;
  choiceButtons().forEach((btn, i) => {
    btn.textContent = q.choices[i];
    btn.disabled = false;
    btn.classList.remove("correct", "wrong", "removed");
  });
  $("feedback").hidden = true;
  $("next-btn").hidden = true;
  $("timer").hidden = MODES[state.mode].timeLimit === null;
  $("hint-btn").hidden = !MODES[state.mode].hint;
  $("hint-btn").disabled = false;
  startTimer();
}

function selectChoice(i) {
  if (hasResult()) return;
  stopTimer();
  const q = currentQuestion();
  const correct = i === q.answer;
  state.results.push({
    id: q.id,
    correct,
    usedHint: state.hintUsed,
    score: scoreFor(correct, state.hintUsed),
  });
  showFeedback(i, false);
}

function showFeedback(chosen, timedOut) {
  const q = currentQuestion();
  const buttons = choiceButtons();
  buttons.forEach((btn) => (btn.disabled = true));
  $("hint-btn").disabled = true;
  buttons[q.answer].classList.add("correct");
  buttons[q.answer].textContent = q.choices[q.answer] + " ✔";
  if (chosen !== null && chosen !== q.answer) {
    buttons[chosen].classList.add("wrong");
    buttons[chosen].textContent = q.choices[chosen] + " ✘";
  }

  const verdict = timedOut ? "시간 초과" : chosen === q.answer ? "정답!" : "오답";
  $("feedback-verdict").textContent = verdict;
  $("feedback-verdict").className = verdict === "정답!" ? "verdict-correct" : "verdict-wrong";
  $("feedback-explanation").textContent = q.explanation;
  $("feedback-source").href = q.source.url;
  $("feedback-source").textContent = "출처: " + q.source.name;
  $("feedback").hidden = false;

  const isLast = state.index === state.questions.length - 1;
  $("next-btn").textContent = isLast ? "결과 보기" : "다음";
  $("next-btn").hidden = false;
}

function nextQuestion() {
  if (!hasResult()) return;
  if (state.index === state.questions.length - 1) {
    showResult();
  } else {
    state.index += 1;
    renderQuestion();
  }
}

function quitGame() {
  if (confirm("그만두시겠어요? 이번 판은 기록되지 않습니다.")) showScreen("start");
}

function totalScore(results) {
  return results.reduce((sum, r) => sum + r.score, 0);
}

function showResult() {
  showScreen("result");
  if (state.isRetry) {
    const right = state.results.filter((r) => r.correct).length;
    $("retry-text").textContent = `${state.questions.length}문제 중 ${right}문제 맞힘`;
    $("score-text").textContent = formatScore(state.firstScore) + " / 10";
  } else {
    $("score-text").textContent = formatScore(totalScore(state.results)) + " / " + state.questions.length;
  }
  $("retry-text").hidden = !state.isRetry;
  const ranked = MODES[state.mode].ranked;
  $("result-notice").textContent = ranked ? "" : "순위표에 기록되지 않음";
  $("result-notice").hidden = ranked;
  $("retry-btn").hidden = ranked || wrongIds(state.results).length === 0;
}

// ===== 틀린 문제 다시 풀기 =====
function wrongIds(results) {
  return results.filter((r) => !r.correct).map((r) => r.id);
}

function startRetry() {
  const ids = wrongIds(state.results);
  if (!state.isRetry) state.firstScore = totalScore(state.results);
  state.questions = shuffle(QUESTIONS.filter((q) => ids.includes(q.id)).map(prepareQuestion));
  state.isRetry = true;
  state.index = 0;
  state.results = [];
  showScreen("quiz");
  renderQuestion();
}

// ===== 스피드 =====
function showTimeLeft() {
  $("timer").textContent = `남은 시간 ${state.timeLeft}초`;
}

function startTimer() {
  const limit = MODES[state.mode].timeLimit;
  if (limit === null) return;
  stopTimer();
  state.timeLeft = limit;
  showTimeLeft();
  state.timerId = setInterval(() => {
    state.timeLeft -= 1;
    showTimeLeft();
    if (state.timeLeft <= 0) onTimeout();
  }, 1000);
}

function stopTimer() {
  clearInterval(state.timerId);
  state.timerId = null;
}

function onTimeout() {
  stopTimer();
  if (hasResult()) return;
  state.results.push({ id: currentQuestion().id, correct: false, usedHint: false, score: 0 });
  showFeedback(null, true);
}

// ===== 힌트 =====
function pickHintRemovals(q) {
  const wrong = [0, 1, 2, 3].filter((i) => i !== q.answer);
  return shuffle(wrong).slice(0, 2);
}

function useHint() {
  if (state.hintUsed || hasResult()) return;
  const buttons = choiceButtons();
  pickHintRemovals(currentQuestion()).forEach((i) => {
    buttons[i].classList.add("removed");
    buttons[i].disabled = true;
  });
  $("hint-btn").disabled = true;
  state.hintUsed = true;
}

// ===== 계산 (화면과 무관) =====
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function prepareQuestion(q) {
  const order = shuffle([0, 1, 2, 3].slice(0, q.choices.length));
  return {
    ...q,
    choices: order.map((i) => q.choices[i]),
    answer: order.indexOf(q.answer),
  };
}

function scoreFor(correct, usedHint) {
  if (!correct) return 0;
  return usedHint ? 0.5 : 1;
}

function formatScore(n) {
  return String(n);
}

// ===== 검사 =====
function validateQuestions(list) {
  const errors = [];
  const isBlank = (v) => typeof v !== "string" || v.trim() === "";

  CATEGORIES.forEach((cat) => {
    const count = list.filter((q) => q.category === cat).length;
    if (count !== 10) errors.push(`${cat}: 문항이 10개여야 하는데 ${count}개입니다`);
  });

  const seen = new Set();
  list.forEach((q) => {
    const tag = `[${q.id} / ${q.category}]`;
    if (!CATEGORIES.includes(q.category)) errors.push(`${tag} 없는 카테고리입니다`);
    if (!Array.isArray(q.choices) || q.choices.length !== 4) errors.push(`${tag} 보기가 4개가 아닙니다`);
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) errors.push(`${tag} answer가 0~3이 아닙니다`);
    if (isBlank(q.question)) errors.push(`${tag} 문제가 비어 있습니다`);
    if (isBlank(q.explanation)) errors.push(`${tag} 해설이 비어 있습니다`);
    if (!q.source || isBlank(q.source.name) || isBlank(q.source.url)) errors.push(`${tag} 출처가 비어 있습니다`);
    if (seen.has(q.id)) errors.push(`${tag} id가 중복됩니다`);
    seen.add(q.id);
  });

  return errors;
}

// ===== 시작 =====
function renderRadioOptions(containerId, name, items) {
  items.forEach(({ value, label: text }, i) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = name;
    input.value = value;
    input.checked = i === 0;
    label.append(input, " " + text);
    $(containerId).append(label);
  });
}

function selectedValue(name) {
  return document.querySelector(`input[name="${name}"]:checked`).value;
}

function updatePracticeNotice() {
  $("practice-notice").hidden = MODES[selectedValue("mode")].ranked;
}

renderRadioOptions("mode-options", "mode",
  Object.entries(MODES).map(([value, m]) => ({ value, label: m.label })));
renderRadioOptions("category-options", "category",
  CATEGORIES.map((cat) => ({ value: cat, label: cat })));
$("mode-options").addEventListener("change", updatePracticeNotice);
updatePracticeNotice();
choiceButtons().forEach((btn, i) => btn.addEventListener("click", () => selectChoice(i)));
$("start-btn").addEventListener("click", () => startGame(selectedValue("mode"), selectedValue("category")));
$("hint-btn").addEventListener("click", useHint);
$("next-btn").addEventListener("click", nextQuestion);
$("quit-btn").addEventListener("click", quitGame);
$("retry-btn").addEventListener("click", startRetry);
$("replay-btn").addEventListener("click", () => startGame(state.mode, state.category));
$("home-btn").addEventListener("click", () => showScreen("start"));

validateQuestions(QUESTIONS).forEach((e) => console.error("문항 데이터 오류: " + e));
