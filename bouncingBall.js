const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const gravity = 0.5; // Gravity constant
const elasticity = 0.7; // Bounce efficiency
const dragFactor = 0.01; // Drag coefficient
const velocityScale = 0.03; // Scale down the calculated velocities
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
backgroundImage.src = 'background.png';

// Load skull image
const skullImage = new Image();
skullImage.src = 'diaDeLosMuertosSkull.png';

function isMouseOnSkull(mouseX, mouseY) {
    const distX = mouseX - x;
    const distY = mouseY - y;
    return distX * distX + distY * distY <= (imageSize / 2) * (imageSize / 2);
}

function calculateVelocityOnRelease() {
    const timeDelta = (lastTime - secondLastTime) / 1000; // Time in seconds
    if (timeDelta === 0 || lastTime === secondLastTime) return { vx: 0, vy: 0 };

    const vx = ((lastMousePosition.x - secondLastMousePosition.x) / timeDelta) * velocityScale;
    const vy = ((lastMousePosition.y - secondLastMousePosition.y) / timeDelta) * velocityScale;
    
    return { vx, vy };
}

canvas.addEventListener('mousedown', function(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    if (isMouseOnSkull(mouseX, mouseY)) {
        isDragging = true;
        lastMousePosition = { x: mouseX, y: mouseY };
        secondLastMousePosition = { x: mouseX, y: mouseY };
        lastTime = Date.now();
        secondLastTime = lastTime;
    }
});

canvas.addEventListener('mousemove', function(event) {
    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        x = mouseX;
        y = mouseY;

        secondLastMousePosition = lastMousePosition;
        secondLastTime = lastTime;

        lastMousePosition = { x: mouseX, y: mouseY };
        lastTime = Date.now();
    }
});

canvas.addEventListener('mouseup', function(event) {
    if (isDragging) {
        const velocity = calculateVelocityOnRelease();
        vx = velocity.vx;
        vy = velocity.vy;
        isDragging = false;
    }
});

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