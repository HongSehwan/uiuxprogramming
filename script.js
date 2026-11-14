const serviceName = '두근두근 영어';
let isSubscribed = false;
let submitCount = 0;

function makeSubscribeMessage(email, subscribed) {
    if (subscribed == true) {
        return email + "로 신청이 완료되었습니다.";
    }

    return "이메일을 입력한 뒤 신청해주세요.";
}

const subscribeForm = document.querySelector('#subscribe-form');
const emailInput = document.querySelector('#email');
const subscribeButton = document.querySelector('#subscribeButton');
const subscribeMessage = document.querySelector('#subscribeMessage');

function handleSubscribe(event) {
    event.preventDefault();

    const subscribeEmail = emailInput.value.trim();

    if(subscribeEmail === "") {
        subscribeMessage.textContent = "이메일을 입력한 뒤 신청해주세요.";
        emailInput.focus();
        return;
    }

    isSubscribed = true;
    submitCount += 1;

    subscribeMessage.textContent = makeSubscribeMessage(subscribeEmail, isSubscribed);

    subscribeMessage.classList.add("is-success");

    subscribeButton.textContent = "신청 완료";
    subscribeButton.disabled = true;
}

subscribeForm.addEventListener('submit', handleSubscribe);

const themeButton = document.querySelector("#themeButton");
const nameInput = document.querySelector("#name");
const nameCount = document.querySelector("#nameCount");
const agreeCheck = document.querySelector("#agreeCheck");
const agreeMessage = document.querySelector("#agreeMessage");
const startButton = document.querySelector("#startButton");

function handleThemeClick() {
    const isDark = document.body.classList.toggle("dark");

    themeButton.textContent = isDark ? "라이트 테마로 바꾸기" : "다크 테마로 바꾸기";
}

themeButton.addEventListener("click", handleThemeClick);

function handleNameInput() {
    const maxLength = nameInput.maxLength;
    const currentLength = Math.min(nameInput.value.length, maxLength);
    nameCount.textContent = currentLength + " / " + maxLength;
}

nameInput.addEventListener("input", handleNameInput);

function handleAgreeChange() {
    const agreed = agreeCheck.checked;

    startButton.disabled = !agreed;
    agreeMessage.textContent = agreed
        ? "화상통화 설정을 시작할 수 있습니다."
        : "동의 후 화상통화 설정을 시작할 수 있습니다.";

    if (agreed) {
        agreeMessage.classList.add("is-ready");
    } else {
        agreeMessage.classList.remove("is-ready");
    }
}

agreeCheck.addEventListener("change", handleAgreeChange);

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

function resetTabsAndPanels() {
    tabs.forEach(function (tab) {
        tab.classList.remove("is-active");
        tab.setAttribute("aria-selected", "false");
    });

    panels.forEach(function (panel) {
        panel.classList.remove("is-active");
        panel.hidden = true;
    });
}
function activateTab(clickedTab) {
    const targetSelector = clickedTab.dataset.target;
    const targetPanel = document.querySelector(targetSelector);

    clickedTab.classList.add("is-active");
    clickedTab.setAttribute("aria-selected", "true");

    targetPanel.classList.add("is-active");
    targetPanel.hidden = false;
}

function handleTabClick(event) {
    resetTabsAndPanels();
    activateTab(event.currentTarget);
}

tabs.forEach(function (tab) {
    tab.addEventListener("click", handleTabClick);
});

const trainingFlow = document.querySelector("#training-flow");
const flowSteps = trainingFlow.querySelectorAll(".step");
const progressItems = trainingFlow.querySelectorAll(".progress__item");
const nicknameInput = document.querySelector("#nickname");
const nicknameError = document.querySelector("#nickname-error");
const nicknameCount = document.querySelector("#nickname-count");
const nicknameNext = document.querySelector("#nickname-next");
const wordCountRange = document.querySelector("#word-count-range");
const wordCountValue = document.querySelector("#word-count-value");
const sentenceOption = document.querySelector("#sentence-option");
const sentenceOptions = document.querySelector("#sentence-options");
const sentenceRadios = document.querySelectorAll("input[name=sentence-count]");
const optionPrev = document.querySelector("#option-prev");
const optionNext = document.querySelector("#option-next");
const summaryPrev = document.querySelector("#summary-prev");
const finishButton = document.querySelector("#finish-button");
const restartButton = document.querySelector("#restart-button");
const summaryNickname = document.querySelector("#summary-nickname");
const summaryWordCount = document.querySelector("#summary-word-count");
const summarySentence = document.querySelector("#summary-sentence");
const wordCountValues = ["3", "5", "10"];

