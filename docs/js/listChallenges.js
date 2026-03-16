// api /list
function listChallenges(){
    fetch("https://codecyprus.org/th/api/list")
        .then(response => response.json())
        .then(jsonObject => {

            let treasureHunts = jsonObject.treasureHunts;
            let ul = document.getElementById("challenge-list");


            for (let i = 0; i < treasureHunts.length; i++) {

                let li = document.createElement("li");

                const hunt= treasureHunts[i];
                const now= Date.now();
                const startTime= hunt.startsOn;

                let isLocked = now < startTime;

                const params = new URLSearchParams({
                    uuid: treasureHunts[i].uuid,
                    name: treasureHunts[i].name
                });

                if (isLocked) {

                    li.innerHTML='<div class="challenge-card locked" style="margin: 24px;"> ' +
                        '<span class="challenge-title">Future-treasure hunt 🔒</span>' +
                        '<span class="challenge-description">This treasure hunt is not available yet</span>' +
                        '<span class="challenge-start">Start: One thousand years</span></div>';
                } else {

                    li.innerHTML = `<a href="./app.html?${params.toString()}" class="challenge-card-link">
                    <span class="challenge-title">${treasureHunts[i].name}</span>
                    <span class="challenge-description">${treasureHunts[i].description}</span>
                </a>`;
                }
                ul.appendChild(li);
            }
        })
        .catch(err => { console.error("API error (list):", err); const ul = document.getElementById("challenge-list"); if (ul) ul.innerHTML = "<li>Could not load challenges.</li>"; });
}

listChallenges();
