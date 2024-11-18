document.addEventListener("DOMContentLoaded", function() {
  const playersCountries = JSON.parse(localStorage.getItem("playersCountries")) || {1: [], 2: []};

  const players = { 
    1: { color: "blue", remainingPawns: gameData.pawnsCount, countries: playersCountries[1] },
    2: { color: "green", remainingPawns: gameData.pawnsCount, countries: playersCountries[2] }
  };

  let selectedStartPoint = null;
  let isMovingPhase = false;
  let currentPlayer = 1;
  let captureOptions = [];
  let isMoveDone = false;

  // Helper function to check country ownership
  function checkCountryOwnership(point) {
    const country = point.country;
    if (country) {
      if (players[1].countries.includes(country)) {
        return 1; // Player 1 owns this country
      } else if (players[2].countries.includes(country)) {
        return 2; // Player 2 owns this country
      }
    }
    return null; // No player owns this point's country
  }

  // Function to place pawns on a point
  function placePawns(pointId) {
    const player = players[currentPlayer];
    const point = pointsData.find(p => p.id === pointId);
    const owner = checkCountryOwnership(point);

    if (owner !== currentPlayer) {
      alert("Можете да разположите пуловете си само в свои територии.");
      return;
    }
    
    if (player.remainingPawns <= 0) {
      alert("Не ви остават повече пулове");
      return;
    }
    if (pawnsOnPoints[pointId] && pawnsOnPoints[pointId].owner && pawnsOnPoints[pointId].owner !== currentPlayer) {
      alert("Точката е заета от другия играч!");
      return;
    }

    const numPawns = 1;

    if (!pawnsOnPoints[pointId]) {
      pawnsOnPoints[pointId] = { pawns: 0, owner: null };
    }

    pawnsOnPoints[pointId].pawns += numPawns;
    player.remainingPawns -= numPawns;
    pawnsOnPoints[pointId].owner = currentPlayer;

    updatePointDisplay(pointId);

    if (players[1].remainingPawns === 0 && players[2].remainingPawns === 0) {
      alert("Разполагането на пулове приключи! Вече можете да ги местите!");
      isMovingPhase = true;
    } else {
      currentPlayer = currentPlayer === 1 ? 2 : 1;
      alert(`Сега е ред на играч ${currentPlayer}`);
    }
  }

  // Function to render map elements with country colors
  function renderMapElements() {
    const pointsGroup = document.getElementById("points");
    const connectionsGroup = document.getElementById("connections");
    const pointMap = {};
    pointsData.forEach(point => {
      pointMap[point.id] = point;

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", point.x);
      circle.setAttribute("cy", point.y);
      circle.setAttribute("r", 7);
      circle.setAttribute("fill", point.country ? (checkCountryOwnership(point) === 1 ? players[1].color : (checkCountryOwnership(point) === 2 ? players[2].color : "gray")) : "gray");
      circle.setAttribute("id", point.id);
      circle.style.cursor = "pointer";
      circle.addEventListener("click", () => selectPoint(point.id));
      pointsGroup.appendChild(circle);

      pawnsOnPoints[point.id] = { pawns: 0, owner: null };
      pointNames[point.id] = `Точка ${String.fromCharCode(65 + Object.keys(pointNames).length)}`;
    });

    pointsData.forEach(point => {
      point.connections.forEach(connectionId => {
        const targetPoint = pointMap[connectionId];
        if (targetPoint) {
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("x1", point.x);
          line.setAttribute("y1", point.y);
          line.setAttribute("x2", targetPoint.x);
          line.setAttribute("y2", targetPoint.y);
          line.setAttribute("stroke", "black");
          line.setAttribute("stroke-width", 2);
          connectionsGroup.appendChild(line);
        }
      });
    });
  }

  // Initialize the game
  renderMapElements();
});