const formData = {
    nickname: "", wordCount: "5", sentence: false, sentenceCount: "2"
}

function showStep(index) {
    flowSteps.forEach((step, i) => { step.hidden = i !== index; });
    progressItems.forEach((item, i) => {
        item.classList.toggle("is-active", i === index);
    });
}

const videoCallDialog = document.querySelector("#video-call-dialog");
const videoCallCancel = document.querySelector("#video-call-cancel");
const videoCallConfirm = document.querySelector("#video-call-confirm");

function revokeVideoCallAgreement() {
    agreeCheck.checked = false;
    trainingFlow.hidden = true;
    resetQuiz();
    handleAgreeChange();
    agreeCheck.focus();
}

startButton.addEventListener("click", () => {
    if(!agreeCheck.checked) return;
    videoCallDialog.showModal();
});

videoCallCancel.addEventListener("click", () => {
    videoCallDialog.close();
    revokeVideoCallAgreement();
})

videoCallDialog.addEventListener("cancel", revokeVideoCallAgreement);
videoCallConfirm.addEventListener("click", () => {
    if(!agreeCheck.checked) return;
    videoCallDialog.close();
    resetQuiz();
    trainingFlow.hidden = false;
    showStep(0);
    trainingFlow.scrollIntoView({ behavior: "smooth" });
    nicknameInput.focus();
});

function validateNickname() {
    const value = nicknameInput.value.trim();
    if (!value) {
        nicknameError.textContent = "오류: 닉네임이 비어 있습니다. 1자 이상 10자 이하로 입력해 주세요.";
        nicknameInput.classList.add("has-error");
        nicknameInput.focus();
        return false;
    }

    nicknameError.textContent = "";
    nicknameInput.classList.remove("has-error");
    formData.nickname = value;
    return true;
}

// 글자 수 표시, 오류가 있던 칸은 고치면 바로 오류 해제
nicknameInput.addEventListener("input", () => {
    nicknameCount.textContent = nicknameInput.value.length + " / 10자";
    if (nicknameInput.classList.contains("has-error")) validateNickname();
});

nicknameNext.addEventListener("click", () => {
    if (!validateNickname()) return;
    showStep(1);
});

wordCountRange.addEventListener("input", () => {
    wordCountValue.value = wordCountValues[wordCountRange.value] + "개";
});

// 문장 포함을 체크하면 문장 수 영역을 보여 주고 선택 가능, 해제하면 숨기고 disabled
function updateSentenceOptions() {
    const checked = sentenceOption.checked;

    sentenceOptions.hidden = !checked;
    sentenceOption.setAttribute("aria-expanded", checked ? "true" : "false");
    sentenceRadios.forEach((radio) => {
        radio.disabled = !checked;
    });
}

sentenceOption.addEventListener("change", updateSentenceOptions);

optionPrev.addEventListener("click", () => showStep(0));
optionNext.addEventListener("click", () => {
    formData.wordCount = wordCountValues[wordCountRange.value];
    formData.sentence = sentenceOption.checked;
    const count = document.querySelector("input[name=sentence-count]:checked");
    formData.sentenceCount = count.value;
    summaryNickname.textContent = formData.nickname;
    summaryWordCount.textContent = formData.wordCount + "개";
    summarySentence.textContent = formData.sentence ? formData.sentenceCount + "개 포함" : "미포함";
    showStep(2);
});

summaryPrev.addEventListener("click", () => showStep(1));
finishButton.addEventListener("click", () => showStep(3));
restartButton.addEventListener("click", () => {
    formData.nickname = "";
    formData.wordCount = "5";
    formData.sentence = false;
    formData.sentenceCount = "2";
    nicknameInput.value = "";
    nicknameError.textContent = "";
    nicknameInput.classList.remove("has-error");
    nicknameCount.textContent = "0 / 10자";
    wordCountRange.value = "1";
    wordCountValue.value = "5개";
    sentenceOption.checked = false;
    updateSentenceOptions();
    document.querySelector("input[name=sentence-count][value='2']").checked = true;
    summaryNickname.textContent = "";
    summaryWordCount.textContent = "";
    summarySentence.textContent = "";
    resetQuiz();
    showStep(0);
});

// 학습 설정을 마친 학습자가 설정한 단어 수와 문장 옵션에 맞춰 한국어 뜻을 보고 영어 단어와 문장을 직접 입력하며 학습 진행
const wordList = [
    { korean: "사과", english: "apple" },
    { korean: "친구", english: "friend" },
    { korean: "학교", english: "school" },
    { korean: "행복한", english: "happy" },
    { korean: "물", english: "water" },
    { korean: "책", english: "book" },
    { korean: "가족", english: "family" },
    { korean: "아침", english: "morning" },
    { korean: "배우다", english: "learn" },
    { korean: "말하다", english: "speak" }
];

