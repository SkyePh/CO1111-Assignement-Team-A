// api /list
function listChallenges(){
    fetch("https://codecyprus.org/th/api/list")
        .then(response => response.json())
        .then(jsonObject => {

            let treasureHunts = jsonObject.treasureHunts;
            let ul = document.getElementById("challenge-list");


            for (let i = 0; i < treasureHunts.length; i++) {
                let li = document.createElement("li");

                li.innerHTML = "<a href='https://codecyprus.org/api/start?player=dexter&app=test&treasure-hunt-id=" + treasureHunts[i].uuid + "'>" + treasureHunts[i].name + "</a>";
                ul.appendChild(li);
            }
        });
}

// listChallenges();