chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "highlightText",
        title: "Highlight and Save Text",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "highlightText") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: highlightAndSaveSelection
        });
    }
});


function highlightSelectedText() {
    const selectedText = window.getSelection().toString().trim();

    if (selectedText.length > 0) {
        const highlightedText = document.createElement('mark');
        highlightedText.style.backgroundColor = 'yellow';
        highlightedText.textContent = selectedText;

        const range = window.getSelection().getRangeAt(0);
        range.deleteContents();
        range.insertNode(highlightedText);

        const pageUrl = window.location.href;

        chrome.storage.local.get('highlights', (data) => {
            const highlights = data.highlights || [];
            highlights.push({ text: selectedText, url: pageUrl });
            chrome.storage.local.set({ highlights: highlights });
        });

        // Clear the selection after highlighting
        window.getSelection().removeAllRanges();
    }
}
