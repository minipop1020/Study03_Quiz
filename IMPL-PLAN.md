# 상식 퀴즈 웹 앱 구현 계획서 (IMPL-PLAN)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 서버 없이 `index.html`만 열면 되는 4지선다 상식 퀴즈(카테고리 4개 × 10문제)를 3단계로 만든다. 1단계 연습 모드와 점수 → 2단계 스피드·힌트 모드와 틀린 문제 다시 풀기 → 3단계 점수 저장과 순위표.

**Architecture:** `index.html`에 화면 4개(`<section>`)를 미리 만들어 두고 `showScreen()`으로 하나만 보이게 한다. 게임 진행 상황은 `script.js`의 `state` 객체 하나에 모으고, 모드마다 다른 동작은 `MODES` 규칙 표의 값(`timeLimit`, `hint`, `ranked`)으로 나눈다. 문항은 `questions.js`의 전역 상수 `QUESTIONS`로 넘긴다.

**Tech Stack:** HTML, CSS, 순수 JavaScript(외부 라이브러리 없음), localStorage(브라우저가 이 컴퓨터에 작은 데이터를 남겨 두는 공간)

**Spec:** [PRD.md](PRD.md) — 실행하는 사람은 이 계획서와 PRD를 함께 읽는다.

## Global Constraints

- 앱 파일은 `index.html`, `style.css`, `script.js`, `questions.js` 4개뿐이다. 패키지·라이브러리·테스트 프레임워크를 쓰지 않는다.
- `index.html`을 더블클릭(`file://`)해도 동작해야 한다. `import`/`export`, `type="module"`, `fetch`를 쓰지 않는다. 스크립트는 `questions.js` → `script.js` 순서로 일반 `<script>` 태그로 불러온다.
- PRD에 적힌 화면 문구는 글자 그대로 쓴다: "순위표에 기록되지 않음", "정답!", "오답", "시간 초과", "그만두시겠어요? 이번 판은 기록되지 않습니다.", "이름 없음", "순위권 밖입니다", "아직 기록이 없습니다", "기록을 저장할 수 없습니다".
- 카테고리는 정확히 `한국사`, `세계지리`, `과학`, `예술과 문화`(이 순서). id 약자는 `hist`, `geo`, `sci`, `art` + 두 자리 번호.
- 모드 키는 `practice`, `speed`, `hint`. 모드별 동작은 `if (mode === "speed")`가 아니라 `MODES[state.mode]`의 값으로 나눈다.
- 순위표 localStorage 키는 `quizLeaderboard` 하나, 내부 키는 `"<mode>|<category>"`.
- 정답 표시는 색만 쓰지 않는다: 정답 보기 초록 + ✔, 고른 오답 빨강 + ✘.
- 문항 문자열과 사용자가 넣은 이름은 `textContent`로 넣는다. `innerHTML`에 넣지 않는다.
- 휴대폰 폭 360px에서 가로 스크롤이 생기지 않는다.
- 숨김은 `hidden` 속성으로 한다.

## Review Focus

PRD가 직접 말하지는 않지만 실제로 쓰다가 부딪히기 쉬운 경우들이다. 각 줄의 테스트는 담당 Task에 들어 있다.

1. **보기를 빠르게 두 번 누름 / 고른 직후 시간 초과가 겹침** — 그 문항 결과는 `state.results`에 1개만 생겨야 한다. → Task 3, Task 5
2. **[다음]을 연타함** — 한 문항만 넘어가야 한다. → Task 3
3. **localStorage에 깨진 값이 들어 있음**(JSON이 아님, 배열, 엉뚱한 값) — 빈 순위표로 시작하고 앱이 멈추지 않아야 한다. → Task 8
4. **이름에 HTML 기호(`<b>나</b>`)를 넣음** — 순위표에 글자 그대로 보이고 굵은 글씨로 바뀌지 않아야 한다. → Task 9
5. **긴 문제·해설을 좁은 휴대폰 화면에서 봄** — 360px 폭에서 줄바꿈되고 가로 스크롤이 없어야 한다. → Task 3

---

## 확인 방법 (모든 Task 공통)

- **Claude(구현하는 쪽)의 확인**: 앱 안 브라우저는 `file://` 페이지에서 스크립트 실행·클릭 도구가 동작하지 않는다. 그래서 확인할 때만 간이 서버로 띄운다(앱은 서버에 의존하지 않는다). 확인용 설정 파일 `.claude/launch.json`(앱 파일 아님)을 Task 1에서 만든다.

  ```json
  {
    "version": "0.0.1",
    "configurations": [
      { "name": "quiz", "runtimeExecutable": "python", "runtimeArgs": ["-m", "http.server", "8000"], "port": 8000 }
    ]
  }
  ```

  `preview_start`(name: `quiz`)로 연 뒤 각 Task의 **콘솔 확인** 식을 `javascript_tool`로 실행한다. 결과가 `true` 또는 적힌 값이면 통과다.
- **사용자의 확인**: 단계가 끝날 때마다 각 단계의 "내가 브라우저에서 직접 확인할 항목"을 사용자가 `index.html`을 **더블클릭해서 연 브라우저**에서 직접 눌러 본다. 사용자가 확인한 뒤에 다음 단계로 넘어간다.
- **저장(커밋)**: 이 폴더는 git 저장소다(첫 커밋에 PRD와 계획서가 들어 있다). 커밋 이메일은 이 폴더에만 깃허브 noreply 주소로 설정되어 있다. 단계마다 사용자가 직접 확인을 마친 뒤 그 단계의 변경을 커밋한다.
- **`.claude` 폴더**: 화면 확인용 설정(`launch.json`)만 들어 있는 로컬 전용 폴더다. `.gitignore`에 `.claude/`를 넣어 저장소에 올리지 않는다.
- **배포**: 단계마다 커밋한 뒤, 사용자가 지시하면 master를 깃허브 공개 저장소 `Study03_Quiz`에 올리고 GitHub Pages로 배포(갱신)한다. 사용자의 지시 없이 푸시하거나 배포하지 않는다.