const sentenceList = [
    { korean: "만나서 반가워요.", english: "Nice to meet you." },
    { korean: "저는 영어를 배우고 있어요.", english: "I am learning English." },
    { korean: "다시 말해 주시겠어요?", english: "Can you say that again?" }
];

// 한 문제에 답을 입력할 수 있는 기회
const maxTry = 3;

const quizStart = document.querySelector("#quiz-start");
const wordQuiz = document.querySelector("#word-quiz");
const quizTitle = document.querySelector("#quiz-title");
const quizInfo = document.querySelector("#quiz-info");
const quizPlay = document.querySelector("#quiz-play");
const quizNumber = document.querySelector("#quiz-number");
const quizScore = document.querySelector("#quiz-score");
const quizType = document.querySelector("#quiz-type");
const quizQuestion = document.querySelector("#quiz-question");
const quizForm = document.querySelector("#quiz-form");
const quizAnswer = document.querySelector("#quiz-answer");
const quizCheck = document.querySelector("#quiz-check");
const quizFeedback = document.querySelector("#quiz-feedback");
const quizNext = document.querySelector("#quiz-next");
const quizResult = document.querySelector("#quiz-result");
const resultScore = document.querySelector("#result-score");
const resultBack = document.querySelector("#result-back");
const quizHint = document.querySelector("#quiz-hint");
const quizHintButton = document.querySelector("#quiz-hint-button");
const quizSkip = document.querySelector("#quiz-skip");
const quizQuit = document.querySelector("#quiz-quit");
const quizQuitBox = document.querySelector("#quiz-quit-box");
const quitCancel = document.querySelector("#quit-cancel");
const quitConfirm = document.querySelector("#quit-confirm");
const wrongBox = document.querySelector("#wrong-box");
const wrongList = document.querySelector("#wrong-list");
const wrongEmpty = document.querySelector("#wrong-empty");
const retryWrong = document.querySelector("#retry-wrong");
const retryAll = document.querySelector("#retry-all");

let quizQuestions = [];
let quizIndex = 0;
let correctCount = 0;
let tryCount = 0;
let isAnswered = false;
let hintCount = 0;
let skipCount = 0;
let wrongQuestions = [];

// 설정한 학습 단어 수와 문장 옵션으로 문제 목록을 생성
function makeQuizQuestions() {
    const questions = [];
    const wordCount = Number(formData.wordCount);

    // 단어 순서를 랜덤으로 출제
    const mixedWords = wordList.slice().sort(() => Math.random() - 0.5);

    for (let i = 0; i < wordCount; i++) {
        questions.push({
            type: "단어",
            korean: mixedWords[i].korean,
            english: mixedWords[i].english
        });
    }

    if (formData.sentence) {
        const sentenceCount = Number(formData.sentenceCount);

        for (let i = 0; i < sentenceCount; i++) {
            questions.push({
                type: "문장",
                korean: sentenceList[i].korean,
                english: sentenceList[i].english
            });
        }
    }

    return questions;
}

// 대소문자, 문장부호, 2칸 이상 띄어쓰기는 채점에서 제외
function normalizeAnswer(text) {
    let result = text.trim().toLowerCase();
    result = result.replaceAll(".", "");
    result = result.replaceAll(",", "");
    result = result.replaceAll("?", "");
    result = result.replaceAll("!", "");

    while (result.includes("  ")) {
        result = result.replaceAll("  ", " ");
    }

    return result.trim();
}

// 입력값에 한글이 섞여 있는지 확인
function hasKorean(text) {
    for (let i = 0; i < text.length; i++) {
        const letter = text[i];

        if ((letter >= "가" && letter <= "힣") || (letter >= "ㄱ" && letter <= "ㅣ")) {
            return true;
        }
    }

    return false;
}

function showQuizFeedback(message, state) {
    quizFeedback.textContent = message;
    quizFeedback.classList.remove("is-error", "is-success", "is-skip");

    if (state !== "") {
        quizFeedback.classList.add(state);
    }
}

