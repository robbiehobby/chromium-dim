import{d as c}from"./chrome.js";async function o(e,t=null){if(t!=="reset"&&e.website.hostname==="*")return;const a=await chrome.tabs.query({url:`*://${e.website.hostname}/*`});a&&await Promise.all(a.map(async r=>{try{if(!r.id)return;await chrome.tabs.sendMessage(r.id,{action:"update",payload:{settings:e,type:t}})}catch{}}))}async function i(e){let t;e?t=await chrome.tabs.get(e):t=(await chrome.tabs.query({currentWindow:!0,active:!0})).pop();const a=structuredClone(c),r=await chrome.storage.local.get(["_global"]);if(r._global&&(a.global=r._global),!(t!=null&&t.id)||!t.url)return a;try{await chrome.scripting.executeScript({target:{tabId:t.id},func:()=>!0})}catch{return a}const{hostname:s}=new URL(t.url);a.website.hostname=s;const n=await chrome.storage.local.get([s]);return n[s]&&(a.website=n[s]),a}async function l(e){if((e.website.hostname==="*"||e.website.mode==="global")&&await chrome.storage.local.set({_global:e.global}),e.website.hostname==="*")return;const t=await i();await chrome.storage.local.set({[t.website.hostname]:e.website}),await o(e)}chrome.runtime.onMessage.addListener((e,t,a)=>{if(t.id===chrome.runtime.id)switch(e.type){case"getSettings":return i().then(r=>a(r)),!0;case"saveSettings":l(e.payload);break;case"resetSettings":chrome.storage.local.clear().then(()=>o(c,"reset"));break}});chrome.commands.onCommand.addListener(async e=>{if(e!=="toggle-dimmer")return;const t=await i();t&&(t.website.on=!t.website.on,await l(t))});chrome.tabs.onUpdated.addListener(async(e,t)=>{t.status==="complete"&&await o(await i(e))});chrome.tabs.onActivated.addListener(async e=>{e.tabId&&await o(await i(e.tabId),"activated")});
