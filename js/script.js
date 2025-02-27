// Select all draggable elements
const draggableElements = document.querySelectorAll('.draggable');

draggableElements.forEach((draggableElement) => {
  let isDragging = false;
  let startX, startY;

  // Mouse Events
  draggableElement.addEventListener('mousedown', (event) => {
    isDragging = true;
    draggableElement.classList.add('dragging'); // Add visual feedback
    startX = event.clientX - draggableElement.offsetLeft;
    startY = event.clientY - draggableElement.offsetTop;
  });

  document.addEventListener('mousemove', (event) => {
    if (isDragging) {
      const newX = Math.max(0, Math.min(event.clientX - startX, window.innerWidth - draggableElement.offsetWidth));
      const newY = Math.max(0, Math.min(event.clientY - startY, window.innerHeight - draggableElement.offsetHeight));
      draggableElement.style.left = `${newX}px`;
      draggableElement.style.top = `${newY}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    draggableElement.classList.remove('dragging'); // Remove visual feedback
  });

  // Touch Events
  draggableElement.addEventListener('touchstart', (event) => {
    isDragging = true;
    draggableElement.classList.add('dragging'); // Add visual feedback
    const touch = event.touches[0];
    startX = touch.clientX - draggableElement.offsetLeft;
    startY = touch.clientY - draggableElement.offsetTop;
  });

  document.addEventListener('touchmove', (event) => {
    if (isDragging) {
      const touch = event.touches[0];
      const newX = Math.max(0, Math.min(touch.clientX - startX, window.innerWidth - draggableElement.offsetWidth));
      const newY = Math.max(0, Math.min(touch.clientY - startY, window.innerHeight - draggableElement.offsetHeight));
      draggableElement.style.left = `${newX}px`;
      draggableElement.style.top = `${newY}px`;
    }
  });

  document.addEventListener('touchend', () => {
    isDragging = false;
    draggableElement.classList.remove('dragging'); // Remove visual feedback
  });
});
