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