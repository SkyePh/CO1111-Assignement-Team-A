const button = document.getElementById("loadLeaderboardBtn");

button.addEventListener("click", loadLeaderboard);
function loadLeaderboard() {

fetch("https://codecyprus.org/th/test-api/leaderboard")
.then(response => response.json())
.then(data => {

    const tbody = document.getElementById("leaderboard-body");
    tbody.innerHTML = "";
    if (data.status === "OK") {


        data.leaderboard = forEach(player => {

            const row = document.createElement("tr");
            row.innerHTML = `
                                <td>${player.rank}</td>
                                <td>${player.name}</td>
                                <td>${player.score}</td>
                                        `;
            tbody.appendChild(row);
        });
    } else {
        tbody.innerHTML = "<tr><td colspan='3'>Error loading the leaderboard</td></tr>";
    }

})
    .catch(error => {console.log(error)

document.getElementById("leaderboard-body").innerHTML = "<tr><td colspan='3'>API Error</td></tr>";
        });
}