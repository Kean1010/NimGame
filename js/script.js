// Select the draggable element
const draggableElement = document.getElementById('draggable');

let isDragging = false;
let startX, startY;

// Mouse Events
draggableElement.addEventListener('mousedown', (event) => {
  isDragging = true;
  startX = event.clientX - draggableElement.offsetLeft;
  startY = event.clientY - draggableElement.offsetTop;
});

document.addEventListener('mousemove', (event) => {
  if (isDragging) {
    const newX = event.clientX - startX;
    const newY = event.clientY - startY;
    draggableElement.style.left = `${newX}px`;
    draggableElement.style.top = `${newY}px`;
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});

// Touch Events
draggableElement.addEventListener('touchstart', (event) => {
  isDragging = true;
  const touch = event.touches[0];
  startX = touch.clientX - draggableElement.offsetLeft;
  startY = touch.clientY - draggableElement.offsetTop;
});

document.addEventListener('touchmove', (event) => {
  if (isDragging) {
    const touch = event.touches[0];
    const newX = touch.clientX - startX;
    const newY = touch.clientY - startY;
    draggableElement.style.left = `${newX}px`;
    draggableElement.style.top = `${newY}px`;
  }
});

document.addEventListener('touchend', () => {
  isDragging = false;
});
