// 添加 logo 点击事件处理
document.getElementById('logoSection').addEventListener('click', async () => {
    try {
        // 检查当前气泡球状态
        const result = await chrome.storage.local.get(['bubbleVisible']);
        if (result.bubbleVisible === false) {
            // 发送消息给 background script
            await chrome.runtime.sendMessage({ action: "showBubble" });
            // 更新提示文本
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.textContent = 'Bubble is visible';
            }
            // 关闭弹出窗口
            window.close();
        }
    } catch (error) {
        console.error('Error toggling bubble:', error);
    }
});

// 检查气泡球状态并更新提示文本
async function updateTooltip() {
    try {
        const result = await chrome.storage.local.get(['bubbleVisible']);
        const tooltip = document.querySelector('.tooltip');
        const logoSection = document.getElementById('logoSection');
        
        if (tooltip && logoSection) {
            if (result.bubbleVisible === false) {
                tooltip.textContent = 'Click to show bubble';
                logoSection.style.cursor = 'pointer';
                logoSection.title = 'Click to show bubble';
            } else {
                tooltip.textContent = 'Bubble is visible';
                logoSection.style.cursor = 'default';
                logoSection.title = '';
            }
        }
    } catch (error) {
        console.error('Error checking bubble state:', error);
    }
}

// 监听存储变化
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.bubbleVisible) {
        updateTooltip();
    }
});

// 初始化时更新提示
document.addEventListener('DOMContentLoaded', updateTooltip); 