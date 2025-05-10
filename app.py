from flask import Flask, render_template, request, jsonify
import numpy as np

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

def brute_force_solution(grid_state, A):
    # Brute force approach to find a solution
    for i in range(2**9):
        x = np.array([int(b) for b in format(i, '09b')], dtype=int)
        toggled_grid = (np.dot(A, x) % 2).astype(int)
        if np.array_equal(toggled_grid, 1 - np.array(grid_state).flatten()):
            return x
    return None

@app.route("/solve", methods=["POST"])
def solve():
    # Get the grid state from the request
    grid_state = request.json.get("gridState")
    
    # Define the 3x3 coefficient matrix for the Lights Out puzzle
    A = np.array([
        [1, 1, 0, 1, 0, 0, 0, 0, 0],
        [1, 1, 1, 0, 1, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 1, 0, 0, 0],
        [1, 0, 0, 1, 1, 0, 1, 0, 0],
        [0, 1, 0, 1, 1, 1, 0, 1, 0],
        [0, 0, 1, 0, 1, 1, 0, 0, 1],
        [0, 0, 0, 1, 0, 0, 1, 1, 0],
        [0, 0, 0, 0, 1, 0, 1, 1, 1],
        [0, 0, 0, 0, 0, 1, 0, 1, 1],
    ], dtype=int)

    # Flatten the grid state into a vector
    b = np.array(grid_state).flatten()

    # Flip the target state to solve for all lights ON
    b = 1 - b  # Complement the grid state

    # Solve the system A * x ≡ b (mod 2)
    try:
        x = np.linalg.solve(A, b) % 2
        x = x.astype(int)
        toggled_grid = (np.dot(A, x) % 2).astype(int)  # Simulate toggling
        if not np.array_equal(toggled_grid, b):
            raise ValueError("Invalid solution")
    except (np.linalg.LinAlgError, ValueError):
        # Fallback to brute force
        x = brute_force_solution(grid_state, A)
        if x is None:
            return jsonify({"error": "No solution exists"}), 400

    # Reshape the solution back into a 3x3 grid
    solution = x.reshape((3, 3)).tolist()
    return jsonify({"solution": solution})

if __name__ == "__main__":
    app.run(debug=True)