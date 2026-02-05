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

                li.innerHTML = `<a href="./app.html?${params.toString()}">${treasureHunts[i].name}</a>`;
                ul.appendChild(li);
            }
        });
}

listChallenges();