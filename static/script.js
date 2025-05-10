document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const solutionGrid = document.getElementById("solution-grid");
    const solveButton = document.getElementById("solve-button");
    const newgameButton = document.getElementById("newgame-button");
    const editButton = document.getElementById("edit-button");

    let isEditing = false; // Flag to track editor mode

    // Initialize a 3x3 grid with random lights on/off
    const gridState = Array.from({ length: 3 }, () =>
        Array.from({ length: 3 }, () => Math.random() > 0.5)
    );

    // Render the grid
    function renderGrid() {
        grid.innerHTML = ""; // Clear the grid
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                if (gridState[row][col]) cell.classList.add("on");
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener("click", () => handleCellClick(row, col));
                grid.appendChild(cell);
            }
        }
    }

    // Handle cell click logic
    function handleCellClick(row, col) {
        if (isEditing) {
            // In editor mode, only toggle the clicked cell
            gridState[row][col] = !gridState[row][col];
            renderGrid(); // Re-render the grid
        } else {
            // Normal mode: toggle the clicked cell and its neighbors
            toggleLights(row, col);
        }
    }

    // Toggle the clicked cell and its neighbors
    function toggleLights(row, col) {
        const directions = [
            [0, 0], // Current cell
            [-1, 0], // Above
            [1, 0], // Below
            [0, -1], // Left
            [0, 1], // Right
        ];

        directions.forEach(([dx, dy]) => {
            const newRow = row + dx;
            const newCol = col + dy;
            if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
                gridState[newRow][newCol] = !gridState[newRow][newCol];
            }
        });

        renderGrid();
    }

    // Solve the puzzle and display the solution
    function solvePuzzle() {
        // Explicitly exit editor mode
        isEditing = false;

        // Convert the grid state to a format suitable for the backend
        const gridStateConverted = gridState.map(row => row.map(cell => (cell ? 1 : 0))); // Convert boolean to 1/0

        fetch("/solve", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ gridState: gridStateConverted }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to solve the puzzle");
                }
                return response.json();
            })
            .then(data => {
                const solution = data.solution;

                // Render the solution grid
                solutionGrid.innerHTML = ""; // Clear the solution grid
                for (let row = 0; row < 3; row++) {
                    for (let col = 0; col < 3; col++) {
                        const cell = document.createElement("div");
                        cell.classList.add("cell");
                        if (solution[row][col]) cell.classList.add("on");
                        solutionGrid.appendChild(cell);
                    }
                }

                // Ensure editor mode is disabled after solving
                isEditing = false;
            })
            .catch(error => {
                console.error("Error solving the puzzle:", error);
            });
    }

    // Reset the grid to a new random state
    function resetGrid() {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                gridState[row][col] = Math.random() > 0.5;
            }
        }
        isEditing = false; // Exit editor mode
        renderGrid();
    }

    // Enable editor mode
    function enableEditorMode() {
        isEditing = true;
    }

    // Attach event listeners
    solveButton.addEventListener("click", solvePuzzle); // Solve button exits editor mode
    newgameButton.addEventListener("click", resetGrid); // New game button exits editor mode
    editButton.addEventListener("click", enableEditorMode); // Edit button enables editor mode

    // Initial render
    renderGrid();
});