## 화면 요소 id (모든 Task가 이 이름을 쓴다)

| 화면 | `<section>` id | 요소 id |
|---|---|---|
| 시작 | `screen-start` | `mode-options`(라디오 `name="mode"`, 2단계), `category-options`(라디오 `name="category"`), `practice-notice`, `start-btn`, `board-btn`(3단계), `storage-warning`(3단계) |
| 문제 | `screen-quiz` | `quiz-meta`, `timer`, `question-text`, `choices`(안에 `button.choice` 4개), `hint-btn`, `feedback`(안에 `feedback-verdict`, `feedback-explanation`, `feedback-source`(`<a>`)), `next-btn`, `quit-btn` |
| 결과 | `screen-result` | `score-text`, `retry-text`, `result-notice`, `retry-btn`, `save-form`(안에 `name-input`, `save-btn`, `save-message`), `replay-btn`, `home-btn` |
| 순위표 | `screen-board` | `board-mode`(select), `board-category`(select), `board-list`(`<ol>`), `board-empty`, `board-home-btn` |

---

# 1단계: 연습 모드와 점수

모드 선택과 틀린 문제 다시 풀기는 아직 만들지 않는다. 모드는 `practice`로 고정한다.

## 1단계에서 만들 것

| 파일 | 내용 |
|---|---|
| `index.html` | 화면 4개 뼈대. 1단계에서는 시작·문제·결과 화면을 채운다 |
| `style.css` | 카드형 기본 배치, 보기 버튼, 정답/오답 색, 360px 대응 |
| `questions.js` | 4개 카테고리 × 10문항 = 40문항(웹으로 확인한 출처 포함) |
| `script.js` | 화면 전환, 섞기, 채점, 점수 표시, 문항 검사, 연습 모드 진행 |

### Task 1: 화면 뼈대와 계산 함수

**Files:**
- Create: `index.html`, `style.css`, `script.js`, `questions.js`(`const QUESTIONS = [];`만), `.claude/launch.json`

**Interfaces:**
- Produces:
  - `const CATEGORIES = ["한국사", "세계지리", "과학", "예술과 문화"]`
  - `const MODES` — PRD 7.1 그대로
  - `let state` — PRD 7.1의 필드 + `firstScore: null`(다시 풀기 중 처음 판 점수), `hintUsed: false`(지금 문항에서 힌트를 썼는지)
  - `showScreen(name: "start"|"quiz"|"result"|"board"): void` — `screen-<name>`만 보인다. 맨 먼저 `stopTimer()`를 부른다(Task 5 전까지 `stopTimer`는 빈 함수).
  - `shuffle(arr: any[]): any[]` — 원본을 바꾸지 않는 새 배열(Fisher–Yates 섞기)
  - `prepareQuestion(q: Question): Question` — 보기를 섞은 복사본. `answer`는 섞인 뒤의 정답 위치. 원본 `q`는 그대로.
  - `scoreFor(correct: boolean, usedHint: boolean): 0|0.5|1`
  - `formatScore(n: number): string` — `7`→`"7"`, `7.5`→`"7.5"`
  - `validateQuestions(list: Question[]): string[]` — 오류 문장 목록(빈 배열이면 정상)

- [ ] **Step 1: 실패 확인** — 빈 섹션 4개와 스크립트 2개만 연결한 `index.html`로 서버를 띄우고 실행:

```js
[
  scoreFor(true,false)===1, scoreFor(true,true)===0.5, scoreFor(false,true)===0, scoreFor(false,false)===0,
  formatScore(7)==="7", formatScore(7.5)==="7.5", formatScore(0)==="0",
  (()=>{const a=[1,2,3,4]; const b=shuffle(a); return a.join()==="1,2,3,4" && b.slice().sort().join()==="1,2,3,4";})(),
  (()=>{const q={choices:["a","b","c","d"],answer:2}; for(let i=0;i<50;i++){const p=prepareQuestion(q); if(p.choices[p.answer]!=="c"||q.choices.join()!=="a,b,c,d") return false;} return true;})(),
  validateQuestions([]).length > 0,
  validateQuestions([{id:"x",category:"과학",question:"q",choices:["a","b","c"],answer:5,explanation:"",source:{name:"",url:""}}]).length >= 4
]
```

Expected: `scoreFor is not defined`

- [ ] **Step 2: 구현** — `validateQuestions`가 잡을 것: 카테고리마다 정확히 10개(문장에 카테고리 이름과 실제 개수), `CATEGORIES`에 없는 카테고리, 보기가 4개가 아님, `answer`가 0~3 정수가 아님, `question`·`explanation`·`source.name`·`source.url` 빈 값, `id` 중복. 문장에는 문항 `id`를 넣는다. 페이지를 열 때 `validateQuestions(QUESTIONS)`를 실행하고 오류마다 `console.error`. `style.css`: 가운데 카드(최대 폭 640px), `body` 배경색, `.choice`, `.correct`(초록), `.wrong`(빨강), `.removed`(흐림).
- [ ] **Step 3: 재확인** — Expected: 모두 `true`
- [ ] **Step 4: 화면 전환 확인**

