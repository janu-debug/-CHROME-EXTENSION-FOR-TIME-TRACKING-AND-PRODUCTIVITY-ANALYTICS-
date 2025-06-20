let activeTab = null;
let startTime = null;

chrome.tabs.onActivated.addListener(async activeInfo => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    handleTabChange(tab.url);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        handleTabChange(tab.url);
    }
});

function handleTabChange(url) {
    const domain = new URL(url).hostname;
    const now = Date.now();

    if (activeTab && startTime) {
        const timeSpent = (now - startTime) / 1000;
        saveTime(activeTab, timeSpent);
    }

    activeTab = domain;
    startTime = now;
}

function saveTime(domain, seconds) {
    chrome.storage.local.get([domain], result => {
        const previous = result[domain] || 0;
        chrome.storage.local.set({ [domain]: previous + seconds });
    });
}
