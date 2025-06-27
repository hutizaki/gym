window.getScrollInfo = (element) => {
    return {
        scrollTop: element.scrollTop,
        scrollHeight: element.scrollHeight,
        clientHeight: element.clientHeight
    };
};

window.getElementByMonth = (monthKey) => {
    return document.querySelector(`[data-month="${monthKey}"]`);
};

window.scrollToElement = (element) => {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}; 