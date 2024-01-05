const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const gravity = 0.5; // Gravity constant
const elasticity = 0.7; // Bounce efficiency
const dragFactor = 0.01; // Drag coefficient
const velocityScale = 0.1; // Scale down the calculated velocities
const imageSize = 120; // Size of the skull image
let isDragging = false;
let lastMousePosition = { x: 0, y: 0 };
let secondLastMousePosition = { x: 0, y: 0 };
let lastTime = 0;
let secondLastTime = 0;

let x = canvas.width / 2; // Starting X position
let y = 50; // Starting Y position
let vy = 0; // Vertical velocity
let vx = 0; // Horizontal velocity

// Load background image
const backgroundImage = new Image();
backgroundImage.src = 'pecanEnergies.png';

// Load skull image
const skullImage = new Image();
skullImage.src = 'diaDeLosMuertosSkull.png';

function isMouseOnSkull(mouseX, mouseY) {
    const distX = mouseX - x;
    const distY = mouseY - y;
    return distX * distX + distY * distY <= (imageSize / 2) * (imageSize / 2);
}

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    if (event.touches) {
        x = event.touches[0].clientX - rect.left;
        y = event.touches[0].clientY - rect.top;
    }

    return { x, y };
}

function handleMouseDown(event) {
    event.preventDefault();
    const { x: mouseX, y: mouseY } = getCursorPosition(canvas, event);
    if (isMouseOnSkull(mouseX, mouseY)) {
        isDragging = true;
        lastMousePosition = { x: mouseX, y: mouseY };
        secondLastMousePosition = { x: mouseX, y: mouseY };
        lastTime = Date.now();
        secondLastTime = lastTime;
    }
}

function handleMouseMove(event) {
    event.preventDefault();
    if (isDragging) {
        const { x: mouseX, y: mouseY } = getCursorPosition(canvas, event);
        x = mouseX;
        y = mouseY;
        
        secondLastMousePosition = lastMousePosition;
        secondLastTime = lastTime;
        
        lastMousePosition = { x: mouseX, y: mouseY };
        lastTime = Date.now();
    }
}

function handleMouseUp(event) {
    event.preventDefault();
    if (isDragging) {
        const currentTime = Date.now();
        const deltaTime = (currentTime - secondLastTime) / 1000; // Time in seconds
        if (deltaTime > 0) {
            vx = ((lastMousePosition.x - secondLastMousePosition.x) / deltaTime) * velocityScale;
            vy = ((lastMousePosition.y - secondLastMousePosition.y) / deltaTime) * velocityScale;
        }
        isDragging = false;
    }
}

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('touchstart', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('touchmove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('touchend', handleMouseUp);

function applyDrag() {
    vx -= dragFactor * vx;
    vy -= dragFactor * vy;
}

function update() {
    if (!isDragging) {
        vy += gravity; // Apply gravity to vertical velocity
        applyDrag(); // Apply drag to both velocities
        
        x += vx; // Update horizontal position
        y += vy; // Update vertical position

        // Bounce off the walls
        if (x - imageSize / 2 < 0 || x + imageSize / 2 > canvas.width) {
            vx = -vx * elasticity;
            x = (x - imageSize / 2 < 0) ? imageSize / 2 : canvas.width - imageSize / 2;
        }

        // Bounce off the floor and ceiling
        if (y - imageSize / 2 < 0 || y + imageSize / 2 > canvas.height) {
            vy = -vy * elasticity;
            y = (y - imageSize / 2 < 0) ? imageSize / 2 : canvas.height - imageSize / 2;
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(skullImage, x - imageSize / 2, y - imageSize / 2, imageSize, imageSize);
    requestAnimationFrame(update);
}

update();
