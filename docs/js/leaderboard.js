document.addEventListener("DOMContentLoaded", loadLeaderboard);

function loadLeaderboard() {
    const tbody = document.getElementById("leaderboard-body");
    tbody.innerHTML = "<tr><td colspan='3'>Loading...</td></tr>";

    const params = new URLSearchParams(window.location.search);
    const session = params.get("session");
    const playerName = params.get("player");

    fetch("https://codecyprus.org/th/api/leaderboard?session=" + encodeURIComponent(session)+ "&sorted")
        .then(r => r.json())
        .then(q => {
            if (q.status !== "OK") {
                tbody.innerHTML = "<tr><td colspan='3'>Error loading leaderboard</td></tr>";
                return;
            }

            tbody.innerHTML = "";
            // get top 50
            q.leaderboard.slice(0, 50).forEach((entry, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
          <td>${index + 1}</td>    
          <td>${entry.player}</td>
          <td>${entry.score}</td>
        `;
                tbody.appendChild(row);
            });

            // find your name in leaderboard
            const myIndex = q.leaderboard.findIndex(e => e.player === playerName);
            if (myIndex >= 50) {
                const me = q.leaderboard[myIndex];
                const row = document.createElement("tr");
                row.innerHTML = `
          <td>${myIndex + 1}</td>
          <td>${me.player}</td>
          <td>${me.score}</td>
        `;
                row.style.backgroundColor = "#2d3748";
                tbody.appendChild(row);
            }
        })
        .catch(() => {
            tbody.innerHTML = "<tr><td colspan='3'>Error loading leaderboard</td></tr>";
        });
}

//This function saves player's score
function saveScore(name, timeInSeconds) {
    const scores =
        JSON.parse(localStorage.getItem("leaderboard")) || [];

    scores.push({
        name: name,
        time: timeInSeconds
    });
    localStorage.setItem("leaderboard", JSON.stringify(scores));
}

//Converts seconds to mm:ss
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

//Clears Leaderboard Button
document.getElementById("clear-btn").addEventListener("click", () => {
    loadLeaderboard()

});