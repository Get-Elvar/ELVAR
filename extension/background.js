
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "add-to-elvar",
    title: "Add to Elvar Workflow...",
    contexts: ["link", "page"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "add-to-elvar") {
    const url = info.linkUrl || info.pageUrl;
    if (!url) return;
    
    try {
      const res = await fetch('http://127.0.0.1:31337/workflows');
      if (res.ok) {
        const data = await res.json();
        if (data.workflows && data.workflows.length > 0) {
          // Send to Elvar to show a dialog
          await fetch('http://127.0.0.1:31337/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({action: 'add_to_workflow_dialog', url: url, title: tab.title})
          });
        }
      }
    } catch (e) {
      console.error("Elvar not running", e);
    }
  }
});