```js
["start","quiz","result","board"].every(n => { showScreen(n); return [...document.querySelectorAll("section")].filter(s=>!s.hidden).map(s=>s.id).join()==="screen-"+n; })
```

Expected: `true`

### Task 2: 한국사 10문항

**Files:** Modify: `questions.js`

**Interfaces:**
- Consumes: `validateQuestions` (Task 1)
- Produces: `category: "한국사"`, id `hist-01`~`hist-10`인 문항 10개(형식은 PRD 6.1)

- [ ] **Step 1: 실패 확인** — `validateQuestions(QUESTIONS).filter(e=>e.includes("한국사"))` → 한국사 개수 오류 1개
- [ ] **Step 2: 문항 작성** — PRD 6.2 규칙을 지킨다. 시대를 고르게 섞는다(고대·고려·조선·근현대).
- [ ] **Step 3: 문항마다 웹 확인** — WebSearch/WebFetch로 정답과 해설 내용이 실제로 적힌 페이지를 찾아 `source`에 그 페이지 이름과 URL을 적는다. 확인하지 못한 문항은 다른 문항으로 바꾼다. "가장 ~한" 표현에는 기준과 시점이 문제에 있는지 본다.
- [ ] **Step 4: 재확인** — Step 1 식 → `[]`

### Task 3: 연습 모드 게임 진행

**Files:** Modify: `index.html`, `style.css`, `script.js`

**Interfaces:**
- Consumes: Task 1의 함수 전부, `QUESTIONS`(한국사만 있어도 됨)
- Produces:
  - `startGame(mode: string, category: string): void` — 그 카테고리 문항을 `prepareQuestion` 후 순서를 섞어 `state.questions`에 넣고 `index=0`, `results=[]`, `isRetry=false`, `saved=false`, `firstScore=null`. **`showScreen("quiz")`를 먼저 부르고 그다음 `renderQuestion()`** (반대 순서면 2단계에서 `showScreen`이 방금 켠 타이머를 꺼 버린다).
  - `renderQuestion(): void` — `quiz-meta`에 `"<카테고리> · <MODES label> · <index+1> / <문항 수>"`, 보기 4개 다시 활성화, `feedback`·`next-btn` 숨김
  - `selectChoice(i: number): void` — 화면의 i번째 보기를 고른다. 이 문항 결과가 이미 있으면 아무것도 안 한다. `state.results`에 `{ id, correct, usedHint, score }`를 넣고 `showFeedback(i, false)`.
  - `showFeedback(chosen: number|null, timedOut: boolean): void` — 보기 잠금, 정답 보기 `.correct` + "✔", 고른 오답 `.wrong` + "✘", `feedback-verdict`에 "정답!"/"오답"/"시간 초과", 해설, `feedback-source`(`href`=url, 글자 "출처: "+name, `target="_blank"`, `rel="noopener"`), `next-btn` 표시(마지막 문항이면 "결과 보기", 아니면 "다음")
  - `nextQuestion(): void` — 지금 문항 결과가 없으면 아무것도 안 한다(연타 방지). 마지막이면 `showResult()`, 아니면 `index+1` 후 `renderQuestion()`
  - `quitGame(): void` — `confirm("그만두시겠어요? 이번 판은 기록되지 않습니다.")`가 참이면 `showScreen("start")`
  - `totalScore(results): number` — 점수 합
  - `showResult(): void` — `showScreen("result")`, `score-text`에 `formatScore(합) + " / " + 문항 수`. `MODES[state.mode].ranked`가 false면 `result-notice`에 "순위표에 기록되지 않음"
- 시작 화면: 카테고리 라디오 4개(기본 한국사), [시작] → `startGame("practice", 고른 카테고리)`, `practice-notice`("순위표에 기록되지 않음")
- 결과 화면: `replay-btn`("같은 설정으로 다시") → `startGame(state.mode, state.category)`, `home-btn`("처음으로") → `showScreen("start")`

- [ ] **Step 1: 실패 확인**

```js
startGame("practice","한국사");
const okLen = state.questions.length===10;
selectChoice(state.questions[0].answer); selectChoice((state.questions[0].answer+1)%4);   // 연타
const oneResult = state.results.length===1 && state.results[0].score===1;
nextQuestion(); nextQuestion();                                                            // 연타
const noSkip = state.index===1;
[okLen, oneResult, noSkip, document.getElementById("quiz-meta").textContent==="한국사 · 연습 · 2 / 10"]
```

Expected: `startGame is not defined`

- [ ] **Step 2: 구현**
- [ ] **Step 3: 재확인** — Expected: `[true, true, true, true]`
- [ ] **Step 4: 끝까지 진행 확인**

```js
startGame("practice","한국사");
state.questions.forEach((q,i)=>{ selectChoice(i<7 ? q.answer : (q.answer+1)%4); nextQuestion(); });
[document.getElementById("score-text").textContent==="7 / 10", !document.getElementById("screen-result").hidden, document.getElementById("result-notice").textContent.includes("순위표에 기록되지 않음")]
```

Expected: `[true, true, true]`

- [ ] **Step 5: 좁은 화면 확인** — `resize_window` 360×800에서 문제·결과 화면을 띄우고 `document.documentElement.scrollWidth <= innerWidth` → `true`. 끝나면 `preset: "desktop"`으로 되돌린다.

### Task 4: 세계지리·과학·예술과 문화 30문항

**Files:** Modify: `questions.js`

Task 2와 같은 절차(작성 → 문항마다 웹 확인 → 검사)를 카테고리마다 따로 한다. 한 카테고리를 마칠 때마다 `validateQuestions(QUESTIONS).filter(e=>e.includes("<카테고리>"))`가 `[]`인지 확인한다.