function showQuestion() {
    const question = quizQuestions[quizIndex];

    quizNumber.textContent = "문제 " + (quizIndex + 1) + " / " + quizQuestions.length;
    quizScore.textContent = "맞힌 문제 " + correctCount + "개";
    quizType.textContent = question.type;
    quizQuestion.textContent = question.korean;

    quizAnswer.value = "";
    quizAnswer.disabled = false;
    quizAnswer.classList.remove("has-error");
    quizAnswer.placeholder = question.type === "단어" ? "영어 단어를 입력하세요" : "영어 문장을 입력하세요";
    quizCheck.disabled = false;
    quizNext.hidden = true;
    quizHint.hidden = true;
    quizHint.textContent = "";
    quizHintButton.disabled = false;
    quizSkip.disabled = false;
    showQuizFeedback("", "");

    tryCount = 0;
    isAnswered = false;
    quizAnswer.focus();
}

// 한 문제가 끝나면 입력을 막고 다음 문제 버튼을 노출
function finishQuestion() {
    isAnswered = true;
    quizAnswer.disabled = true;
    quizCheck.disabled = true;
    quizHintButton.disabled = true;
    quizSkip.disabled = true;
    quizScore.textContent = "맞힌 문제 " + correctCount + "개";

    if (quizIndex === quizQuestions.length - 1) {
        quizNext.textContent = "결과 보기";
    } else {
        quizNext.textContent = "다음 문제";
    }

    quizNext.hidden = false;
    quizNext.focus();
}

function handleQuizSubmit(event) {
    event.preventDefault();

    if (isAnswered) return;

    const question = quizQuestions[quizIndex];
    const userAnswer = normalizeAnswer(quizAnswer.value);

    // 입력값이 비어 있는 경우
    if (userAnswer === "") {
        showQuizFeedback("답이 비어 있습니다. 한국어 뜻에 맞는 영어를 입력한 뒤 '정답 확인'을 눌러 주세요.", "is-error");
        quizAnswer.classList.add("has-error");
        quizAnswer.focus();
        return;
    }

    // 한글이 입력된 경우 (기회 차감 X)
    if (hasKorean(userAnswer)) {
        showQuizFeedback("한글이 입력되었습니다. 한/영 키를 눌러 영어로 바꾼 뒤 다시 입력해 주세요.", "is-error");
        quizAnswer.classList.add("has-error");
        quizAnswer.focus();
        return;
    }

    // 정답인 경우
    if (userAnswer === normalizeAnswer(question.english)) {
        correctCount += 1;
        quizAnswer.classList.remove("has-error");
        showQuizFeedback("정답입니다! 잘 입력했어요. (" + question.english + ")", "is-success");
        finishQuestion();
        return;
    }

    // 오답인 경우
    tryCount += 1;
    quizAnswer.classList.add("has-error");

    if (tryCount < maxTry) {
        showQuizFeedback("정답이 아닙니다. 철자를 확인하고 다시 입력해 주세요. (남은 기회 " + (maxTry - tryCount) + "번)", "is-error");
        quizAnswer.focus();
        return;
    }

    wrongQuestions.push(question);
    showQuizFeedback("기회를 모두 사용했습니다. 정답은 '" + question.english + "'입니다. 아래 버튼을 눌러 계속하세요.", "is-error");
    finishQuestion();
}

quizForm.addEventListener("submit", handleQuizSubmit);

function showResult() {
    quizPlay.hidden = true;
    quizResult.hidden = false;
    resultScore.textContent = formData.nickname + "님은 " + quizQuestions.length + "문제 중 " + correctCount + "문제를 맞혔습니다. (힌트 사용 " + hintCount + "번, 건너뛴 문제 " + skipCount + "개)";

    // 이전 결과 목록을 비우고 이번에 틀린 문제로 다시 생성
    wrongList.innerHTML = "";

    // 틀린 문제가 없는 경우: 목록 대신 안내 문구 노출
    if (wrongQuestions.length === 0) {
        wrongBox.hidden = true;
        wrongEmpty.hidden = false;
        retryWrong.hidden = true;
        retryAll.focus();
        return;
    }

    for (let i = 0; i < wrongQuestions.length; i++) {
        const item = document.createElement("li");
        item.textContent = "[" + wrongQuestions[i].type + "] " + wrongQuestions[i].korean + " → " + wrongQuestions[i].english;
        wrongList.appendChild(item);
    }

    wrongBox.hidden = false;
    wrongEmpty.hidden = true;
    retryWrong.hidden = false;
    retryWrong.textContent = "틀린 문제 " + wrongQuestions.length + "개만 다시 풀기";
    retryWrong.focus();
}

quizNext.addEventListener("click", () => {
    quizIndex += 1;

    if (quizIndex < quizQuestions.length) {
        showQuestion();
    } else {
        showResult();
    }
});

