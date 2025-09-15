'use strict';

// 添加错误处理
chrome.runtime.onInstalled.addListener(() => {
    // 初始化存储
    chrome.storage.local.set({
        bubbleVisible: true,
        usageCount: 0,
        lastUsed: null,
        isPro: false
    }).catch(error => {
        console.error('Installation storage error:', error);
    });
    // 默认设置（自动清理关闭）
    chrome.storage.sync.set({ settings: { autoClearClipboardMs: 0 } }).catch(() => {});
});

// 处理来自 popup 的消息
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === "showBubble") {
        try {
            // 获取当前活动标签页
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tab) {
                // 向内容脚本发送消息
                await chrome.tabs.sendMessage(tab.id, { action: "toggleBubble" });
                // 更新存储状态
                await chrome.storage.local.set({ bubbleVisible: true });
            }
        } catch (error) {
            console.error('Error showing bubble:', error);
        }
    }
    // 设置更新
    if (request.type === 'settings:update' && request.settings) {
        try {
            await chrome.storage.sync.set({ settings: request.settings });
            resetAutoClearTimer(request.settings.autoClearClipboardMs || 0);
        } catch (e) {
            console.error('Failed to update settings from popup:', e);
        }
    }
    // 语言更新：广播到所有标签页
    if (request.type === 'language:update' && request.lang) {
        try {
            const tabs = await chrome.tabs.query({});
            await Promise.all(tabs.map(tab => {
                if (tab.id) {
                    return chrome.tabs.sendMessage(tab.id, { action: 'language:update', lang: request.lang }).catch(() => {});
                }
            }));
        } catch (e) {
            console.error('Broadcast language update error:', e);
        }
    }
});

// 添加标签页更新监听器
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        // 当页面加载完成时，检查并同步 Pro 状态
        chrome.storage.local.get(['isPro'], function(result) {
            if (result.isPro) {
                chrome.tabs.sendMessage(tabId, { 
                    action: "updateProStatus", 
                    isPro: true 
                }).catch(() => {
                    // 忽略错误，因为某些页面可能不支持内容脚本
                });
            }
        });
    }
}); 

// 使用 chrome.alarms 进行定时，兼容 MV3 service worker 挂起
async function performClipboardClearOnce() {
    try {
        // 通过向所有激活的标签页广播执行清理
        const tabs = await chrome.tabs.query({});
        await Promise.all(tabs.map(tab => {
            if (tab.id) {
                return chrome.tabs.sendMessage(tab.id, { action: 'autoClearClipboard' }).catch(() => {});
            }
        }));
    } catch (e) {
        console.error('Auto clear broadcast error:', e);
    }
}

function resetAutoClearTimer(intervalMs) {
    // 清除已有闹钟
    chrome.alarms.clear('autoClearClipboard');
    if (!intervalMs || intervalMs <= 0) return;
    // 使用周期性闹钟（分钟为单位）
    const minutes = Math.max(1, Math.round(intervalMs / 60000));
    chrome.alarms.create('autoClearClipboard', { periodInMinutes: minutes, delayInMinutes: minutes });
}

// 启动时根据设置初始化定时器
(async function initAutoClearFromSettings() {
    try {
        const { settings } = await chrome.storage.sync.get(['settings']);
        const intervalMs = settings?.autoClearClipboardMs || 0;
        resetAutoClearTimer(intervalMs);
    } catch (e) {
        console.error('Init auto clear settings error:', e);
    }
})();

// 监听 storage 同步变化，双通道保证
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.settings) {
        const next = changes.settings.newValue?.autoClearClipboardMs || 0;
        resetAutoClearTimer(next);
    }
});

// 监听闹钟触发
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'autoClearClipboard') {
        performClipboardClearOnce();
    }
});