| 카테고리 | id | 고르게 섞을 주제 |
|---|---|---|
| 세계지리 | `geo-01`~`geo-10` | 대륙, 지형·기후·나라·도시. 최상급 문항은 기준과 시점을 반드시 적는다 |
| 과학 | `sci-01`~`sci-10` | 물리·화학·생명·지구과학 |
| 예술과 문화 | `art-01`~`art-10` | 미술·음악·문학·건축·한국 전통문화 |

- [ ] **Step 1: 세계지리 10문항 작성·확인·검사**
- [ ] **Step 2: 과학 10문항 작성·확인·검사**
- [ ] **Step 3: 예술과 문화 10문항 작성·확인·검사**
- [ ] **Step 4: 전체 검사** — `validateQuestions(QUESTIONS)` → `[]`, `QUESTIONS.length` → `40`
- [ ] **Step 5: 문항 표 정리** — 사용자에게 보여 줄 40문항 표(id / 문제 / 정답 / 출처 URL)를 만든다.

## 1단계 완료 기준

- [ ] Task 1~4의 콘솔 확인이 모두 통과한다.
- [ ] `validateQuestions(QUESTIONS)`가 `[]`이고, 페이지를 열 때 콘솔에 빨간 오류가 없다.
- [ ] 40문항 모두 출처를 웹에서 실제로 확인했고, PRD 6.2 작성 규칙을 지킨다.
- [ ] 360px 폭에서 가로 스크롤이 없다.
- [ ] PRD 8장 "1단계" 체크리스트를 모두 만족한다.
- [ ] 아래 "내가 직접 확인할 항목"을 사용자가 확인했다.

## 1단계 — 내가 브라우저에서 직접 확인할 항목

`index.html`을 **더블클릭**해서 연다.

- [ ] 주소창이 `file://`로 시작하는데도 시작 화면이 정상으로 보인다.
- [ ] 시작 화면에 카테고리 4개와 "순위표에 기록되지 않음"이 보인다.
- [ ] 한국사를 고르고 [시작] → 맨 위에 "한국사 · 연습 · 1 / 10"이 보이고, 한국사 문제가 나온다.
- [ ] **정답**을 누르면: 그 보기가 초록색 + ✔, "정답!", 한 줄 해설, "출처: ○○○"가 보인다.
- [ ] **오답**을 누르면: 내가 고른 보기는 빨간색 + ✘, 정답 보기는 초록색 + ✔, "오답"과 해설이 보인다.
- [ ] 답을 고른 뒤 다른 보기를 눌러도 아무 변화가 없다.
- [ ] "출처: ○○○" 링크를 누르면 새 탭에서 페이지가 열리고, 그 페이지에 정답 내용이 있다.
- [ ] [다음]을 눌러 10번째 문제까지 가면 버튼이 [결과 보기]로 바뀐다.
- [ ] 결과 화면에 "7 / 10" 같은 점수와 "순위표에 기록되지 않음"이 보인다. 점수가 내가 맞힌 개수와 같다.
- [ ] [같은 설정으로 다시] → 같은 카테고리로 새 판이 시작되고, 문제 순서와 보기 순서가 앞 판과 다르다.
- [ ] [처음으로] → 시작 화면으로 간다.
- [ ] 문제 도중 [그만두기] → "그만두시겠어요? 이번 판은 기록되지 않습니다." 창이 뜬다. [취소]는 그대로, [확인]은 시작 화면으로 간다.
- [ ] 나머지 카테고리 3개도 각각 한 판씩 해 보고, 그 카테고리 문제만 나오는지 본다.
- [ ] 휴대폰 폭 확인: 브라우저 창을 가장 좁게 줄이거나(또는 F12 → 휴대폰 아이콘 → 폭 360) 문제·결과 화면에 가로 스크롤이 없고 글이 줄바꿈된다.
- [ ] Claude가 준 40문항 표를 훑어보고, 이상한 문제·정답이 없다.

## 1단계 저장과 배포

- [ ] `.gitignore`에 `.claude/` 한 줄을 넣는다.
- [ ] 사용자 확인이 끝나면 커밋한다.

```bash
git add index.html style.css script.js questions.js .gitignore
git commit -m "feat: 1단계 연습 모드와 점수"
```

- [ ] 사용자가 지시하면 깃허브에 공개 저장소 `Study03_Quiz`를 만들어 master를 올리고 GitHub Pages를 켠다. 배포된 주소를 열어 시작 화면을 확인하고 Pages 주소를 알린다.

---

# 2단계: 스피드 모드, 힌트 모드, 틀린 문제 다시 풀기

스피드·힌트 모드를 고르려면 시작 화면에 모드 선택이 있어야 하므로(PRD 4.1, 8장), 모드 선택 라디오도 이 단계에서 만든다.

## 2단계에서 만들 것

| 기능 | 내용 |
|---|---|
| 모드 선택 | 시작 화면에 연습·스피드·힌트 라디오. 연습일 때만 "순위표에 기록되지 않음" |
| 스피드 모드 | 문항마다 15초 카운트다운, 0초면 "시간 초과" 오답, 해설 중엔 멈춤 |
| 힌트 모드 | 문항마다 [힌트] 1번, 오답 2개 흐리게·잠금, 힌트 쓰고 맞히면 0.5점 |
| 틀린 문제 다시 풀기 | 연습 모드 결과 화면에서 틀린 문제만 다시. 처음 점수는 그대로 |

### Task 5: 모드 선택과 스피드 모드

**Files:** Modify: `index.html`, `style.css`, `script.js`

