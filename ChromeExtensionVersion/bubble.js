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
    updateStats(false);
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
        
        updateStats(true);
        
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
async function updateStats(shouldCount = false) {
    if (chrome?.storage?.local) {
        chrome.storage.local.get(['usageCount', 'lastUsed'], function(result) {
            const count = shouldCount ? (result.usageCount || 0) + 1 : (result.usageCount || 0);
            const now = new Date().toISOString();
            
            const lastUsed = shouldCount ? now : (result.lastUsed || 'Never');
            
            chrome.storage.local.set({
                usageCount: count,
                lastUsed: lastUsed
            });

            usageCountElement.textContent = count;
            lastUsedElement.textContent = new Date(lastUsed).toLocaleString();
        });
    } else {
        console.error('Chrome storage API not available');
    }
}

// Add clear button listener
clearButton.addEventListener('click', clearClipboard);

// 修改拖拽相关变量，使用更清晰的命名
let isDragging = false;
let startMouseX = 0;
let startMouseY = 0;
let startBubbleX = 0;
let startBubbleY = 0;

function startDragging(e) {
    if (e.target !== bubbleButton) return;
    e.preventDefault();
    
    isDragging = true;
    bubble.classList.add('dragging');

    // 获取气泡当前位置
    const rect = bubble.getBoundingClientRect();
    startBubbleX = rect.left;
    startBubbleY = rect.top;

    // 获取鼠标/触摸起始位置
    if (e.type === 'touchstart') {
        startMouseX = e.touches[0].clientX;
        startMouseY = e.touches[0].clientY;
    } else {
        startMouseX = e.clientX;
        startMouseY = e.clientY;
    }
}

function doDrag(e) {
    if (!isDragging) return;
    e.preventDefault();

    // 获取当前鼠标/触摸位置
    let currentMouseX, currentMouseY;
    if (e.type === 'touchmove') {
        currentMouseX = e.touches[0].clientX;
        currentMouseY = e.touches[0].clientY;
    } else {
        currentMouseX = e.clientX;
        currentMouseY = e.clientY;
    }

    // 计算位移
    const deltaX = currentMouseX - startMouseX;
    const deltaY = currentMouseY - startMouseY;

    // 计算新位置
    let newX = startBubbleX + deltaX;
    let newY = startBubbleY + deltaY;

    // 获取视口和气泡尺寸
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const bubbleWidth = bubble.offsetWidth;
    const bubbleHeight = bubble.offsetHeight;
    const padding = 20;

    // 应用边界限制
    newX = Math.max(padding, Math.min(viewportWidth - bubbleWidth - padding, newX));
    newY = Math.max(padding, Math.min(viewportHeight - bubbleHeight - padding, newY));

    // 应用位置
    bubble.style.transform = `translate(${newX - startBubbleX}px, ${newY - startBubbleY}px)`;
}

function stopDragging() {
    if (!isDragging) return;
    isDragging = false;
    bubble.classList.remove('dragging');

    // 获取最终位置
    const rect = bubble.getBoundingClientRect();
    const finalX = rect.left;
    const finalY = rect.top;

    // 保存位置
    if (chrome?.storage?.local) {
        chrome.storage.local.set({
            bubblePosition: { x: finalX, y: finalY }
        });
    }
}

// 初始化位置
function initPosition() {
    if (chrome?.storage?.local) {
        chrome.storage.local.get(['bubblePosition'], function(result) {
            if (result.bubblePosition && isValidPosition(result.bubblePosition.x, result.bubblePosition.y)) {
                const { x, y } = result.bubblePosition;
                bubble.style.transform = `translate(${x}px, ${y}px)`;
            }
            // 如果没有保存的位置或位置无效，使用默认的右下角位置（通过 CSS 实现）
        });
    }
}

// 验证位置是否有效
function isValidPosition(x, y) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const bubbleWidth = bubble.offsetWidth || 48;
    const bubbleHeight = bubble.offsetHeight || 48;
    const padding = 20;

    return x >= padding && 
           y >= padding && 
           x <= (viewportWidth - bubbleWidth - padding) && 
           y <= (viewportHeight - bubbleHeight - padding);
}

// 监听窗口大小变化
window.addEventListener('resize', () => {
    // 重新验证并调整位置
    const rect = bubble.getBoundingClientRect();
    if (!isValidPosition(rect.left, rect.top)) {
        // 如果当前位置无效，重置到右下角
        bubble.style.transform = 'translate(0, 0)';
    }
});

// 初始化
document.addEventListener('DOMContentLoaded', initPosition); 