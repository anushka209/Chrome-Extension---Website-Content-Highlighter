function getXPathForElement(element) {
    if (element.id !== '') return 'id("' + element.id + '")';
    if (element === document.body) return element.tagName;

    let ix = 0;
    const siblings = element.parentNode.childNodes;
    for (let i = 0; i < siblings.length; i++) {
        const sibling = siblings[i];
        if (sibling === element) {
            return getXPathForElement(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']';
        }
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
            ix++;
        }
    }
}

function highlightAndSaveSelection() {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText.length > 0) {
        const range = selection.getRangeAt(0);
        const element = document.createElement('mark');
        element.style.backgroundColor = 'yellow';
        range.surroundContents(element);

        const pageUrl = window.location.href;
        const xpath = getXPathForElement(range.startContainer.parentNode);

        chrome.storage.local.get('highlights', (data) => {
            const highlights = data.highlights || [];
            highlights.push({ text: selectedText, url: pageUrl, xpath: xpath });
            chrome.storage.local.set({ highlights: highlights });
        });

        // Clear the selection after highlighting
        selection.removeAllRanges();
    }
}

document.addEventListener('mouseup', (event) => {
    highlightAndSaveSelection();
});

// Reapply highlights on page load
window.addEventListener('load', () => {
    chrome.storage.local.get('highlights', (data) => {
        const highlights = data.highlights || [];
        const currentUrl = window.location.href;

        highlights.forEach((highlight) => {
            if (highlight.url === currentUrl) {
                const element = document.evaluate(highlight.xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                if (element && element.textContent.includes(highlight.text)) {
                    const range = document.createRange();
                    const startIndex = element.textContent.indexOf(highlight.text);
                    range.setStart(element.firstChild, startIndex);
                    range.setEnd(element.firstChild, startIndex + highlight.text.length);

                    const markElement = document.createElement('mark');
                    markElement.style.backgroundColor = 'yellow';
                    range.surroundContents(markElement);
                }
            }
        });
    });
});
