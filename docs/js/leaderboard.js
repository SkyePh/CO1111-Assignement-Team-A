document.addEventListener("DOMContentLoaded", loadLeaderboard);

function loadLeaderboard() {
    const tbody = document.getElementById("leaderboard-body");

    tbody.innerHTML = "";

    const scores = JSON.parse(localStorage.getItem("leaderboard")) || [];

    scores.sort((a, b) => a.time - b.time);

    scores.forEach((score, index) => {
        const row = document.createElement("tr");
        row.innerHTML = '<td>${index + 1}</td>' +
            '<td>${score.name}</td>' +
            '<td>${formatTime(score.time)}</td>'
        ;
        tbody.appendChild(row);
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