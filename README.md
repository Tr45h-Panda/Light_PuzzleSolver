# Light Puzzle Solver

Light Puzzle Solver is a web-based implementation of a 3x3 grid puzzle inspired by the "Lights Out" game. The goal of the puzzle is to toggle the lights on the grid such that all lights are turned **on**. This project includes features like solving the puzzle automatically, editing the grid, and generating new puzzles.

## Features
- **Interactive Grid**: Click on cells to toggle lights and their neighbors.
- **Solve Button**: Automatically calculates the solution to turn all lights on.
- **Edit Mode**: Allows you to manually toggle individual cells without affecting neighbors.
- **New Game Button**: Generates a new random puzzle.
- **Mathematical Solver**: Uses linear algebra to calculate the solution.

## How It Works
- Clicking a cell toggles its state (on/off) and the state of its adjacent cells.
- The "Solve" button uses a mathematical approach to calculate the sequence of moves required to turn all lights on.
- The "Edit" button allows you to modify the grid manually without triggering the normal toggling logic.

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python (Flask)
- **Mathematical Solver**: NumPy for linear algebra

## How to Run Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/Light_PuzzleSolver.git
   cd Light_PuzzleSolver