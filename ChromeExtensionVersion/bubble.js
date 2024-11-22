// Create and inject the bubble HTML
const bubbleHTML = `
    <div id="ciaoclipboard-bubble">
        <button class="close-button">×</button>
        <button class="bubble-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="32" height="32">
                <defs>
                    <linearGradient id="sweep-orange" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:rgba(255,138,76,0.2)"/>
                        <stop offset="100%" style="stop-color:rgba(255,138,76,0)"/>
                        <animate attributeName="x1" values="0%;100%" dur="1.5s" repeatCount="indefinite"/>
                        <animate attributeName="x2" values="100%;200%" dur="1.5s" repeatCount="indefinite"/>
                    </linearGradient>
                </defs>

                <!-- 文本背景 -->
                <rect x="8" y="16" width="48" height="32" rx="4" 
                      fill="white" 
                      stroke="rgba(255,138,76,0.3)" 
                      stroke-width="2"/>

                <!-- 文本行 -->
                <g fill="none" stroke="#666" stroke-width="2" stroke-linecap="round">
                    <line x1="16" y1="28" x2="48" y2="28">
                        <animate attributeName="x2" 
                            values="48;16" 
                            dur="1.5s" 
                            repeatCount="indefinite"/>
                    </line>
                    <line x1="16" y1="36" x2="40" y2="36">
                        <animate attributeName="x2" 
                            values="40;16" 
                            dur="1.5s" 
                            repeatCount="indefinite"
                            begin="0.2s"/>
                    </line>
                </g>

                <!-- 清扫效果 -->
                <rect x="8" y="16" width="48" height="32" 
                      fill="url(#sweep-orange)" 
                      rx="4">
                    <animate attributeName="opacity"
                        values="0;0.5;0"
                        dur="1.5s"
                        repeatCount="indefinite"/>
                </rect>

                <!-- 扫把 -->
                <g transform="translate(48, 32) rotate(-30)">
                    <animate attributeName="transform" 
                        values="translate(48, 32) rotate(-30);translate(8, 32) rotate(-30)" 
                        dur="1.5s" 
                        repeatCount="indefinite"/>
                    <line x1="0" y1="0" x2="0" y2="-12" 
                          stroke="#666" 
                          stroke-width="2" 
                          stroke-linecap="round"/>
                    <path d="M-4,-10 Q0,-12 4,-10 L2,-8 Q0,-10 -2,-8 Z" 
                          fill="#666"/>
                </g>
            </svg>
        </button>
        <div class="pro-badge">PRO</div>
        <div class="bubble-panel">
            <button class="clear-button">1-Click Clear</button>
            <div class="pro-badge">PRO</div>
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
const closeButton = bubble.querySelector('.close-button');

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
    
    const clearButton = bubble.querySelector('.clear-button');
    clearButton.classList.add('clearing');

    try {
        await navigator.clipboard.writeText('');
        successMessage.classList.add('show');
        clearButton.classList.add('cleared');
        
        updateStats(true);
        
        setTimeout(() => {
            successMessage.classList.remove('show');
            isClearing = false;
        }, 1000);

        const resetButton = () => {
            clearButton.classList.remove('clearing', 'cleared');
            panel.removeEventListener('transitionend', resetButton);
        };
        panel.addEventListener('transitionend', resetButton);
        
    } catch (err) {
        console.error('Failed to clear clipboard:', err);
        clearButton.classList.remove('clearing', 'cleared');
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
    if (!bubble.contains(e.target) || e.target === closeButton || e.target.closest('.bubble-panel')) return;
    e.preventDefault();
    
    isDragging = true;
    bubble.classList.add('dragging');

    // 获取当前位置
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

    // 移除 right/bottom 定位，改用 top/left
    bubble.style.right = 'auto';
    bubble.style.bottom = 'auto';
    bubble.style.left = startBubbleX + 'px';
    bubble.style.top = startBubbleY + 'px';
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

    // 获取视口尺寸
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const bubbleWidth = bubble.offsetWidth;
    const bubbleHeight = bubble.offsetHeight;
    const padding = 5;

    // 应用边界限制
    newX = Math.max(padding, Math.min(viewportWidth - bubbleWidth - padding, newX));
    newY = Math.max(padding, Math.min(viewportHeight - bubbleHeight - padding, newY));

    // 设置新位置
    bubble.style.left = newX + 'px';
    bubble.style.top = newY + 'px';
}

function stopDragging() {
    if (!isDragging) return;
    isDragging = false;
    bubble.classList.remove('dragging');

    // 获取最终位置
    const rect = bubble.getBoundingClientRect();
    const finalX = rect.left;
    const finalY = rect.top;

    // 保存位置到storage
    if (chrome?.storage?.local) {
        chrome.storage.local.set({
            bubblePosition: { x: finalX, y: finalY }
        });
    }
}

// 修改初始化位置函数
function initPosition() {
    if (chrome?.storage?.local) {
        chrome.storage.local.get(['bubblePosition', 'bubbleVisible'], function(result) {
            if (result.bubblePosition && isValidPosition(result.bubblePosition.x, result.bubblePosition.y)) {
                const { x, y } = result.bubblePosition;
                bubble.style.right = 'auto';
                bubble.style.bottom = 'auto';
                bubble.style.left = x + 'px';
                bubble.style.top = y + 'px';
            }
            
            if (result.bubbleVisible === false) {
                bubble.style.display = 'none';
            }
        });
    }
}

// 验证位置是否有效
function isValidPosition(x, y) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const bubbleWidth = bubble.offsetWidth || 48;
    const bubbleHeight = bubble.offsetHeight || 48;
    const padding = 10;

    return x >= -bubbleWidth + padding && 
           y >= -bubbleHeight + padding && 
           x <= viewportWidth - padding && 
           y <= viewportHeight - padding;
}

// 监听窗口大小变化
window.addEventListener('resize', () => {
    // 重新验证并调整位
    const rect = bubble.getBoundingClientRect();
    if (!isValidPosition(rect.left, rect.top)) {
        // 如果当前位置无效，重置到右下角
        bubble.style.transform = 'translate(0, 0)';
    }
});

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 设置初始位置为右下角，并保持一定距离
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const bubbleWidth = bubble.offsetWidth || 48;
    const bubbleHeight = bubble.offsetHeight || 48;
    const margin = 30; // 设置与边缘的距离为 30px
    
    const initialX = viewportWidth - bubbleWidth - margin;
    const initialY = viewportHeight - bubbleHeight - margin;
    
    // 移除默认的 bottom 和 right 定位
    bubble.style.bottom = 'auto';
    bubble.style.right = 'auto';
    bubble.style.top = '0';
    bubble.style.left = '0';
    bubble.style.transform = `translate(${initialX}px, ${initialY}px)`;
    
    // 然后初始化位置
    initPosition();
});

// 添加拖拽事件监听器
bubble.addEventListener('mousedown', startDragging);
bubble.addEventListener('touchstart', startDragging);
document.addEventListener('mousemove', doDrag);
document.addEventListener('touchmove', doDrag);
document.addEventListener('mouseup', stopDragging);
document.addEventListener('touchend', stopDragging); 

// 添加闭按钮事件理
closeButton.addEventListener('click', (e) => {
    e.stopPropagation(); // 防止事件冒泡
    bubble.style.display = 'none';
    // 保存状态到storage
    if (chrome?.storage?.local) {
        chrome.storage.local.set({ bubbleVisible: false });
    }
});

// 添加鼠标移出事件处理
let closeButtonTimeout;
bubble.addEventListener('mouseenter', () => {
    clearTimeout(closeButtonTimeout);
    closeButton.style.opacity = '1';
});

bubble.addEventListener('mouseleave', () => {
    closeButtonTimeout = setTimeout(() => {
        closeButton.style.opacity = '0';
    }, 300); // 300ms 延迟，使过渡更自然
});

// 添加在文件末尾
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleBubble") {
        if (bubble.style.display === 'none') {
            bubble.style.display = 'block';
            chrome.storage.local.set({ bubbleVisible: true });
        }
    }
});

// 添加检查 Pro 状态的函数
async function checkProStatus() {
    try {
        const { isPro } = await chrome.storage.local.get(['isPro']);
        const bubble = document.getElementById('ciaoclipboard-bubble');
        const proBadge = bubble.querySelector('.pro-badge');
        
        if (isPro) {
            proBadge.classList.add('show');
        } else {
            proBadge.classList.remove('show');
        }
    } catch (error) {
        console.error('Error checking Pro status:', error);
    }
}

// 在初始化时检查 Pro 状态
document.addEventListener('DOMContentLoaded', checkProStatus);

// 监听存储变化
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.isPro) {
        checkProStatus();
    }
}); 