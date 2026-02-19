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
        });
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
                stopLocationTracking()
                return;
            }

            answerBox.innerHTML = "";

            const label = document.createElement("label");
            label.textContent = "Your answer:";

            let input = document.createElement("input");
            switch (questionType) {

                case "BOOLEAN":
                    input = document.createElement("input");
                    input.type = "hidden";

                    inputContainer = document.createElement("div");

                    let trueChoice = document.createElement("input");
                    trueChoice.type = "radio";
                    trueChoice.name = "bool";
                    trueChoice.value = "true";

                    let falseChoice = document.createElement("input");
                    falseChoice.type = "radio";
                    falseChoice.name = "bool";
                    falseChoice.value = "false";

                    trueChoice.onchange = function () { input.value = "true"; };
                    falseChoice.onchange = function () { input.value = "false"; };

                    inputContainer.appendChild(trueChoice);
                    inputContainer.appendChild(document.createTextNode(" True "));
                    inputContainer.appendChild(falseChoice);
                    inputContainer.appendChild(document.createTextNode(" False"));
                    inputContainer.appendChild(input);
                    break;

                case "INTEGER":
                    input = document.createElement("input");
                    input.type = "number";
                    input.step = "1";
                    inputContainer = input;
                    break;

                case "NUMERIC":
                    input = document.createElement("input");
                    input.type = "number";
                    input.step = "any";
                    inputContainer = input;
                    break;

                case "MCQ":
                    input = document.createElement("input");
                    input.type = "hidden";

                    inputContainer = document.createElement("div");

                    ["A", "B", "C", "D"].forEach(function (letter, i) {

                        let radio = document.createElement("input");
                        radio.type = "radio";
                        radio.name = "mcq";
                        radio.value = letter;
                        radio.onchange = function () { input.value = letter; };
                        inputContainer.appendChild(radio);
                        inputContainer.appendChild(document.createTextNode(" " + letter + " "));
                    });
                    inputContainer.appendChild(input);
                    break;

                case "TEXT":
                    input = document.createElement("input");
                    input.type = "text";
                    inputContainer = input;
                    break;


                default:
                    inpt = document.createElement("input");
                    input.type = "text";
                    inputContainer = input;
                    break;
            }
            input.required = true;



            const submitBtn = document.createElement("button");
            submitBtn.textContent = "Submit";
            submitBtn.type = "button";

            submitBtn.addEventListener("click", function () {
                submitAnswer(input.value);
            });

            const skipBtn = document.createElement("button");
            skipBtn.textContent = "Skip";
            skipBtn.type = "button";

            skipBtn.addEventListener("click", function () {
                skipQuestion();
            });


            answerBox.appendChild(label);
            answerBox.appendChild(document.createElement("br"));
            answerBox.appendChild(inputContainer);
            answerBox.appendChild(document.createElement("br"));
            answerBox.appendChild(submitBtn);
            answerBox.appendChild(document.createElement("br"));
            answerBox.appendChild(skipBtn);


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
                loadQuestion()
            }
            else
                showTemporaryError("Cannot skip this question.");
        });
}

function getScore() {
    if (!currentSession) return;
    fetch("https://codecyprus.org/th/api/score?session=" + currentSession)
        .then(r => r.json())
        .then(data => {
            if (data.status === "OK" && data.score !== undefined) {
                scoreValue.textContent = data.score;
            }
        });
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
                .then(data => {
                    console.log("LOCATION RESPONSE:", data);
                });

        },
        function (error) {
            console.log("Location error:", error.message);
        }
    );

}

function startLocationTracking() {
    if (locationIntervalId !== null) return;

    sendLocation();
    locationIntervalId = setInterval(sendLocation, 30000); // каждые 30 сек
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
            getScore();
            loadQuestion();
            startLocationTracking();
        });
});