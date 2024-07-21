document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    if (!username) {
        window.location.href = 'index.html';
        return;
    }

    const matches = [
        { id: 1, team1: 'Team A', team2: 'Team B' },
        { id: 2, team1: 'Team C', team2: 'Team D' }
    ];

    const matchesDiv = document.getElementById('matches');

    matches.forEach(match => {
        const matchDiv = document.createElement('div');
        matchDiv.innerHTML = `
            <p>${match.team1} vs ${match.team2}</p>
            <input type="text" id="prediction-${match.id}" placeholder="Your prediction">
            <button onclick="submitPrediction(${match.id})">Submit</button>
        `;
        matchesDiv.appendChild(matchDiv);
    });
});

function submitPrediction(matchId) {
    const username = localStorage.getItem('username');
    const prediction = document.getElementById(`prediction-${matchId}`).value;
    const matches = [
        { id: 1, team1: 'Team A', team2: 'Team B' },
        { id: 2, team1: 'Team C', team2: 'Team D' }
    ];
    const match = matches.find(m => m.id === matchId);

    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, match: `${match.team1} vs ${match.team2}`, prediction })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Prediction submitted successfully');
        } else {
            alert('Error submitting prediction');
        }
    });
}