**Interfaces:**
- Consumes: `startGame`, `renderQuestion`, `selectChoice`, `showFeedback`, `showScreen` (Task 1·3)
- Produces:
  - 시작 화면 `mode-options`: 라디오 3개(값 `practice`/`speed`/`hint`, 글자는 `MODES[..].label`), 기본 `practice`. `practice-notice`는 `MODES[고른 모드].ranked`가 false일 때만 보인다. [시작]은 고른 모드로 `startGame`.
  - `startTimer(): void` — `MODES[state.mode].timeLimit`이 null이면 아무것도 안 한다. 아니면 `state.timeLeft = timeLimit`을 `timer`에 표시하고, 1초마다 1씩 줄여 표시, 0이 되면 `onTimeout()`
  - `stopTimer(): void` — `clearInterval(state.timerId)`, `state.timerId = null`
  - `onTimeout(): void` — `stopTimer()`. 이 문항 결과가 이미 있으면 그만. 아니면 `{ correct:false, usedHint:false, score:0 }`을 넣고 `showFeedback(null, true)`
  - `renderQuestion()`은 끝에서 `startTimer()`를 부른다. `selectChoice()`는 채점 전에 `stopTimer()`를 부른다. `timeLimit`이 없는 모드에서는 `timer`를 숨긴다.

- [ ] **Step 1: 실패 확인**

```js
startGame("speed","과학");
const started = state.timeLeft===15 && state.timerId!==null && document.getElementById("timer").textContent.includes("15");
onTimeout();
const timedOut = state.results.length===1 && state.results[0].score===0 && state.timerId===null && document.getElementById("feedback-verdict").textContent==="시간 초과";
selectChoice(0);                                     // 시간 초과 뒤 클릭
const noDouble = state.results.length===1;
nextQuestion();
const restarted = state.timeLeft===15 && state.timerId!==null;
showScreen("start");
const stopped = state.timerId===null;
[started, timedOut, noDouble, restarted, stopped]
```

Expected: `started`가 `false`

- [ ] **Step 2: 구현**
- [ ] **Step 3: 재확인** — Expected: 모두 `true`
- [ ] **Step 4: 실제 시간 확인** — 스피드 모드를 시작하고 `computer` `wait`로 16초 기다린 뒤 "시간 초과"와 정답 보기 ✔가 보이고 숫자가 0에서 멈췄는지 본다. 다음 문항에서 보기를 고른 뒤 5초 기다려도 숫자가 그대로인지 본다.
- [ ] **Step 5: 연습 모드 회귀 확인** — Task 3 Step 4 식 → `[true, true, true]`, 연습 모드에서 `timer`가 숨겨져 있다.

### Task 6: 힌트 모드

**Files:** Modify: `index.html`, `style.css`, `script.js`

**Interfaces:**
- Consumes: `renderQuestion`, `selectChoice`, `scoreFor`, `state.hintUsed` (Task 1·3)
- Produces:
  - `pickHintRemovals(q: Question): number[]` — `q.answer`가 아닌 위치 3개 중 2개를 무작위로
  - `useHint(): void` — `state.hintUsed`이거나 이 문항 결과가 있으면 아무것도 안 한다. 아니면 고른 두 보기에 `.removed` + `disabled`, `hint-btn` 비활성, `state.hintUsed = true`
  - `renderQuestion()`은 `state.hintUsed = false`로 되돌리고 `hint-btn`을 다시 활성화한다. `hint-btn`은 `MODES[state.mode].hint`가 true일 때만 보인다.
  - `selectChoice()`는 결과의 `usedHint`에 `state.hintUsed`를 넣고 `scoreFor(correct, state.hintUsed)`로 점수를 매긴다. 답을 고른 뒤에는 `hint-btn`도 비활성화한다.

- [ ] **Step 1: 실패 확인**

```js
const q={choices:["a","b","c","d"],answer:1};
const removalsOk = Array.from({length:50},()=>pickHintRemovals(q)).every(r=>r.length===2 && !r.includes(1) && new Set(r).size===2);
startGame("hint","세계지리");
useHint(); useHint();
const removed=[...document.querySelectorAll(".choice.removed")];
const hintOk = removed.length===2 && removed.every(b=>b.disabled) && document.getElementById("hint-btn").disabled;
removed[0].click();
const ignored = state.results.length===0;
selectChoice(state.questions[0].answer);
const half = state.results[0].score===0.5 && state.results[0].usedHint===true;
nextQuestion();
const reset = !document.getElementById("hint-btn").disabled && document.querySelectorAll(".choice.removed").length===0;
[removalsOk, hintOk, ignored, half, reset]
```

Expected: `pickHintRemovals is not defined`

- [ ] **Step 2: 구현**
- [ ] **Step 3: 재확인** — Expected: 모두 `true`
- [ ] **Step 4: 점수 표시 확인** — 힌트 쓰고 맞힘 3개, 힌트 없이 맞힘 4개, 틀림 3개로 한 판을 끝내면 `score-text`가 `"5.5 / 10"`
- [ ] **Step 5: 회귀 확인** — 연습·스피드 모드에서 `hint-btn`이 숨겨져 있다.

### Task 7: 틀린 문제 다시 풀기 (연습 모드)

**Files:** Modify: `index.html`, `script.js`

