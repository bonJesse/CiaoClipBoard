// Create and inject the bubble HTML
const bubbleHTML = `
    <div id="ciaoclipboard-bubble">
        <button class="bubble-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" 
                      stroke="white" stroke-width="2" stroke-linecap="round"/>
                <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" 
                      stroke="white" stroke-width="2"/>
            </svg>
        </button>
        <div class="bubble-panel">
            <button class="clear-button">Clear Clipboard</button>
            <div class="stats-info">Times Used: <span id="usageCount">0</span></div>
            <div class="stats-info">Last Used: <span id="lastUsed">Never</span></div>
            <div class="success-message">Cleared!</div>
        </div>
    </div>
`;

// Inject the bubble into the page
document.body.insertAdjacentHTML('beforeend', bubbleHTML);

// Get DOM elements
const bubble = document.getElementById('ciaoclipboard-bubble');
const bubbleButton = bubble.querySelector('.bubble-button');
const panel = bubble.querySelector('.bubble-panel');
const clearButton = bubble.querySelector('.clear-button');
const successMessage = bubble.querySelector('.success-message');
const usageCountElement = document.getElementById('usageCount');
const lastUsedElement = document.getElementById('lastUsed');

// Toggle panel
bubbleButton.addEventListener('click', () => {
    panel.classList.toggle('show');
    updateStats();
});

// Close panel when clicking outside
document.addEventListener('click', (e) => {
    if (!bubble.contains(e.target)) {
        panel.classList.remove('show');
    }
});

// Clear clipboard functionality
let isClearing = false;
async function clearClipboard() {
    if (isClearing) return;
    isClearing = true;

    try {
        await navigator.clipboard.writeText('');
        successMessage.classList.add('show');
        updateStats();
        
        setTimeout(() => {
            successMessage.classList.remove('show');
            isClearing = false;
        }, 1000);
    } catch (err) {
        console.error('Failed to clear clipboard:', err);
        isClearing = false;
    }
}

// Update statistics
async function updateStats() {
    const storage = chrome.storage.local;
    try {
        const data = await storage.get(['usageCount', 'lastUsed']);
        const count = (data.usageCount || 0) + 1;
        const now = new Date().toISOString();
        
        await storage.set({
            usageCount: count,
            lastUsed: now
        });

        usageCountElement.textContent = count;
        lastUsedElement.textContent = new Date(now).toLocaleString();
    } catch (err) {
        console.error('Storage error:', err);
    }
}

// Add clear button listener
clearButton.addEventListener('click', clearClipboard);

// Make bubble draggable
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

bubbleButton.addEventListener('mousedown', dragStart);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', dragEnd);

function dragStart(e) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === bubbleButton) {
        isDragging = true;
    }
}

function drag(e) {
    if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, bubble);
    }
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
}

function dragEnd() {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
} 