// Select DOM elements
const triangleContainer = document.getElementById("triangle");
const statusMessage = document.getElementById("status-message");
const resetButton = document.getElementById("reset-button");
const levelDisplay = document.getElementById("level-display");

// Game state
let lines = [];
let remainingLines = 0;
let isPlayerTurn = true;
let currentLevel = 1;
let selectedLines = [];

// Levels configuration
const levels = [
  { rows: [1, 2, 3, 4], totalLines: 10 }, // Level 1
  { rows: [1, 2, 3, 4, 5], totalLines: 15 }, // Level 2
  { rows: [1, 2, 3, 4, 5, 6], totalLines: 21 }, // Level 3
  { rows: [1, 2, 3, 4, 5, 6, 7], totalLines: 28 }, // Level 4
  { rows: [1, 2, 3, 4, 5, 6, 7, 8], totalLines: 36 }, // Level 5
];

// Generate the triangular arrangement of lines
function generateTriangle() {
  const levelConfig = levels[currentLevel - 1];
  const rows = levelConfig.rows;
  let lineIndex = 0;

  triangleContainer.innerHTML = ""; // Clear previous layout
  lines = []; // Reset lines array

  rows.forEach((numLines, rowIndex) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("line-row");

    for (let i = 0; i < numLines; i++) {
      const lineDiv = document.createElement("div");
      lineDiv.classList.add("line");
      lineDiv.dataset.index = lineIndex;

      // Add mouse events for dragging
      lineDiv.addEventListener("mousedown", () => {
        const index = parseInt(lineDiv.dataset.index, 10);
        startSelection(index);
      });

      lineDiv.addEventListener("mouseover", () => {
        const index = parseInt(lineDiv.dataset.index, 10);
        addToSelection(index);
      });

      rowDiv.appendChild(lineDiv);
      lines.push({ element: lineDiv, removed: false, rowIndex });
      lineIndex++;
    }

    triangleContainer.appendChild(rowDiv);
  });

  remainingLines = levelConfig.totalLines;
  updateStatusMessage();
}

// Start selecting lines
function startSelection(index) {
  // Validate index
  if (index < 0 || index >= lines.length) {
    console.error(`Invalid index: ${index}`);
    return;
  }

  if (!isPlayerTurn || lines[index].removed) return;

  selectedLines = [index];
  lines[index].element.classList.add("selected");
}

// Add lines to selection during drag
function addToSelection(index) {
  // Validate index
  if (index < 0 || index >= lines.length) {
    console.error(`Invalid index: ${index}`);
    return;
  }

  if (!isPlayerTurn || lines[index].removed) return;

  const firstSelectedIndex = selectedLines[0];
  const firstRowIndex = lines[firstSelectedIndex].rowIndex;

  // Only allow selecting lines in the same row
  if (lines[index].rowIndex === firstRowIndex && !selectedLines.includes(index)) {
    console.log(`Adding line ${index} to selection`);
    selectedLines.push(index);
    lines[index].element.classList.add("selected");
  }
}

// Remove selected lines when mouse is released
document.addEventListener("mouseup", () => {
  if (selectedLines.length > 0) {
    removeSelectedLines();
    checkGameOver();
    if (remainingLines > 0) {
      isPlayerTurn = false;
      setTimeout(computerTurn, 500); // Simulate computer thinking
    }
  }
  clearSelection();
});

// Remove selected lines
function removeSelectedLines() {
  selectedLines.forEach((index) => {
    if (!lines[index].removed) {
      removeLine(index);
    }
  });
}

// Clear selection
function clearSelection() {
  selectedLines.forEach((index) => {
    lines[index].element.classList.remove("selected");
  });
  selectedLines = [];
}

// Remove a single line
function removeLine(index) {
  lines[index].element.classList.add("removed");
  lines[index].removed = true;
  remainingLines--;
  updateStatusMessage();
}

// Computer's turn
function computerTurn() {
  const availableLines = lines
    .map((line, index) => (line.removed ? null : index))
    .filter((index) => index !== null);

  if (availableLines.length === 0) return;

  // Simple AI strategy: Remove 1-3 lines from the same row
  const randomRowIndex = lines[availableLines[0]].rowIndex;
  const linesInRow = availableLines.filter(
    (index) => lines[index].rowIndex === randomRowIndex
  );
  const numToRemove = Math.min(Math.floor(Math.random() * 3) + 1, linesInRow.length);

  console.log(`Computer removing ${numToRemove} lines from row ${randomRowIndex}`);

  linesInRow.slice(0, numToRemove).forEach((index) => removeLine(index));

  checkGameOver();
  isPlayerTurn = true;
}

// Check if the game is over
function checkGameOver() {
  if (remainingLines === 0) {
    const winner = isPlayerTurn ? "Computer" : "Player";
    statusMessage.textContent = `${winner} wins!`;
    disableAllLines();

    // Move to the next level if the player wins
    if (!isPlayerTurn && currentLevel < levels.length) {
      currentLevel++;
      setTimeout(() => {
        statusMessage.textContent = `Starting Level ${currentLevel}`;
        generateTriangle();
      }, 2000);
    }
  }
}

// Disable all lines when the game ends
function disableAllLines() {
  lines.forEach((line) => {
    line.element.style.pointerEvents = "none";
  });
}

// Update the status message
function updateStatusMessage() {
  statusMessage.textContent = `Remaining Lines: ${remainingLines}`;
  levelDisplay.textContent = `Level: ${currentLevel}`;
}

// Reset the game
function resetGame() {
  currentLevel = 1;
  generateTriangle();
  statusMessage.textContent = "Player's turn!";
}

// Initialize the game
generateTriangle();

// Add event listener for reset button
resetButton.addEventListener("click", resetGame);
