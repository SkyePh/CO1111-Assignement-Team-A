//read the params sent from listChallenges
const params = new URLSearchParams(window.location.search);
const currentHuntId = params.get("uuid");
const currentHuntName = params.get("name");
let currentSession = null;
let answerBox =document.getElementById("answerBox");
const questionBox = document.getElementById("questionBox");
let userAnswer = null;
let title = document.getElementById("title");
let locationIntervalId = null;

const APP_NAME = "co1111-team-a";
const form = document.getElementById("startForm");
const nameInput = document.getElementById("playerName");
const scoreValue = document.getElementById("scoreValue");

title.textContent = currentHuntName;

//qr scanner settings
let qrOpts = {
    continuous: true,
    video: document.getElementById('qrPreview'),
    mirror: true,
    captureImage: false,
    backgroundScan: true,
    refractoryPeriod: 5000,
    scanPeriod: 1
};

//qr scanner
var scanner = new Instascan.Scanner(qrOpts);
let qrScannerActive = false;
const qrToggleBtn = document.getElementById('qrToggleBtn');
const qrPreviewWrapper = document.getElementById('qrPreviewWrapper');
const qrSection = document.getElementById('qrSection');

qrPreviewWrapper.style.display = 'none';
if (qrSection) qrSection.style.display = 'none';

scanner.addListener('scan', function (content) {
    console.log(content);
    let contentEl = document.getElementById("qrContent");
    if (contentEl) {
        contentEl.innerHTML = content;
        contentEl.classList.remove('qr-placeholder');
    }
});

function toggleQrScanner() {
    if (qrScannerActive) {
        scanner.stop();
        qrPreviewWrapper.style.display = 'none';
        qrScannerActive = false;
        qrToggleBtn.textContent = 'Scan QR Code';
    } else {
        Instascan.Camera.getCameras().then(function (cameras) {
            if (cameras.length > 0) {
                scanner.start(cameras[0]);
                qrPreviewWrapper.style.display = 'flex';
                qrScannerActive = true;
                qrToggleBtn.textContent = 'Close QR scanner';
            } else {
                console.error('No cameras found.');
                alert('No cameras found.');
            }
        }).catch(function (e) {
            console.error(e);
        });
    }
}

if (qrToggleBtn) qrToggleBtn.addEventListener('click', toggleQrScanner);

function submitAnswer(answer) {
    fetch(
        "https://codecyprus.org/th/api/answer" +
        "?session=" + currentSession +
        "&answer=" + encodeURIComponent(answer)
    )
        .then(r => r.json())
        .then(a => {
            console.log("ANSWER RESPONSE:", a);

            // if accept
            if (a.status === "OK") {
                getScore();
                loadQuestion();
            }
        })
        .catch(err => { console.error("API error (answer):", err); showTemporaryError("Network error. Try again."); });
}

