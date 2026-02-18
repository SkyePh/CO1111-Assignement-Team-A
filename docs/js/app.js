//read the params sent from listChallenges
const params = new URLSearchParams(window.location.search);
const currentHuntId = params.get("uuid");
const currentHuntName = params.get("name");
let currentSession = null;
let answerBox =document.getElementById("answerBox");
const questionBox = document.getElementById("questionBox");
let userAnswer = null;
let title = document.getElementById("title");

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
                    break;

                case "INTEGER":
                    input.type = "number";
                    input.step = "1";
                    break;

                case "NUMERIC":
                    // code for NUMERIC
                    break;

                case "MCQ":
                    // code for MCQ
                    break;

                case "TEXT":
                    // code for text
                    break;
            }
            input.required = true;



            const button = document.createElement("button");
            button.textContent = "Submit";
            button.type = "button";

            button.addEventListener("click", function () {
                submitAnswer(input.value);
            });

            answerBox.appendChild(label);
            answerBox.appendChild(document.createElement("br"));
            answerBox.appendChild(input);
            answerBox.appendChild(document.createElement("br"));
            answerBox.appendChild(button);


        });
}

function startError(errorText){
    questionBox.innerHTML = errorText;

}

function skipQuestion(){
    //TODO
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
    //TODO
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
        });
});
