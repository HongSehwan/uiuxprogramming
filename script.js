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
const nicknameNext = document.querySelector("#nickname-next");
const durationRange = document.querySelector("#duration-range");
const durationValue = document.querySelector("#duration-value");
const sentenceOption = document.querySelector("#sentence-option");
const sentenceOptions = document.querySelector("#sentence-options");
const optionPrev = document.querySelector("#option-prev");
const optionNext = document.querySelector("#option-next");
const summaryPrev = document.querySelector("#summary-prev");
const finishButton = document.querySelector("#finish-button");
const restartButton = document.querySelector("#restart-button");
const summaryNickname = document.querySelector("#summary-nickname");
const summaryDuration = document.querySelector("#summary-duration");
const summarySentence = document.querySelector("#summary-sentence");
const durationValues = ["3", "5", "10"];

const formData = {
    nickname: "", duration: "5", sentence: false, sentenceCount: "2"
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
    trainingFlow.hidden = false;
    showStep(0);
    trainingFlow.scrollIntoView({ behavior: "smooth" });
    nicknameInput.focus();
});

function validateNickname() {
    const value = nicknameInput.value.trim();
    if (!value) {
        nicknameError.textContent = "닉네임을 입력해 주세요.";
        nicknameInput.classList.add("has-error");
        nicknameInput.focus();
        return false;
    }

    nicknameError.textContent = "";
    nicknameInput.classList.remove("has-error");
    formData.nickname = value;
    return true;
}

nicknameNext.addEventListener("click", () => {
    if (!validateNickname()) return;
    showStep(1);
});

durationRange.addEventListener("input", () => {
    durationValue.value = durationValues[durationRange.value] + "분";
});

sentenceOption.addEventListener("change", () => {
   sentenceOptions.hidden =! sentenceOption.checked;
});

optionPrev.addEventListener("click", () => showStep(0));
optionNext.addEventListener("click", () => {
    formData.duration = durationValues[durationRange.value];
    formData.sentence = sentenceOption.checked;
    const count = document.querySelector("input[name=sentence-count]:checked");
    formData.sentenceCount = count.value;
    summaryNickname.textContent = formData.nickname;
    summaryDuration.textContent = formData.duration + "분";
    summarySentence.textContent = formData.sentence ? formData.sentenceCount + "개 포함" : "미포함";
    showStep(2);
});

summaryPrev.addEventListener("click", () => showStep(1));
finishButton.addEventListener("click", () => showStep(3));
restartButton.addEventListener("click", () => {
    formData.nickname = "";
    formData.duration = "5";
    formData.sentence = false;
    formData.sentenceCount = "2";
    nicknameInput.value = "";
    nicknameError.textContent = "";
    nicknameInput.classList.remove("has-error");
    durationRange.value = "1";
    durationValue.value = "5분";
    sentenceOption.checked = false;
    sentenceOptions.hidden = true;
    document.querySelector("input[name=sentence-count][value='2']").checked = true;
    summaryNickname.textContent = "";
    summaryDuration.textContent = "";
    summarySentence.textContent = "";
    showStep(0);
});

// 학습 설정을 마친 학습자가 설정한 시간과 문장 옵션에 맞춰 한국어 뜻을 보고 영어 단어와 문장을 직접 입력하며 학습 진행
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

// 학습 시간에 따라 출제할 단어 수
const wordCountByDuration = { "3": 3, "5": 5, "10": 8 };

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

let quizQuestions = [];
let quizIndex = 0;
let correctCount = 0;
let tryCount = 0;
let isAnswered = false;
let hintCount = 0;
let skipCount = 0;

// 설정한 학습 시간과 문장 옵션으로 문제 목록을 생성
function makeQuizQuestions() {
    const questions = [];
    const wordCount = wordCountByDuration[formData.duration];

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

    showQuizFeedback("기회를 모두 사용했습니다. 정답은 '" + question.english + "'입니다. 아래 버튼을 눌러 계속하세요.", "is-error");
    finishQuestion();
}

quizForm.addEventListener("submit", handleQuizSubmit);

function showResult() {
    quizPlay.hidden = true;
    quizResult.hidden = false;
    resultScore.textContent = formData.nickname + "님은 " + quizQuestions.length + "문제 중 " + correctCount + "문제를 맞혔습니다. (힌트 사용 " + hintCount + "번, 건너뛴 문제 " + skipCount + "개)";
    resultBack.focus();
}

quizNext.addEventListener("click", () => {
    quizIndex += 1;

    if (quizIndex < quizQuestions.length) {
        showQuestion();
    } else {
        showResult();
    }
});

function startQuiz() {
    quizQuestions = makeQuizQuestions();
    quizIndex = 0;
    correctCount = 0;
    hintCount = 0;
    skipCount = 0;

    const wordCount = wordCountByDuration[formData.duration];
    let infoText = "학습 시간 " + formData.duration + "분 설정에 맞춰 단어 " + wordCount + "개";

    if (formData.sentence) {
        infoText += "와 문장 " + formData.sentenceCount + "개";
    }

    infoText += "를 준비했습니다.";

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
    quizQuestions = [];
    quizIndex = 0;
    correctCount = 0;
    tryCount = 0;
    hintCount = 0;
    skipCount = 0;
    isAnswered = false;
    quizAnswer.value = "";
    quizQuitBox.hidden = true;
    backToSettings();
});
