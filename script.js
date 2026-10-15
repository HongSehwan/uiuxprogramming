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
    durationValues.value = "5분";
    sentenceOption.checked = false;
    sentenceOptions.hidden = true;
    document.querySelector("input[name=sentence-count][value='2']").checked = true;
    summaryNickname.textContent = "";
    summaryDuration.textContent = "";
    summarySentence.textContent = "";
    showStep(0);
});