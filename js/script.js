// Initialize game state
let currentPlayer = 'player'; // 'player' or 'ai'
let remainingLines = [];
let aiLevel = 1; // AI difficulty level (increases after each win)
let totalRows = 3; // Initial number of rows
let totalColumns = 4; // Initial number of columns

// Select elements
const gameArea = document.getElementById('game-area');
const statusDisplay = document.getElementById('status');

// Create randomized lines
function createLines() {
  gameArea.innerHTML = ''; // Clear previous lines
  remainingLines = [];

  for (let i = 0; i < totalRows; i++) {
    const row = document.createElement('div');
    row.classList.add('row');

    for (let j = 0; j < totalColumns; j++) {
      const line = document.createElement('div');
      line.classList.add('line');
      line.dataset.row = i; // Track which row the line belongs to
      makeDraggable(line);
      row.appendChild(line);
      remainingLines.push(line);
    }

    gameArea.appendChild(row);
  }

  updateStatus();
}

// Make a line draggable
function makeDraggable(line) {
  let isDragging = false;

  line.addEventListener('mousedown', () => {
    isDragging = true;
    line.classList.add('dragging');
  });

  document.addEventListener('mousemove', (event) => {
    if (isDragging) {
      // Move the line off-screen when dragged
      line.style.position = 'absolute';
      line.style.left = `${event.clientX}px`;
      line.style.top = `${event.clientY}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      // Remove the line when dragging ends
      const row = line.dataset.row;
      const rowLines = Array.from(gameArea.querySelectorAll(`.line[data-row="${row}"]`));
      if (rowLines.includes(line)) {
        line.remove();
        remainingLines = remainingLines.filter((l) => l !== line);
        checkGameOver();
      }
    }
    isDragging = false;
    line.classList.remove('dragging');
  });

  // Touch Events
  line.addEventListener('touchstart', () => {
    isDragging = true;
    line.classList.add('dragging');
  });

  document.addEventListener('touchmove', (event) => {
    if (isDragging) {
      const touch = event.touches[0];
      line.style.position = 'absolute';
      line.style.left = `${touch.clientX}px`;
      line.style.top = `${touch.clientY}px`;
    }
  });

  document.addEventListener('touchend', () => {
    if (isDragging) {
      const row = line.dataset.row;
      const rowLines = Array.from(gameArea.querySelectorAll(`.line[data-row="${row}"]`));
      if (rowLines.includes(line)) {
        line.remove();
        remainingLines = remainingLines.filter((l) => l !== line);
        checkGameOver();
      }
    }
    isDragging = false;
    line.classList.remove('dragging');
  });
}

// Update the status display
function updateStatus() {
  statusDisplay.textContent = `${currentPlayer === 'player' ? 'Your' : 'AI'} turn (${remainingLines.length} lines remaining)`;
}

// Check if the game is over
function checkGameOver() {
  if (remainingLines.length === 0) {
    if (currentPlayer === 'player') {
      alert('You lose! Try again.');
    } else {
      alert('You win! Level up!');
      increaseDifficulty();
    }
    resetGame();
  } else {
    currentPlayer = currentPlayer === 'player' ? 'ai' : 'player';
    updateStatus();
    if (currentPlayer === 'ai') {
      setTimeout(aiTurn, 500); // Let the AI play after a short delay
    }
  }
}

// AI Turn
function aiTurn() {
  const rows = Array.from(gameArea.children);
  const nonEmptyRows = rows.filter((row) => row.querySelector('.line'));

  if (nonEmptyRows.length === 0) return;

  // Randomly select a row and remove 1-3 lines
  const randomRow = nonEmptyRows[Math.floor(Math.random() * nonEmptyRows.length)];
  const linesInRow = Array.from(randomRow.querySelectorAll('.line'));
  const linesToRemove = Math.min(aiLevel, linesInRow.length);

  for (let i = 0; i < linesToRemove; i++) {
    const line = linesInRow[i];
    line.remove();
    remainingLines = remainingLines.filter((l) => l !== line);
  }

  checkGameOver();
}

// Increase difficulty after a win
function increaseDifficulty() {
  aiLevel++;
  totalRows += 1; // Add more rows
  totalColumns += 1; // Add more columns
}

// Reset the game
function resetGame() {
  currentPlayer = 'player';
  createLines();
}

// Start the game
createLines();
