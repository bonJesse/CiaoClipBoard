'use strict';

// 添加错误处理
chrome.runtime.onInstalled.addListener(() => {
    // 初始化存储
    chrome.storage.local.set({
        bubbleVisible: true,
        usageCount: 0,
        lastUsed: null
    }).catch(error => {
        console.error('Installation storage error:', error);
    });
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
}); 