// 문제 목록과 안내 문구를 받아 학습 화면을 처음 상태로 열기
function openQuiz(questions, infoText) {
    quizQuestions = questions;
    quizIndex = 0;
    correctCount = 0;
    hintCount = 0;
    skipCount = 0;
    wrongQuestions = [];

    quizTitle.textContent = formData.nickname + "님의 오늘의 단어 학습";
    quizInfo.textContent = infoText;

    trainingFlow.hidden = true;
    wordQuiz.hidden = false;
    quizPlay.hidden = false;
    quizResult.hidden = true;
    quizQuitBox.hidden = true;
    wordQuiz.scrollIntoView({ behavior: "smooth" });
    showQuestion();
}

function startQuiz() {
    let infoText = "설정에 맞춰 단어 " + formData.wordCount + "개";

    if (formData.sentence) {
        infoText += "와 문장 " + formData.sentenceCount + "개";
    }

    infoText += "를 준비했습니다.";

    openQuiz(makeQuizQuestions(), infoText);
}

quizStart.addEventListener("click", startQuiz);

// 학습 화면을 닫고 설정 완료 화면으로 이동 (설정값 유지)
function backToSettings() {
    wordQuiz.hidden = true;
    trainingFlow.hidden = false;
    showStep(3);
    trainingFlow.scrollIntoView({ behavior: "smooth" });
    quizStart.focus();
}

resultBack.addEventListener("click", backToSettings);

// 힌트 보기: 단어는 첫 글자와 글자 수, 문장은 첫 단어와 단어 수를 노출
quizHintButton.addEventListener("click", () => {
    if (isAnswered) return;

    const question = quizQuestions[quizIndex];

    if (question.type === "단어") {
        quizHint.textContent = "힌트: 첫 글자는 '" + question.english[0] + "'이고, 모두 " + question.english.length + "글자입니다.";
    } else {
        const words = question.english.split(" ");
        quizHint.textContent = "힌트: 첫 단어는 '" + words[0] + "'이고, 모두 " + words.length + "단어입니다.";
    }

    hintCount += 1;
    quizHint.hidden = false;
    quizHintButton.disabled = true;
    quizAnswer.focus();
});

// 건너뛰기: 정답을 보여 주고 틀린 문제로 처리
quizSkip.addEventListener("click", () => {
    if (isAnswered) return;

    const question = quizQuestions[quizIndex];

    skipCount += 1;
    wrongQuestions.push(question);
    quizAnswer.classList.remove("has-error");
    showQuizFeedback("이 문제를 건너뛰었습니다. 정답은 '" + question.english + "'입니다. 아래 버튼을 눌러 계속하세요.", "is-skip");
    finishQuestion();
});

// 그만두기: 바로 종료하지 않고 확인 창 노출
quizQuit.addEventListener("click", () => {
    quizPlay.hidden = true;
    quizQuitBox.hidden = false;
    quitCancel.focus();
});

// 계속 학습하기: 입력하던 답과 진행 상황 유지
quitCancel.addEventListener("click", () => {
    quizQuitBox.hidden = true;
    quizPlay.hidden = false;

    if (isAnswered) {
        quizNext.focus();
    } else {
        quizAnswer.focus();
    }
});

// 그만두고 돌아가기: 이번 학습 상태를 초기화하고 설정 완료 화면으로 이동
quitConfirm.addEventListener("click", () => {
    resetQuiz();
    backToSettings();
});

// 학습 상태를 모두 초기화하고 학습 화면 숨김 (다시 설정하기, 그만두기 등에서 사용)
function resetQuiz() {
    quizQuestions = [];
    quizIndex = 0;
    correctCount = 0;
    tryCount = 0;
    hintCount = 0;
    skipCount = 0;
    wrongQuestions = [];
    isAnswered = false;
    quizAnswer.value = "";
    wrongList.innerHTML = "";
    quizQuitBox.hidden = true;
    quizResult.hidden = true;
    wordQuiz.hidden = true;
}

// 틀린 문제만 다시 풀기: 이번 결과에서 틀린 문제로만 새 학습 시작
retryWrong.addEventListener("click", () => {
    if (wrongQuestions.length === 0) return;

    const retryQuestions = wrongQuestions.slice();
    openQuiz(retryQuestions, "틀린 문제 " + retryQuestions.length + "개를 다시 풀어 봅니다. 이번에는 꼭 맞혀 보세요!");
});

// 처음부터 다시 풀기: 같은 설정으로 새 단어를 섞어서 다시 시작
retryAll.addEventListener("click", startQuiz);

