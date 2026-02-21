// api /list
function listChallenges(){
    fetch("https://codecyprus.org/th/api/list")
        .then(response => response.json())
        .then(jsonObject => {

            let treasureHunts = jsonObject.treasureHunts;
            let ul = document.getElementById("challenge-list");


            for (let i = 0; i < treasureHunts.length; i++) {
                let li = document.createElement("li");

                const params = new URLSearchParams({
                    uuid: treasureHunts[i].uuid,
                    name: treasureHunts[i].name
                });

                li.innerHTML = `<a href="./app.html?${params.toString()}">${treasureHunts[i].name} <br> ${treasureHunts[i].description} </a>`;
                ul.appendChild(li);
            }
        })
        .catch(err => { console.error("API error (list):", err); const ul = document.getElementById("challenge-list"); if (ul) ul.innerHTML = "<li>Could not load challenges.</li>"; });
}

listChallenges();
