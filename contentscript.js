// Define the URL parts to block
const blockedURLParts = ["Unblocked","unblocked","UNBLOCKED","proxy","Madalin-Stunt-Cars-2","1v1","1V1","1V1", "slope"];

// Check if any of the blocked URL parts are present in the URL
const url = window.location.href;
const hasBlockedURLPart = blockedURLParts.some(part => url.includes(part));

// If a blocked URL part is found, redirect the page to blocked.html
if (hasBlockedURLPart) {
  chrome.runtime.sendMessage({ redirect: true });
}



// Define the HTML codes to search for
const htmlCodes = ["unblocked","UNBLOCKED","UNBLOCKED", "proxy"];

function scanPageForHTML() {
  const iframes = document.querySelectorAll('iframe');
  for (let i = 0; i < iframes.length; i++) {
    const iframe = iframes[i];
    try {
      if (iframe.contentDocument) {
        const iframeHTML = iframe.contentDocument.documentElement.innerHTML;
        const iframeHasBlockedHTML = htmlCodes.some(code => iframeHTML.includes(code));
        if (iframeHasBlockedHTML) {
          return true;
        }
      }
    } catch (error) {
      console.error(`Error accessing contentDocument of iframe: ${error}`);
    }
  }
  const pageHTML = document.documentElement.innerHTML;
  return htmlCodes.some(code => pageHTML.includes(code));
}

// Check if any of the HTML codes are present on the page or iframes
const pageHasBlockedHTML = scanPageForHTML();

// If any code is found, redirect the page to blocked.html
if (pageHasBlockedHTML) {
  chrome.runtime.sendMessage({ redirect: true });
}

// Listen for file URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url.startsWith('file://')) {
    chrome.tabs.executeScript(tabId, { file: 'contentScript.js' });
  }
});
