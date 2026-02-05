let currentHuntId= null;
let currentSession = null;
let answerBox =document.getElementById("answerBox");
const questionBox = document.getElementById("questionBox");
let userAnswer = null;

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
                loadQuestion(); // ← repeat
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
                    // code for bool
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

fetch("https://codecyprus.org/th/api/list")
    .then(r1 => r1.json())
    .then(data => {
        currentHuntId = data.treasureHunts[0].uuid;
        console.log(data);
    });

const APP_NAME = "co1111-team-a";

const form = document.getElementById("startForm");
const nameInput = document.getElementById("playerName");


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
            console.log("start response:", data); // session variable
            loadQuestion();



        });
});