**Interfaces:**
- Consumes: `startGame`, `renderQuestion`, `showResult`, `totalScore`, `prepareQuestion`, `shuffle`, `showScreen`
- Produces:
  - `wrongIds(results): string[]` — `correct`가 false인 결과의 id
  - `startRetry(): void` — 지금 판에서 틀린 문항을 원본 `QUESTIONS`에서 id로 찾아 `prepareQuestion` 후 순서를 섞는다. 처음 판에서 부를 때만 `state.firstScore = totalScore(state.results)`(다시 푼 판에서 또 부르면 그대로 둔다). `isRetry=true`, `index=0`, `results=[]`, 그다음 `showScreen("quiz")` → `renderQuestion()`
  - `showResult()` 변경:
    - `isRetry`면 `retry-text`에 `"<문항 수>문제 중 <맞힌 수>문제 맞힘"`, `score-text`는 처음 점수 `formatScore(state.firstScore) + " / 10"`. 아니면 `retry-text`를 숨긴다.
    - `retry-btn`("틀린 문제 다시 풀기")은 `MODES[state.mode].ranked`가 false이고 `wrongIds(state.results).length > 0`일 때만 보인다.

- [ ] **Step 1: 실패 확인**

```js
startGame("practice","과학");
state.questions.forEach((q,i)=>{ selectChoice(i<7 ? q.answer : (q.answer+1)%4); nextQuestion(); });
const btnShown = !document.getElementById("retry-btn").hidden;
startRetry();
const three = state.questions.length===3 && state.isRetry && document.getElementById("quiz-meta").textContent.endsWith("1 / 3");
state.questions.forEach((q,i)=>{ selectChoice(i<2 ? q.answer : (q.answer+1)%4); nextQuestion(); });
const msg = document.getElementById("retry-text").textContent==="3문제 중 2문제 맞힘" && document.getElementById("score-text").textContent==="7 / 10";
startRetry();
const again = state.questions.length===1 && state.firstScore===7;
state.questions.forEach(q=>{ selectChoice(q.answer); nextQuestion(); });
const hidden = document.getElementById("retry-btn").hidden;
[btnShown, three, msg, again, hidden]
```

Expected: `startRetry is not defined`

- [ ] **Step 2: 구현**
- [ ] **Step 3: 재확인** — Expected: 모두 `true`
- [ ] **Step 4: 다른 모드 확인** — 스피드·힌트 모드 결과 화면에서 `retry-btn`이 숨겨져 있다. 다시 풀기 결과 화면에서 [같은 설정으로 다시]를 누르면 10문제 새 판이 시작되고 `state.isRetry===false`.

## 2단계 완료 기준

- [ ] Task 5~7의 콘솔 확인과 실제 시간 확인이 모두 통과한다.
- [ ] 1단계 콘솔 확인(Task 3 Step 4)이 여전히 통과한다.
- [ ] 모드별 차이를 모드 이름 비교(`=== "speed"` 등)가 아니라 `MODES` 값으로 나눴다.
- [ ] PRD 8장 "2단계" 체크리스트를 모두 만족한다.
- [ ] 아래 "내가 직접 확인할 항목"을 사용자가 확인했다.

## 2단계 — 내가 브라우저에서 직접 확인할 항목

`index.html`을 **더블클릭**해서 연다.

**모드 선택**
- [ ] 시작 화면에 연습·스피드·힌트 3개가 있고, 처음엔 연습이 골라져 있다.
- [ ] 연습을 고르면 "순위표에 기록되지 않음"이 보이고, 스피드나 힌트를 고르면 사라진다.

**스피드 모드**
- [ ] 스피드로 시작하면 맨 위가 "○○ · 스피드 · 1 / 10"이고, 15부터 1초씩 줄어드는 숫자가 보인다.
- [ ] 아무것도 누르지 않고 기다리면 0에서 "시간 초과"가 나오고, 정답 보기가 초록 + ✔로 보인다.
- [ ] 시간 초과 뒤 보기를 눌러도 아무 변화가 없다.
- [ ] 답을 고르고 해설을 읽는 동안 숫자가 멈춰 있다.
- [ ] [다음]을 누르면 다시 15부터 센다.
- [ ] 도중에 [그만두기] → [확인]으로 시작 화면에 간 뒤 20초쯤 기다려도 아무 일도 일어나지 않는다(타이머가 남지 않음).

**힌트 모드**
- [ ] 힌트로 시작하면 [힌트] 버튼이 보이고 숫자(타이머)는 없다.
- [ ] [힌트]를 누르면 오답 2개가 흐려지고 눌러도 반응이 없다. 정답은 흐려지지 않는다.
- [ ] 힌트를 쓴 뒤 [힌트] 버튼이 회색으로 눌리지 않는다. 다음 문항에서는 다시 누를 수 있다.
- [ ] 답을 먼저 고르면 그 문항에서는 [힌트]를 누를 수 없다.
- [ ] 힌트를 한 번 이상 쓰고 맞히면 결과 점수가 "7.5 / 10"처럼 소수점으로 나온다.

**틀린 문제 다시 풀기**
- [ ] 연습 모드에서 일부러 2~3문제를 틀리고 끝내면 [틀린 문제 다시 풀기] 버튼이 보인다.
- [ ] 누르면 틀린 문제만 나오고, 진행 표시가 "1 / 3"처럼 그 개수 기준이다.
- [ ] 다 풀면 "3문제 중 2문제 맞힘"이 나오고, 점수는 처음 판 점수 그대로다.
- [ ] 또 틀린 게 있으면 버튼이 다시 보이고, 그 문제만 또 풀 수 있다. 다 맞히면 버튼이 사라진다.
- [ ] 10문제를 모두 맞힌 판에서는 처음부터 버튼이 없다.
- [ ] 스피드·힌트 모드 결과 화면에는 이 버튼이 없다.

## 2단계 저장과 배포

- [ ] 사용자 확인이 끝나면 커밋한다.

