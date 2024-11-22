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

// 添加代码混淆和验证逻辑
const _0x1a2b3c = {
    _k: 'Q0NC', // 'CCB' in base64
    _v: function(code) {
        // 简单的混淆验证逻辑
        try {
            const prefix = atob(this._k);
            return code.startsWith(prefix);
        } catch {
            return false;
        }
    }
};

// Pro 相关元素
const unlockInput = document.getElementById('unlockInput');
const unlockButton = document.getElementById('unlockButton');
const proBadge = document.getElementById('proBadge');

// 验证码格式检查
function isValidFormat(code) {
    // 基本格式：CCB + 5位数字和字母的组合
    const pattern = /^CCB[A-Z0-9]{5}$/;
    
    if (!pattern.test(code)) {
        return false;
    }
    
    // 检查第一位和最后一位是否为数字
    const firstChar = code.charAt(3);  // CCB后的第一位
    const lastChar = code.charAt(7);   // 最后一位
    return /[0-9]/.test(firstChar) && /[0-9]/.test(lastChar);
}

// 添加输入框事件监听
unlockInput.addEventListener('input', (e) => {
    // 转换为大写
    e.target.value = e.target.value.toUpperCase();
    
    const code = e.target.value.trim();
    
    // 检查长度是否为8位
    if (code.length === 8) {
        // 只要符合CCB+5位字符的格式就显示确认按钮
        if (/^CCB[A-Z0-9]{5}$/.test(code)) {
            unlockButton.style.opacity = '1';
            unlockButton.style.visibility = 'visible';
        } else {
            unlockInput.classList.add('error');
            setTimeout(() => {
                unlockInput.classList.remove('error');
            }, 500);
        }
    } else {
        unlockButton.style.opacity = '0';
        unlockButton.style.visibility = 'hidden';
    }
});

// 修改验证处理函数
async function handleUnlock() {
    const code = unlockInput.value.trim();
    
    if (code.length === 8) {
        if (isValidFormat(code)) {
            // 验证成功
            await chrome.storage.local.set({ isPro: true });
            proBadge.classList.add('active');
            unlockInput.value = '';
            
            // 隐藏整个 redeem 区域
            const redeemSection = document.querySelector('.redeem-section');
            const redeemWrapper = document.querySelector('.redeem-wrapper');
            if (redeemSection) {
                redeemSection.style.display = 'none';
            }
            if (redeemWrapper) {
                redeemWrapper.style.display = 'none';
            }
            
            // 显示成功动画
            const successAnim = document.createElement('div');
            successAnim.className = 'success-anim';
            successAnim.textContent = '✨ PRO Activated!';
            document.body.appendChild(successAnim);
            
            setTimeout(() => {
                successAnim.remove();
            }, 2000);
        } else {
            // 验证失败动画
            unlockInput.classList.add('error');
            setTimeout(() => {
                unlockInput.classList.remove('error');
            }, 500);
            
            // 显示错误提示
            const errorAnim = document.createElement('div');
            errorAnim.className = 'error-anim';
            errorAnim.textContent = '❌ Invalid Code';
            document.body.appendChild(errorAnim);
            
            setTimeout(() => {
                errorAnim.remove();
            }, 2000);
        }
    }
}

// 添加事件监听
unlockButton.addEventListener('click', handleUnlock);
unlockInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUnlock();
    }
});

// 初始化时检查 Pro 状态
document.addEventListener('DOMContentLoaded', async () => {
    const { isPro } = await chrome.storage.local.get(['isPro']);
    if (isPro) {
        proBadge.classList.add('active');
        // Pro 激活时隐藏 Redeem 相关元素
        const redeemSection = document.querySelector('.redeem-section');
        const redeemWrapper = document.querySelector('.redeem-wrapper');
        if (redeemSection) {
            redeemSection.style.display = 'none';
        }
        if (redeemWrapper) {
            redeemWrapper.style.display = 'none';
        }
    }
});

// 添加兑换按钮点击事件
const redeemButton = document.querySelector('.redeem-button');
const redeemWrapper = document.querySelector('.redeem-wrapper');

redeemButton.addEventListener('click', () => {
    redeemWrapper.classList.toggle('show');
    unlockInput.focus();
});

// 点击外部区域隐藏输入框
document.addEventListener('click', (e) => {
    if (!redeemWrapper.contains(e.target)) {
        redeemWrapper.classList.remove('show');
    }
}); 