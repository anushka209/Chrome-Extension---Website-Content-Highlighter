document.addEventListener('DOMContentLoaded', () => {
    loadHighlights();

    document.getElementById('clearHighlights').addEventListener('click', () => {
        chrome.storage.local.clear(() => {
            loadHighlights();
        });
    });
});

function loadHighlights() {
    const highlightsDiv = document.getElementById('highlights');
    highlightsDiv.innerHTML = '';

    chrome.storage.local.get('highlights', (data) => {
        const highlights = data.highlights || [];
        highlights.forEach((highlight) => {
            const highlightElement = document.createElement('div');
            highlightElement.className = 'highlight';
            highlightElement.innerHTML = `<strong>Text:</strong> ${highlight.text}<br><strong>URL:</strong> <a href="${highlight.url}" target="_blank">${highlight.url}</a>`;
            highlightsDiv.appendChild(highlightElement);
        });
    });
}