function loadQuestion() {
    fetch(
        "https://codecyprus.org/th/api/question?session=" + currentSession
    )
        .then(r => r.json())
        .then(q => {
            console.log("QUESTION:", q);
            questionBox.innerHTML = q.questionText;
            const questionType = q.questionType;

            if (q.completed === true)
            {
                questionBox.innerHTML = "Session completed";
                answerBox.innerHTML = "";
                stopLocationTracking();
                if (qrSection) qrSection.style.display = "none";
                if (qrScannerActive) toggleQrScanner();

                const lbBtn = document.createElement("button");
                lbBtn.textContent = "Check Leaderboard";
                lbBtn.type = "button";
                lbBtn.className = "leaderboard-button";

                lbBtn.addEventListener("click", () =>
                { window.location.href =
                    "leaderboard.html?session=" +
                    encodeURIComponent(currentSession) +
                    "&player=" +
                    encodeURIComponent(nameInput.value); });

                answerBox.appendChild(lbBtn);

                return;
            }

            answerBox.innerHTML = "";

            const label = document.createElement("label");
            label.textContent = "Your answer:";

            let input = document.createElement("input");
            let inputContainer;

            switch (questionType) {
                case "BOOLEAN":
                    input = document.createElement("input");
                    input.type = "hidden";
                    input.className = "hidden-input";

                    inputContainer = document.createElement("div");
                    inputContainer.className = "radio-group";

                    //true option
                    let trueDiv = document.createElement("div");
                    trueDiv.className = "radio-button";

                    let trueChoice = document.createElement("input");
                    trueChoice.type = "radio";
                    trueChoice.name = "bool";
                    trueChoice.value = "true";
                    trueChoice.id = "bool-true";

                    let trueLabel = document.createElement("label");
                    trueLabel.htmlFor = "bool-true";
                    trueLabel.textContent = "True";

                    trueChoice.onchange = function () { input.value = "true"; };

                    trueDiv.appendChild(trueChoice);
                    trueDiv.appendChild(trueLabel);

                    //false option
                    let falseDiv = document.createElement("div");
                    falseDiv.className = "radio-button";

                    let falseChoice = document.createElement("input");
                    falseChoice.type = "radio";
                    falseChoice.name = "bool";
                    falseChoice.value = "false";
                    falseChoice.id = "bool-false";

                    let falseLabel = document.createElement("label");
                    falseLabel.htmlFor = "bool-false";
                    falseLabel.textContent = "False";

                    falseChoice.onchange = function () { input.value = "false"; };

                    falseDiv.appendChild(falseChoice);
                    falseDiv.appendChild(falseLabel);

                    inputContainer.appendChild(trueDiv);
                    inputContainer.appendChild(falseDiv);
                    inputContainer.appendChild(input);
                    break;

                case "INTEGER":
                    input = document.createElement("input");
                    input.type = "number";
                    input.step = "1";
                    input.className = "styled-input";
                    input.placeholder = "Enter a whole number...";
                    inputContainer = input;
                    break;

                case "NUMERIC":
                    input = document.createElement("input");
                    input.type = "number";
                    input.step = "any";
                    input.className = "styled-input";
                    input.placeholder = "Enter a number...";
                    inputContainer = input;
                    break;

                case "MCQ":
                    input = document.createElement("input");
                    input.type = "hidden";
                    input.className = "hidden-input";

                    inputContainer = document.createElement("div");
                    inputContainer.className = "radio-grid-2x2";

                    ["A", "B", "C", "D"].forEach(function (letter, i) {
                        let radioDiv = document.createElement("div");
                        radioDiv.className = "radio-button";

                        let radio = document.createElement("input");
                        radio.type = "radio";
                        radio.name = "mcq";
                        radio.value = letter;
                        radio.id = "mcq-" + letter;

                        let radioLabel = document.createElement("label");
                        radioLabel.htmlFor = "mcq-" + letter;
                        radioLabel.textContent = "Option " + letter;

                        radio.onchange = function () { input.value = letter; };

                        radioDiv.appendChild(radio);
                        radioDiv.appendChild(radioLabel);
                        inputContainer.appendChild(radioDiv);
                    });
                    inputContainer.appendChild(input);
                    break;

                case "TEXT":
                default:
                    input = document.createElement("input");
                    input.type = "text";
                    input.className = "styled-input";
                    input.placeholder = "Type your answer...";
                    inputContainer = input;
                    break;
            }

            if (input.required !== undefined) input.required = true;

            const buttonGroup = document.createElement("div");
            buttonGroup.className = "button-group";

            const submitBtn = document.createElement("button");
            submitBtn.textContent = "Submit";
            submitBtn.type = "button";
            submitBtn.className = "primary-button";

            submitBtn.addEventListener("click", function () {
                if (input.value) {
                    submitAnswer(input.value);
                } else {
                    //get value from hidden input if it a radiogroup
                    let hiddenInput = inputContainer.querySelector('input[type="hidden"]');
                    if (hiddenInput && hiddenInput.value) {
                        submitAnswer(hiddenInput.value);
                    } else {
                        showTemporaryError("Please select an answer");
                    }
                }
            });

            const skipBtn = document.createElement("button");
            skipBtn.textContent = "Skip";
            skipBtn.type = "button";
            skipBtn.className = "secondary-button";

            skipBtn.addEventListener("click", function () {
                skipQuestion();
            });

            buttonGroup.appendChild(submitBtn);
            buttonGroup.appendChild(skipBtn);

            answerBox.appendChild(label);
            answerBox.appendChild(inputContainer);
            answerBox.appendChild(buttonGroup);
        })
        .catch(err => {
            console.error("API error (question):", err);
            if (questionBox) questionBox.innerHTML = "Could not load question. Check connection.";
        });
}

function startError(errorText){
    questionBox.innerHTML = errorText;
}

function showTemporaryError(message) {
    const oldContent = questionBox.innerHTML;

    questionBox.innerHTML = message;

    setTimeout(function () {
        questionBox.innerHTML = oldContent;
    }, 2000);
}

function skipQuestion(){
    fetch(
        "https://codecyprus.org/th/api/skip?session=" + currentSession
    )
        .then(r => r.json())
        .then(b => {
            console.log("Skip:", b);
            if (b.status === "OK") {
                getScore();
                loadQuestion();
            }
            else
                showTemporaryError("Cannot skip this question.");
        })
        .catch(err => { console.error("API error (skip):", err); showTemporaryError("Network error. Try again."); });
}

function getScore() {
    if (!currentSession) return;
    fetch("https://codecyprus.org/th/api/score?session=" + currentSession)
        .then(r => r.json())
        .then(data => {
            if (data.status === "OK" && data.score !== undefined) {
                scoreValue.textContent = data.score;
            }
        })
        .catch(err => console.error("API error (score):", err));
}

function sendLocation(){
    if (!currentSession) {
        return;
    }

    if (!navigator.geolocation) {
        console.log("Geolocation not supported.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            fetch(
                "https://codecyprus.org/th/api/location" +
                "?session=" + currentSession +
                "&latitude=" + latitude +
                "&longitude=" + longitude
            )
                .then(r => r.json())
                .then(data => { console.log("LOCATION RESPONSE:", data); })
                .catch(err => console.error("API error (location):", err));
        },
        function (error) {
            console.log("Location error:", error.message);
        }
    );
}

function startLocationTracking() {
    if (locationIntervalId !== null) return;

    sendLocation();
    locationIntervalId = setInterval(sendLocation, 30000);
}

function stopLocationTracking() {
    if (locationIntervalId !== null) {
        clearInterval(locationIntervalId);
        locationIntervalId = null;
    }
}

form.addEventListener("submit", function (event) {
    event.preventDefault(); // stop reload of page

    const playerName = nameInput.value;

    fetch(
        "https://codecyprus.org/th/api/start" +
        "?player=" + playerName +
        "&app=" + APP_NAME +
        "&treasure-hunt-id=" + currentHuntId
    )
        .then(r2 => r2.json())
        .then(data => {
            currentSession = data.session;
            console.log("start response:", data);

            if (data.status === "ERROR") {
                startError(data.errorMessages[0]);
                return;
            }

            form.style.display = "none";
            if (qrSection) qrSection.style.display = "block";
            getScore();
            loadQuestion();
            startLocationTracking();
        })
        .catch(err => { console.error("API error (start):", err); startError("Cannot reach server. Use a web server (e.g. Live Server) and not file://."); });
});