```bash
git add index.html style.css script.js
git commit -m "feat: 2단계 스피드·힌트 모드와 틀린 문제 다시 풀기"
```

- [ ] 사용자가 지시하면 master를 푸시해 GitHub Pages를 갱신하고, 배포된 주소에서 모드 선택 화면이 보이는지 확인한다.

---

# 3단계: 점수 저장과 순위표 (localStorage)

## 3단계에서 만들 것

| 기능 | 내용 |
|---|---|
| 순위표 계산·저장 | 정렬·상위 5개 자르기, 이름 정리, 날짜 형식, localStorage 읽기/쓰기(오류에도 안 멈춤) |
| 기록 저장 화면 | 스피드·힌트 결과 화면에 이름 입력칸 + [기록 저장](한 판 1번) |
| 순위표 화면 | 모드 × 카테고리 고르기, 상위 5개(순위·이름·점수·날짜), 기록 없으면 안내 |

### Task 8: 순위표 계산과 저장 함수

**Files:** Modify: `script.js`

**Interfaces:**
- Produces:
  - `boardKey(mode: string, category: string): string` — `"speed|한국사"`
  - `normalizeName(raw: string): string` — 앞뒤 공백 제거, 10자까지, 비면 `"이름 없음"`
  - `formatDate(d: Date): string` — `"2026-10-08 14:30"`(두 자리 맞춤)
  - `insertRecord(list: Record[], record: Record): Record[]` — 새 배열. 점수 내림차순, 같은 점수면 기존 기록 뒤, 최대 5개. `Record = { name, score, date }`
  - `loadBoard(): object` — `quizLeaderboard`를 읽는다. 값이 없거나, JSON이 아니거나, 일반 객체가 아니거나, 읽기 오류면 `{}`. 값이 배열이 아닌 항목은 버린다. `try/catch`로 감싼다.
  - `saveBoard(board: object): boolean` — 쓰기 성공 여부. `try/catch`로 감싼다.

- [ ] **Step 1: 실패 확인**

```js
const r=(name,score)=>({name,score,date:"2026-10-08 12:00"});
const a=r("A",8), b=r("B",9), c=r("C",8);
const tieOk = insertRecord([a,b],c).map(x=>x.name).join()==="B,A,C";
const full=[r("1",10),r("2",9),r("3",8),r("4",7),r("5",6)];
const capOk = insertRecord(full,r("X",5)).length===5 && !insertRecord(full,r("X",5)).some(x=>x.name==="X") && insertRecord(full,r("Y",6.5)).map(x=>x.name).join()==="1,2,3,4,Y" && insertRecord(full,r("Z",6)).map(x=>x.name).join()==="1,2,3,4,5";
const nameOk = normalizeName("  ")==="이름 없음" && normalizeName(" 가나다라마바사아자차카 ")==="가나다라마바사아자차" && normalizeName("<b>나</b>")==="<b>나</b>";
const dateOk = formatDate(new Date(2026,9,8,9,5))==="2026-10-08 09:05";
const keyOk = boardKey("speed","한국사")==="speed|한국사";
localStorage.setItem("quizLeaderboard","{깨짐"); const broken1 = JSON.stringify(loadBoard())==="{}";
localStorage.setItem("quizLeaderboard","[1,2]"); const broken2 = JSON.stringify(loadBoard())==="{}";
localStorage.setItem("quizLeaderboard",'{"speed|과학":"x","hint|과학":[]}'); const broken3 = JSON.stringify(loadBoard())==='{"hint|과학":[]}';
const saveOk = saveBoard({"speed|과학":[a]})===true && loadBoard()["speed|과학"][0].name==="A";
localStorage.removeItem("quizLeaderboard");
[tieOk, capOk, nameOk, dateOk, keyOk, broken1, broken2, broken3, saveOk]
```

Expected: `insertRecord is not defined`

- [ ] **Step 2: 구현**
- [ ] **Step 3: 재확인** — Expected: 모두 `true`

### Task 9: 기록 저장 화면과 순위표 화면

**Files:** Modify: `index.html`, `style.css`, `script.js`

**Interfaces:**
- Consumes: Task 8의 함수 전부, `showResult`, `showScreen`, `totalScore`, `formatScore`
- Produces:
  - `showResult()` 변경: `MODES[state.mode].ranked`가 true면 `save-form`을 보이고 `name-input`(`maxlength` 없이, 자르기는 `normalizeName`이 함)을 비우고 `save-btn` 활성화, `save-message` 비움. 아니면 `save-form` 숨김.
  - `saveRecord(): void` — `state.saved`면 아무것도 안 한다. `{ name: normalizeName(name-input 값), score: totalScore(state.results), date: formatDate(new Date()) }`을 `loadBoard()`의 해당 목록에 `insertRecord`로 넣는다. 결과에 이 기록이 없으면 "순위권 밖입니다"(저장 안 함). 있으면 `saveBoard`, 실패하면 "기록을 저장할 수 없습니다", 성공하면 `"<순위>위로 기록했습니다"`. 어느 경우든 `state.saved = true`, `save-btn` 비활성.
  - `renderBoard(mode: string, category: string): void` — `board-list`를 비우고 기록마다 `<li>`에 `"<이름> · <formatScore(점수)>점 · <날짜>"`를 `textContent`로 넣는다(순위는 `<ol>` 번호). 기록이 없으면 `board-empty`("아직 기록이 없습니다")를 보인다.
  - 시작 화면 `board-btn`("순위표 보기") → `showScreen("board")` 후 `board-mode`/`board-category` 현재 값으로 `renderBoard`(기본 스피드·한국사). 두 select가 바뀌면 `renderBoard`. `board-home-btn`("처음으로") → `showScreen("start")`.
  - 페이지를 열 때 테스트 키를 `try`로 쓰고 지워 보고, 실패하면 `storage-warning`에 "기록을 저장할 수 없습니다"를 보인다.

