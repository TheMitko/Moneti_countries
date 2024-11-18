document.addEventListener("DOMContentLoaded", function() {
    const countrySelectionDiv = document.getElementById("country-selection");
    const currentPlayerDiv = document.getElementById("current-player");
    const countryButtons = document.querySelectorAll(".country-btn");

    let currentPlayer = 1;
    const playersCountries = {
        1: [],
        2: []
    };

    function updateCurrentPlayer() {
        currentPlayerDiv.textContent = `Ред на играч ${currentPlayer} да избере държава`;
    }

    countryButtons.forEach(button => {
        button.addEventListener("click", () => {
            const country = button.getAttribute("data-country");
            playersCountries[currentPlayer].push(country);
            button.disabled = true;
            button.classList.add("selected");

            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updateCurrentPlayer();
            
            // Проверка дали всички държави са избрани
            if (playersCountries[1].length + playersCountries[2].length === countryButtons.length) {
                localStorage.setItem("playersCountries", JSON.stringify(playersCountries));
                alert("Всички държави са избрани!");
                // Navigate to a new page
                window.location.href = "game_europe_2.html";

            }
        });
    });

    // Показване на интерфейса за избор на държави
    countrySelectionDiv.classList.remove("hidden");
    updateCurrentPlayer();
});
