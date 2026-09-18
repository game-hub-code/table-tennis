// Clear feed storage when extension is updated
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "update") {
        // Clear feed-related storage on update
        chrome.storage.local.remove(['last_check', 'last_fetch', 'feed_data'], () => {
            if (chrome.runtime.lastError) {
                console.error('Error clearing storage on update:', chrome.runtime.lastError);
            }
        });
    }
});