// ===== 원어민 화상수업 예약 폼 =====
const reserveForm = document.querySelector("#reserve-form");
const reserveName = document.querySelector("#reserve-name");
const reserveNameCount = document.querySelector("#reserve-name-count");
const reserveNameError = document.querySelector("#reserve-name-error");
const reserveDate = document.querySelector("#reserve-date");
const reserveDateError = document.querySelector("#reserve-date-error");
const reserveTime = document.querySelector("#reserve-time");
const reserveTimeError = document.querySelector("#reserve-time-error");
const reserveMessage = document.querySelector("#reserve-message");
const reserveMessageCount = document.querySelector("#reserve-message-count");
const reserveMessageError = document.querySelector("#reserve-message-error");
const feedbackCheck = document.querySelector("#feedback-check");
const feedbackArea = document.querySelector("#feedback-area");
const feedbackEmail = document.querySelector("#feedback-email");
const feedbackEmailError = document.querySelector("#feedback-email-error");
const reserveStatus = document.querySelector("#reserve-status");
const reserveSubmit = document.querySelector("#reserve-submit");
const reserveReset = document.querySelector("#reserve-reset");
const reserveList = document.querySelector("#reserve-list");
const reserveEmpty = document.querySelector("#reserve-empty");
const reserveCount = document.querySelector("#reserve-count");
const filterButtons = document.querySelectorAll(".filter-button");
let currentTopic = "전체";

const messageMinLength = 10;
let isReserving = false;

function showFieldError(input, errorBox, message) {
    errorBox.textContent = message;
    input.classList.add("has-error");
    input.setAttribute("aria-invalid", "true");
}

function clearFieldError(input, errorBox) {
    errorBox.textContent = "";
    input.classList.remove("has-error");
    input.removeAttribute("aria-invalid");
}

function showReserveStatus(message, state) {
    reserveStatus.textContent = message;
    reserveStatus.classList.remove("is-error", "is-success", "is-loading");

    if (state !== "") {
        reserveStatus.classList.add(state);
    }
}

// 오늘 날짜를 "YYYY-MM-DD" 형태로 만들기
function getToday() {
    const now = new Date();
    let month = now.getMonth() + 1;
    let day = now.getDate();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    return now.getFullYear() + "-" + month + "-" + day;
}

reserveDate.min = getToday();

function validateReserveName() {
    const value = reserveName.value.trim();

    if (value === "") {
        showFieldError(reserveName, reserveNameError, "오류: 이름이 비어 있습니다. 예약자 이름을 입력해 주세요.");
        return false;
    }

    if (value.length < 2) {
        showFieldError(reserveName, reserveNameError, "오류: 이름이 너무 짧습니다. 2자 이상 입력해 주세요.");
        return false;
    }

    clearFieldError(reserveName, reserveNameError);
    return true;
}

function validateReserveDate() {
    if (reserveDate.value === "") {
        showFieldError(reserveDate, reserveDateError, "오류: 수업 날짜를 선택해 주세요.");
        return false;
    }

    if (reserveDate.value < getToday()) {
        showFieldError(reserveDate, reserveDateError, "오류: 지난 날짜는 예약할 수 없습니다. 오늘 이후의 날짜를 선택해 주세요.");
        return false;
    }

    clearFieldError(reserveDate, reserveDateError);
    return true;
}

function validateReserveTime() {
    if (reserveTime.value === "") {
        showFieldError(reserveTime, reserveTimeError, "오류: 수업 시간을 선택해 주세요.");
        return false;
    }

    clearFieldError(reserveTime, reserveTimeError);
    return true;
}

function validateReserveMessage() {
    const length = reserveMessage.value.trim().length;

    if (length < messageMinLength) {
        showFieldError(reserveMessage, reserveMessageError, "오류: 선생님께 전할 말을 " + messageMinLength + "자 이상 적어 주세요. (" + (messageMinLength - length) + "자 더 필요)");
        return false;
    }

    clearFieldError(reserveMessage, reserveMessageError);
    return true;
}

// 피드백 받기를 선택하지 않았으면 검사하지 않음
function validateFeedbackEmail() {
    if (!feedbackCheck.checked) return true;

    const value = feedbackEmail.value.trim();

    if (value === "") {
        showFieldError(feedbackEmail, feedbackEmailError, "오류: 피드백 받을 이메일을 입력해 주세요.");
        return false;
    }

    if (!value.includes("@") || !value.includes(".")) {
        showFieldError(feedbackEmail, feedbackEmailError, "오류: 이메일 형식이 아닙니다. name@example.com 처럼 입력해 주세요.");
        return false;
    }

    clearFieldError(feedbackEmail, feedbackEmailError);
    return true;
}

// 입력하는 동안 글자 수와 조건 충족 여부를 문구로 표시
function updateNameCount() {
    reserveNameCount.textContent = reserveName.value.length + " / 10자";
}