- [ ] **Step 1: 실패 확인**

```js
localStorage.removeItem("quizLeaderboard");
const play=(mode,cat,n)=>{ startGame(mode,cat); state.questions.forEach((q,i)=>{ selectChoice(i<n ? q.answer : (q.answer+1)%4); nextQuestion(); }); };
play("speed","한국사",8);
const formShown = !document.getElementById("save-form").hidden;
document.getElementById("name-input").value="<b>나</b>";
saveRecord(); saveRecord();
const once = loadBoard()["speed|한국사"].length===1 && document.getElementById("save-btn").disabled;
renderBoard("speed","한국사");
const li=document.querySelector("#board-list li");
const escaped = li.textContent.startsWith("<b>나</b> · 8점") && li.querySelector("b")===null;
renderBoard("hint","과학");
const empty = !document.getElementById("board-empty").hidden;
play("practice","한국사",10);
const noPractice = document.getElementById("save-form").hidden && !("practice|한국사" in loadBoard());
localStorage.removeItem("quizLeaderboard");
[formShown, once, escaped, empty, noPractice]
```

Expected: `saveRecord is not defined`

- [ ] **Step 2: 구현**
- [ ] **Step 3: 재확인** — Expected: 모두 `true`
- [ ] **Step 4: 순위권 밖 확인** — `saveBoard({"speed|한국사":[10점 기록 5개]})` 뒤 9점 판을 저장하면 "순위권 밖입니다"가 나오고 목록이 그대로 5개다.
- [ ] **Step 5: 저장 불가 확인** — `Storage.prototype.setItem = () => { throw new Error("x"); }` 실행 뒤 한 판을 저장하면 "기록을 저장할 수 없습니다"가 나오고 [처음으로]·새 판이 정상 동작한다. 새로고침해 원래대로 돌리고 `localStorage.removeItem("quizLeaderboard")`로 테스트 기록을 지운다.

## 3단계 완료 기준

- [ ] Task 8~9의 콘솔 확인이 모두 통과한다.
- [ ] 1·2단계 콘솔 확인(Task 3 Step 4, Task 5·6·7 Step 3)이 여전히 통과한다.
- [ ] localStorage 키는 `quizLeaderboard` 하나뿐이고, 형식이 PRD 5장 예시와 같다.
- [ ] 연습 모드 기록은 어디에도 저장되지 않는다.
- [ ] PRD 8장 "3단계" 체크리스트를 모두 만족한다.
- [ ] 아래 "내가 직접 확인할 항목"을 사용자가 확인했다.

## 3단계 — 내가 브라우저에서 직접 확인할 항목

`index.html`을 **더블클릭**해서 연다.

**기록 저장**
- [ ] 스피드 모드 한 판을 끝내면 결과 화면에 이름 입력칸과 [기록 저장]이 있다.
- [ ] 이름을 넣고 [기록 저장] → "○위로 기록했습니다"가 나오고 버튼이 회색이 된다. 다시 눌러도 반응이 없다.
- [ ] 이름을 비워 두고 저장하면 순위표에 "이름 없음"으로 나온다.
- [ ] 이름에 11자 넘게(예: "가나다라마바사아자차카타") 넣으면 순위표에 앞 10자만 나온다.
- [ ] 이름에 `<b>나</b>`를 넣으면 순위표에 이 글자 그대로 보인다(굵은 글씨로 바뀌지 않음).
- [ ] 힌트 모드에서도 똑같이 저장된다.
- [ ] 연습 모드 결과 화면에는 이름 입력칸이 없다.
- [ ] 저장하지 않고 [처음으로]를 누르면 그 판은 순위표에 없다.

**순위표 화면**
- [ ] 시작 화면 [순위표 보기] → 순위표 화면이 나온다.
- [ ] 모드(스피드·힌트)와 카테고리를 바꾸면 그 조합의 기록만 보인다. 기록이 없으면 "아직 기록이 없습니다"가 보인다.
- [ ] 각 줄에 순위, 이름, 점수, 날짜·시각(예: 2026-10-12 14:30)이 있다.
- [ ] 같은 조합에 6판 이상 저장해 보면 5개까지만 보이고, 높은 점수가 위에 있다.
- [ ] 같은 점수가 있으면 먼저 저장한 기록이 위에 있다.
- [ ] 5등보다 낮은 점수로 저장하면 "순위권 밖입니다"가 나오고 순위표는 그대로다.
- [ ] [처음으로] → 시작 화면으로 간다.

**유지**
- [ ] 새로고침(F5)해도 기록이 남아 있다.
- [ ] 브라우저를 완전히 닫았다가 `index.html`을 다시 더블클릭해도 기록이 남아 있다.

**(선택) 저장할 수 없는 상황**
- [ ] 시크릿 창에서 `index.html`을 열거나 브라우저 설정에서 사이트 데이터 저장을 막은 상태에서도 게임이 진행되고, 저장이 안 되면 "기록을 저장할 수 없습니다"가 보인다.

## 3단계 저장과 배포

- [ ] 사용자 확인이 끝나면 커밋한다.

```bash
git add index.html style.css script.js
git commit -m "feat: 3단계 점수 저장과 순위표"
```

- [ ] 사용자가 지시하면 master를 푸시해 GitHub Pages를 갱신하고, 배포된 주소에서 [순위표 보기]가 동작하는지 확인한다.
