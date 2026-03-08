document.addEventListener('DOMContentLoaded', async () => {
  const tabList = document.getElementById('tabList');
  const wfList = document.getElementById('wfList');
  const protectedWfList = document.getElementById('protectedWfList');
  const msg = document.getElementById('msg');
  
  const targetSelect = document.getElementById('targetSelect');
  const saveTypeToggle = document.getElementById('saveTypeToggle');
  const saveTypeLabel = document.getElementById('saveTypeLabel');
  const protectedToggleRow = document.getElementById('protectedToggleRow');
  const isProtectedToggle = document.getElementById('isProtectedToggle');
  const sessionNameInput = document.getElementById('sessionName');
  const tabSearch = document.getElementById('tabSearch');
  const selectAllTabs = document.getElementById('selectAllTabs');
  const deselectAllTabs = document.getElementById('deselectAllTabs');
  
  document.getElementById('tabSave').addEventListener('click', () => {
    document.getElementById('tabSave').classList.add('active');
    document.getElementById('tabLaunch').classList.remove('active');
    document.getElementById('contentSave').classList.add('active');
    document.getElementById('contentLaunch').classList.remove('active');
  });
  document.getElementById('tabLaunch').addEventListener('click', () => {
    document.getElementById('tabLaunch').classList.add('active');
    document.getElementById('tabSave').classList.remove('active');
    document.getElementById('contentLaunch').classList.add('active');
    document.getElementById('contentSave').classList.remove('active');
  });
  
  saveTypeToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
      saveTypeLabel.textContent = 'Save as Workflow';
      targetSelect.style.display = 'block';
      protectedToggleRow.style.display = 'flex';
      sessionNameInput.placeholder = 'Workflow Name (optional)';
    } else {
      saveTypeLabel.textContent = 'Save as Session';
      targetSelect.style.display = 'none';
      protectedToggleRow.style.display = 'none';
      sessionNameInput.placeholder = 'Session Name (optional)';
    }
  });
  
  let currentTabs = [];
  
  chrome.tabs.query({currentWindow: true}, async (tabs) => {
    currentTabs = tabs.filter(t => t.url.startsWith('http'));
    
    if (currentTabs.length === 0) {
      tabList.innerHTML = '<p style="padding: 8px;">No valid tabs found.</p>';
      return;
    }
    
    let groups = {};
    if (chrome.tabGroups) {
      try {
        const g = await chrome.tabGroups.query({windowId: chrome.windows.WINDOW_ID_CURRENT});
        g.forEach(group => { groups[group.id] = group.title || group.color; });
      } catch(e) {}
    }
    
    currentTabs.forEach((t, i) => {
      const div = document.createElement('div');
      div.className = 'tab-item';
      
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = true;
      cb.dataset.idx = i;
      
      const span = document.createElement('span');
      let title = t.title;
      if (t.groupId && t.groupId !== -1 && groups[t.groupId]) {
        title = `[${groups[t.groupId]}] ${title}`;
        t.groupName = groups[t.groupId];
      }
      span.textContent = title;
      span.title = t.url;
      
      div.appendChild(cb);
      div.appendChild(span);
      tabList.appendChild(div);
    });
    
    tabSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const items = tabList.querySelectorAll('.tab-item');
      items.forEach(item => {
        const text = item.querySelector('span').textContent.toLowerCase();
        item.style.display = text.includes(q) ? 'flex' : 'none';
      });
    });
    
    selectAllTabs.addEventListener('click', () => {
      const items = tabList.querySelectorAll('.tab-item');
      items.forEach(item => {
        if (item.style.display !== 'none') {
          item.querySelector('input').checked = true;
        }
      });
    });
    
    deselectAllTabs.addEventListener('click', () => {
      const items = tabList.querySelectorAll('.tab-item');
      items.forEach(item => {
        if (item.style.display !== 'none') {
          item.querySelector('input').checked = false;
        }
      });
    });
  });
  
  try {
    const res = await fetch('http://127.0.0.1:31337/workflows');
    if (res.ok) {
      const data = await res.json();
      wfList.innerHTML = '';
      protectedWfList.innerHTML = '';
      
      let hasNormal = false;
      let hasProtected = false;
      
      if (data.workflows && data.workflows.length > 0) {
        data.workflows.forEach(wf => {
          const wfContainer = document.createElement('div');
          wfContainer.style.marginBottom = '8px';
          
          const btn = document.createElement('button');
          btn.className = 'wf-btn';
          btn.textContent = wf.name;
          
          const urlList = document.createElement('div');
          urlList.style.padding = '8px';
          urlList.style.background = 'var(--surface-hover)';
          urlList.style.borderRadius = '0 0 8px 8px';
          urlList.style.border = '1px solid var(--border)';
          urlList.style.borderTop = 'none';
          urlList.style.maxHeight = '0px';
          urlList.style.overflowY = 'hidden';
          urlList.style.transition = 'max-height 0.3s ease-in-out, padding 0.3s ease-in-out, opacity 0.3s ease-in-out';
          urlList.style.opacity = '0';
          urlList.style.paddingTop = '0';
          urlList.style.paddingBottom = '0';
          urlList.style.borderWidth = '0';
          
          if (!wf.is_protected && wf.urls && wf.urls.length > 0) {
            const wfControls = document.createElement('div');
            wfControls.style.display = 'flex';
            wfControls.style.justifyContent = 'space-between';
            wfControls.style.marginBottom = '8px';
            
            const wfSelectAll = document.createElement('button');
            wfSelectAll.textContent = 'Select All';
            wfSelectAll.style.width = '48%';
            wfSelectAll.style.padding = '4px';
            wfSelectAll.style.fontSize = '11px';
            wfSelectAll.style.background = 'var(--surface)';
            wfSelectAll.style.border = '1px solid var(--border)';
            wfSelectAll.onclick = () => {
              urlList.querySelectorAll('.wf-url-cb-' + wf.name.replace(/[^a-zA-Z0-9]/g, '_')).forEach(cb => cb.checked = true);
            };
            
            const wfDeselectAll = document.createElement('button');
            wfDeselectAll.textContent = 'Deselect All';
            wfDeselectAll.style.width = '48%';
            wfDeselectAll.style.padding = '4px';
            wfDeselectAll.style.fontSize = '11px';
            wfDeselectAll.style.background = 'var(--surface)';
            wfDeselectAll.style.border = '1px solid var(--border)';
            wfDeselectAll.onclick = () => {
              urlList.querySelectorAll('.wf-url-cb-' + wf.name.replace(/[^a-zA-Z0-9]/g, '_')).forEach(cb => cb.checked = false);
            };
            
            wfControls.appendChild(wfSelectAll);
            wfControls.appendChild(wfDeselectAll);
            urlList.appendChild(wfControls);
            
            wf.urls.forEach((url, idx) => {
              const uDiv = document.createElement('div');
              uDiv.className = 'tab-item';
              uDiv.style.borderBottom = 'none';
              uDiv.style.padding = '4px 0';
              
              const uCb = document.createElement('input');
              uCb.type = 'checkbox';
              uCb.checked = true;
              uCb.value = url;
              uCb.className = 'wf-url-cb-' + wf.name.replace(/[^a-zA-Z0-9]/g, '_');
              
              const uSpan = document.createElement('span');
              uSpan.textContent = url;
              uSpan.title = url;
              uSpan.style.fontSize = '12px';
              
              uDiv.appendChild(uCb);
              uDiv.appendChild(uSpan);
              urlList.appendChild(uDiv);
            });
            
            const launchBtn = document.createElement('button');
            launchBtn.textContent = 'Launch Selected';
            launchBtn.style.marginTop = '8px';
            launchBtn.style.padding = '6px';
            launchBtn.onclick = () => {
              const checkboxes = urlList.querySelectorAll('.wf-url-cb-' + wf.name.replace(/[^a-zA-Z0-9]/g, '_') + ':checked');
              const selectedUrls = Array.from(checkboxes).map(cb => cb.value);
              if (selectedUrls.length > 0) {
                launchWorkflow(wf.name, selectedUrls);
              }
            };
            urlList.appendChild(launchBtn);
          } else if (!wf.is_protected) {
            urlList.innerHTML = '<p style="font-size:12px; color:var(--text-muted); text-align:center;">No URLs found.</p>';
          }
          
          btn.onclick = async () => {
            if (wf.is_protected) {
              if (urlList.style.maxHeight === '0px') {
                if (urlList.children.length === 0) {
                  const pwd = prompt('Enter password for ' + wf.name + ':');
                  if (!pwd) return;
                  try {
                    const r = await fetch('http://127.0.0.1:31337/', {
                      method: 'POST',
                      headers: {'Content-Type': 'application/json'},
                      body: JSON.stringify({action: 'get_protected_urls', name: wf.name, password: pwd})
                    });
                    if (r.ok) {
                      const d = await r.json();
                      if (d.status === 'ok' && d.urls) {
                        const wfControls = document.createElement('div');
                        wfControls.style.display = 'flex';
                        wfControls.style.justifyContent = 'space-between';
                        wfControls.style.marginBottom = '8px';
                        
                        const wfSelectAll = document.createElement('button');
                        wfSelectAll.textContent = 'Select All';
                        wfSelectAll.style.width = '48%';
                        wfSelectAll.style.padding = '4px';
                        wfSelectAll.style.fontSize = '11px';
                        wfSelectAll.style.background = 'var(--surface)';
                        wfSelectAll.style.border = '1px solid var(--border)';
                        wfSelectAll.onclick = () => {
                          urlList.querySelectorAll('.wf-url-cb-' + wf.name.replace(/[^a-zA-Z0-9]/g, '_')).forEach(cb => cb.checked = true);
                        };
                        
                        const wfDeselectAll = document.createElement('button');
                        wfDeselectAll.textContent = 'Deselect All';
                        wfDeselectAll.style.width = '48%';
                        wfDeselectAll.style.padding = '4px';
                        wfDeselectAll.style.fontSize = '11px';
                        wfDeselectAll.style.background = 'var(--surface)';
                        wfDeselectAll.style.border = '1px solid var(--border)';
                        wfDeselectAll.onclick = () => {
                          urlList.querySelectorAll('.wf-url-cb-' + wf.name.replace(/[^a-zA-Z0-9]/g, '_')).forEach(cb => cb.checked = false);
                        };
                        
                        wfControls.appendChild(wfSelectAll);
                        wfControls.appendChild(wfDeselectAll);
                        urlList.appendChild(wfControls);
                        
                        if (d.urls.length > 0) {
                          d.urls.forEach(url => {
                            const uDiv = document.createElement('div');
                            uDiv.className = 'tab-item';
                            uDiv.style.borderBottom = 'none';
                            uDiv.style.padding = '4px 0';
                            
                            const uCb = document.createElement('input');
                            uCb.type = 'checkbox';
                            uCb.checked = true;
                            uCb.value = url;
                            uCb.className = 'wf-url-cb-' + wf.name.replace(/[^a-zA-Z0-9]/g, '_');
                            
                            const uSpan = document.createElement('span');
                            uSpan.textContent = url;
                            uSpan.title = url;
                            uSpan.style.fontSize = '12px';
                            
                            uDiv.appendChild(uCb);
                            uDiv.appendChild(uSpan);
                            urlList.appendChild(uDiv);
                          });
                        } else {
                          urlList.innerHTML = '<p style="font-size:12px; color:var(--text-muted); text-align:center;">No URLs found.</p>';
                        }
                        
                        const launchBtn = document.createElement('button');
                        launchBtn.textContent = 'Launch Selected';
                        launchBtn.style.marginTop = '8px';
                        launchBtn.style.padding = '6px';
                        launchBtn.onclick = () => {
                          const checkboxes = urlList.querySelectorAll('.wf-url-cb-' + wf.name.replace(/[^a-zA-Z0-9]/g, '_') + ':checked');
                          const selectedUrls = Array.from(checkboxes).map(cb => cb.value);
                          if (selectedUrls.length > 0) {
                            launchWorkflow(wf.name, selectedUrls);
                          }
                        };
                        urlList.appendChild(launchBtn);
                      } else {
                        showMsg('Incorrect password or error.', true);
                        return;
                      }
                    } else throw new Error();
                  } catch (e) {
                    showMsg('Error connecting to Elvar.', true);
                    return;
                  }
                }
                urlList.style.maxHeight = '200px';
                urlList.style.opacity = '1';
                urlList.style.paddingTop = '8px';
                urlList.style.paddingBottom = '8px';
                urlList.style.borderWidth = '1px';
                urlList.style.overflowY = 'auto';
                btn.style.borderRadius = '8px 8px 0 0';
              } else {
                urlList.style.maxHeight = '0px';
                urlList.style.opacity = '0';
                urlList.style.paddingTop = '0';
                urlList.style.paddingBottom = '0';
                urlList.style.borderWidth = '0';
                urlList.style.overflowY = 'hidden';
                btn.style.borderRadius = '8px';
              }
            } else {
              if (urlList.style.maxHeight === '0px') {
                urlList.style.maxHeight = '200px';
                urlList.style.opacity = '1';
                urlList.style.paddingTop = '8px';
                urlList.style.paddingBottom = '8px';
                urlList.style.borderWidth = '1px';
                urlList.style.overflowY = 'auto';
                btn.style.borderRadius = '8px 8px 0 0';
              } else {
                urlList.style.maxHeight = '0px';
                urlList.style.opacity = '0';
                urlList.style.paddingTop = '0';
                urlList.style.paddingBottom = '0';
                urlList.style.borderWidth = '0';
                urlList.style.overflowY = 'hidden';
                btn.style.borderRadius = '8px';
              }
            }
          };
          
          wfContainer.appendChild(btn);
          wfContainer.appendChild(urlList);
          
          if (wf.is_protected) {
            protectedWfList.appendChild(wfContainer);
            hasProtected = true;
            
            const opt = document.createElement('option');
            opt.value = wf.name;
            opt.textContent = 'Add to: ' + wf.name + ' 🔒';
            targetSelect.appendChild(opt);
          } else {
            wfList.appendChild(wfContainer);
            hasNormal = true;
            
            const opt = document.createElement('option');
            opt.value = wf.name;
            opt.textContent = 'Add to: ' + wf.name;
            targetSelect.appendChild(opt);
          }
        });
      }
      
      if (!hasNormal) wfList.innerHTML = '<p>No workflows found.</p>';
      if (!hasProtected) protectedWfList.innerHTML = '<p>No protected workflows found.</p>';
      
    } else throw new Error();
  } catch (e) {
    wfList.innerHTML = '<p style="color:#ff3b30">Could not connect to Elvar.</p>';
    protectedWfList.innerHTML = '<p style="color:#ff3b30">Could not connect to Elvar.</p>';
  }
  
  function showMsg(text, isError=false) {
    msg.className = 'msg ' + (isError ? 'error' : 'success');
    msg.textContent = text;
    msg.style.display = 'block';
  }
  
  async function saveTabs(closeAfter = false) {
    const checkboxes = tabList.querySelectorAll('input[type="checkbox"]:checked');
    const selectedTabs = Array.from(checkboxes).map(cb => currentTabs[cb.dataset.idx]);
    
    if (selectedTabs.length === 0) return;
    
    const btn = document.getElementById(closeAfter ? 'saveCloseBtn' : 'sendBtn');
    const origText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Saving...';
    
    const isWorkflow = saveTypeToggle.checked;
    const isProtected = isProtectedToggle.checked;
    const target = isWorkflow ? targetSelect.value : '_new_session';
    const customName = sessionNameInput.value.trim();
    const name = (target === '_new_session' || target === '_new_workflow') ? (customName || (isWorkflow ? "New Workflow " : "Browser Session ") + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})) : (customName || target);
    const urls = selectedTabs.map(t => t.url);
    const metadata = selectedTabs.map(t => ({url: t.url, title: t.title, group: t.groupName || null}));
    
    try {
      const r = await fetch('http://127.0.0.1:31337/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          action: 'save_session', 
          target: target, 
          name: name, 
          urls: urls, 
          metadata: metadata,
          save_type: isWorkflow ? 'workflow' : 'session',
          is_protected: isProtected
        })
      });
      if (r.ok) {
        showMsg('Saved successfully!');
        if (closeAfter) {
          chrome.tabs.remove(selectedTabs.map(t => t.id));
        }
        setTimeout(() => window.close(), 1500);
      } else throw new Error();
    } catch (e) {
      showMsg('Error connecting to Elvar.', true);
      btn.disabled = false;
      btn.textContent = origText;
    }
  }
  
  async function launchWorkflow(name, specificUrls = null) {
    const incognito = document.getElementById('extIncognito').checked;
    const newWindow = document.getElementById('extNewWindow').checked;
    try {
      const r = await fetch('http://127.0.0.1:31337/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({action: 'launch_workflow', name: name, incognito: incognito, new_window: newWindow, specific_urls: specificUrls})
      });
      if (r.ok) {
        showMsg('Launched ' + name + '!');
        setTimeout(() => window.close(), 1500);
      } else throw new Error();
    } catch (e) {
      showMsg('Error launching workflow.', true);
    }
  }
  
  document.getElementById('sendBtn').addEventListener('click', () => saveTabs(false));
  document.getElementById('saveCloseBtn').addEventListener('click', () => saveTabs(true));
  
  document.getElementById('closeBtn').addEventListener('click', () => {
    const checkboxes = tabList.querySelectorAll('input[type="checkbox"]:checked');
    const selectedTabs = Array.from(checkboxes).map(cb => currentTabs[cb.dataset.idx]);
    if (selectedTabs.length > 0) {
      chrome.tabs.remove(selectedTabs.map(t => t.id));
      showMsg('Closed selected tabs!');
      setTimeout(() => window.close(), 1000);
    }
  });
});