function updateMessageCount() {
    const length = reserveMessage.value.trim().length;

    if (length >= messageMinLength) {
        reserveMessageCount.textContent = reserveMessage.value.length + " / 200자 (조건 충족)";
        reserveMessageCount.classList.add("is-ok");
    } else {
        reserveMessageCount.textContent = reserveMessage.value.length + " / 200자 (" + (messageMinLength - length) + "자 더 필요)";
        reserveMessageCount.classList.remove("is-ok");
    }
}

// 오류가 표시된 칸은 입력할 때마다 다시 검사해서 고치면 바로 오류 해제
reserveName.addEventListener("input", () => {
    updateNameCount();
    if (reserveName.classList.contains("has-error")) validateReserveName();
});

reserveMessage.addEventListener("input", () => {
    updateMessageCount();
    if (reserveMessage.classList.contains("has-error")) validateReserveMessage();
});

feedbackEmail.addEventListener("input", () => {
    if (feedbackEmail.classList.contains("has-error")) validateFeedbackEmail();
});

reserveDate.addEventListener("change", validateReserveDate);
reserveTime.addEventListener("change", validateReserveTime);

// 체크하면 이메일 칸을 보여 주고 사용 가능, 해제하면 숨기고 disabled
feedbackCheck.addEventListener("change", () => {
    const checked = feedbackCheck.checked;

    feedbackArea.hidden = !checked;
    feedbackEmail.disabled = !checked;
    feedbackCheck.setAttribute("aria-expanded", checked ? "true" : "false");

    if (checked) {
        feedbackEmail.focus();
    } else {
        feedbackEmail.value = "";
        clearFieldError(feedbackEmail, feedbackEmailError);
    }
});

// localStorage에 저장된 예약 목록 불러오기
function loadReservations() {
    const saved = localStorage.getItem("reservations");

    if (saved === null) return [];
    return JSON.parse(saved);
}

// 선택한 주제에 맞는 예약만 목록에 표시
function renderReservations() {
    const reservations = loadReservations();
    let shownCount = 0;
    reserveList.innerHTML = "";

    for (let i = 0; i < reservations.length; i++) {
        const r = reservations[i];

        if (currentTopic === "전체" || r.topic === currentTopic) {
            const item = document.createElement("li");
            item.textContent = r.date + " " + r.time + " · " + r.topic + " · " + r.name + "님";
            reserveList.appendChild(item);
            shownCount += 1;
        }
    }

    if (currentTopic === "전체") {
        reserveCount.textContent = "전체 예약 " + reservations.length + "개를 보여 주고 있습니다.";
    } else {
        reserveCount.textContent = "'" + currentTopic + "' 수업 " + shownCount + "개를 보여 주고 있습니다. (전체 " + reservations.length + "개)";
    }

    // 예약이 아예 없는 경우와 선택한 주제의 예약만 없는 경우를 나눠서 안내
    if (reservations.length === 0) {
        reserveEmpty.textContent = "아직 예약한 수업이 없습니다. 메뉴의 '화상수업 예약'에서 첫 수업을 예약해 보세요.";
    } else if (shownCount === 0) {
        reserveEmpty.textContent = "'" + currentTopic + "' 주제로 예약한 수업이 없습니다. 다른 주제를 고르거나 '전체'를 눌러 보세요.";
    }

    reserveList.hidden = shownCount === 0;
    reserveEmpty.hidden = shownCount > 0;
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        currentTopic = button.dataset.topic;

        filterButtons.forEach((other) => {
            other.setAttribute("aria-pressed", other === button ? "true" : "false");
        });

        renderReservations();
    });
});

function finishReserving() {
    isReserving = false;
    reserveSubmit.disabled = false;
    reserveReset.disabled = false;
    reserveSubmit.textContent = "예약 신청하기";
}

