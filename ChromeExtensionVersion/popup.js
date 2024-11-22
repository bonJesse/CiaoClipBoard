// 语言包
const i18n = {
    en: {
        title: 'CiaoClipBoard',
        subtitle: 'Nothing left after 1 click',
        features: 'Features',
        privacy: 'Privacy',
        oneClickCleaning: '✨ One-click cleaning',
        instantFeedback: '🎯 Instant feedback',
        draggableBubble: '🔄 Draggable bubble',
        usageTracking: '📊 Usage tracking',
        noDataCollection: '🔒 No data collection',
        localStorage: '💾 Local storage only',
        completePrivacy: '🛡️ Complete privacy',
        noTracking: '🚫 No tracking',
        usageHint: '💡 Click bubble to clear, drag to reposition',
        redeemCode: '🎁 Redeem Code',
        footer: '© 2024 CiaoClipBoard - Privacy First',
        bubbleVisible: 'Bubble is visible',
        clickToShow: 'Click to show bubble',
        proActivated: '✨ PRO Activated!',
        invalidCode: '❌ Invalid Code',
        proTooltip: 'Support us!',
        clickClear: '1-Click Clear',
        timesUsed: 'Times Used:',
        lastUsed: 'Last Used:',
        never: 'Never',
        cleared: 'Cleared!',
        supportUs: 'Support us!'
    },
    zh: {
        title: 'CiaoClipBoard',
        subtitle: '一键清空剪贴板',
        features: '功能特点',
        privacy: '隐私保护',
        oneClickCleaning: '✨ 一键清理',
        instantFeedback: '🎯 即时反馈',
        draggableBubble: '🔄 可拖动气泡',
        usageTracking: '📊 使用统计',
        noDataCollection: '🔒 无数据收集',
        localStorage: '💾 仅本地存储',
        completePrivacy: '🛡️ 完全隐私',
        noTracking: '🚫 无跟踪记录',
        usageHint: '💡 点击气泡清理，拖动改变位置',
        redeemCode: '🎁 兑换码',
        footer: '© 2024 CiaoClipBoard - 隐私优先',
        bubbleVisible: '气泡已显示',
        clickToShow: '点击显示气泡',
        proActivated: '✨ PRO 已激活！',
        invalidCode: '❌ 兑换码无效',
        proTooltip: '支持我们！',
        clickClear: '一键清理',
        timesUsed: '使用次数：',
        lastUsed: '上次使用：',
        never: '从未使用',
        cleared: '已清理！',
        supportUs: '支持我们！'
    }
};

// 当前语言
let currentLang = 'en';

// 更新时间格式化函数
function formatLastUsed(timestamp, lang) {
    if (!timestamp || timestamp === 'Never') {
        return i18n[lang].never;
    }
    
    try {
        const date = new Date(timestamp);
        if (lang === 'zh') {
            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
        } else {
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
    } catch (error) {
        console.error('Error formatting date:', error);
        return timestamp;
    }
}

// 修改更新文本的函数
function updateTexts() {
    const texts = i18n[currentLang];
    
    // 更新普通文本
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (texts[key]) {
            el.textContent = texts[key];
        }
    });

    // 更新 Pro 提示文本
    const proTooltip = document.querySelector('.pro-tooltip');
    if (proTooltip) {
        proTooltip.textContent = texts.supportUs;
    }

    // 更新最后使用时间
    chrome.storage.local.get(['lastUsed'], function(result) {
        const lastUsedElement = document.querySelector('[data-i18n="lastUsed"]');
        if (lastUsedElement) {
            const formattedDate = formatLastUsed(result.lastUsed, currentLang);
            lastUsedElement.textContent = formattedDate;
        }
    });
}

// 在语言切换时更新所有文本
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        currentLang = lang;
        
        // 更新按钮状态
        document.querySelectorAll('.lang-btn').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-lang') === lang);
        });
        
        // 保存语言选择
        chrome.storage.local.set({ language: lang });
        
        // 更新所有文本
        updateTexts();
    });
});

// 初始化语言设置
document.addEventListener('DOMContentLoaded', async () => {
    const { language, isPro } = await chrome.storage.local.get(['language', 'isPro']);
    
    // 设置语言
    if (language) {
        currentLang = language;
        document.querySelector(`[data-lang="${language}"]`).classList.add('active');
    } else {
        document.querySelector('[data-lang="en"]').classList.add('active');
    }
    
    // 更新所有文本
    updateTexts();
    
    // 更新 Pro 状态
    if (isPro) {
        proBadge.classList.add('active');
        // Pro 激活时隐藏 Redeem 相关元素
        const redeemSection = document.querySelector('.redeem-section');
        if (redeemSection) {
            redeemSection.style.display = 'none';
        }
    }
});

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