function saveReservation() {
    const topic = reserveForm.querySelector("input[name=topic]:checked").value;
    const newReservation = {
        name: reserveName.value.trim(),
        date: reserveDate.value,
        time: reserveTime.value,
        topic: topic,
        message: reserveMessage.value.trim(),
        feedbackEmail: feedbackCheck.checked ? feedbackEmail.value.trim() : ""
    };

    try {
        const reservations = loadReservations();

        // 같은 날짜와 시간에 이미 예약이 있으면 저장하지 않음
        for (let i = 0; i < reservations.length; i++) {
            if (reservations[i].date === newReservation.date && reservations[i].time === newReservation.time) {
                finishReserving();
                showFieldError(reserveTime, reserveTimeError, "오류: 이 시간은 이미 예약되어 있습니다. 다른 시간이나 날짜를 선택해 주세요.");
                showReserveStatus("예약에 실패했습니다. " + newReservation.date + " " + newReservation.time + "은(는) 이미 예약된 시간입니다. 시간을 바꾼 뒤 다시 신청해 주세요.", "is-error");
                reserveTime.focus();
                return;
            }
        }

        reservations.push(newReservation);
        localStorage.setItem("reservations", JSON.stringify(reservations));
    } catch (error) {
        // 브라우저 저장소를 사용할 수 없는 경우
        finishReserving();
        showReserveStatus("예약에 실패했습니다. 브라우저 저장 공간을 사용할 수 없습니다. 입력 내용은 그대로 있으니 잠시 후 다시 신청해 주세요.", "is-error");
        reserveSubmit.focus();
        return;
    }

    finishReserving();
    reserveForm.reset();
    renderReservations();
    showReserveStatus("예약이 완료되었습니다! " + newReservation.name + "님, " + newReservation.date + " " + newReservation.time + "에 '" + newReservation.topic + "' 수업에서 만나요. '나의 예약 내역'에서 확인할 수 있습니다.", "is-success");
}

function handleReserveSubmit(event) {
    event.preventDefault();

    // 제출 중에는 다시 제출되지 않게 막기
    if (isReserving) return;

    // 모든 항목을 검사하고 틀린 항목 이름을 모으기
    const wrongFields = [];
    if (!validateReserveName()) wrongFields.push("예약자 이름");
    if (!validateReserveDate()) wrongFields.push("수업 날짜");
    if (!validateReserveTime()) wrongFields.push("수업 시간");
    if (!validateReserveMessage()) wrongFields.push("선생님께 전할 말");
    if (!validateFeedbackEmail()) wrongFields.push("피드백 받을 이메일");

    if (wrongFields.length > 0) {
        showReserveStatus("제출할 수 없습니다. 수정이 필요한 항목: " + wrongFields.join(", ") + " (각 항목 아래 안내를 확인해 주세요.)", "is-error");
        reserveForm.querySelector(".has-error").focus();
        return;
    }

    isReserving = true;
    reserveSubmit.disabled = true;
    reserveReset.disabled = true;
    reserveSubmit.textContent = "예약하는 중...";
    showReserveStatus("예약을 신청하고 있습니다. 잠시만 기다려 주세요.", "is-loading");

    // 1초 뒤 브라우저에 저장
    setTimeout(saveReservation, 1000);
}

reserveForm.addEventListener("submit", handleReserveSubmit);

// 입력값과 함께 오류 문구, 글자 수, 조건부 영역, 버튼 상태도 처음으로
reserveForm.addEventListener("reset", () => {
    clearFieldError(reserveName, reserveNameError);
    clearFieldError(reserveDate, reserveDateError);
    clearFieldError(reserveTime, reserveTimeError);
    clearFieldError(reserveMessage, reserveMessageError);
    clearFieldError(feedbackEmail, feedbackEmailError);

    reserveNameCount.textContent = "0 / 10자";
    reserveMessageCount.textContent = "0 / 200자 (10자 이상 필요)";
    reserveMessageCount.classList.remove("is-ok");

    feedbackArea.hidden = true;
    feedbackEmail.disabled = true;
    feedbackCheck.setAttribute("aria-expanded", "false");

    showReserveStatus("", "");
    finishReserving();
});

renderReservations();

// ===== 주요 메뉴 =====
const menuToggle = document.querySelector("#menu-toggle");
const mainMenu = document.querySelector("#main-menu");
const menuLinks = document.querySelectorAll("#main-menu a");

// 주소의 #값과 같은 메뉴에만 aria-current 표시 (주소에 #이 없으면 서비스 소개)
function updateCurrentMenu() {
    let currentHash = location.hash;
    if (currentHash === "") currentHash = "#about";

    menuLinks.forEach((link) => {
        if (link.getAttribute("href") === currentHash) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

// 메뉴 이동, 뒤로 가기, 앞으로 가기 모두 hashchange가 발생
window.addEventListener("hashchange", updateCurrentMenu);
updateCurrentMenu();

// 모바일 메뉴: 표시 상태, 버튼 문구, aria-expanded를 함께 변경
function setMenuOpen(isOpen) {
    if (isOpen) {
        mainMenu.classList.add("is-open");
    } else {
        mainMenu.classList.remove("is-open");
    }

    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    menuToggle.textContent = isOpen ? "메뉴 닫기" : "메뉴 열기";
}

menuToggle.addEventListener("click", () => {
    setMenuOpen(!mainMenu.classList.contains("is-open"));
});

// 목적지를 고르면 메뉴 닫기
menuLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
});
