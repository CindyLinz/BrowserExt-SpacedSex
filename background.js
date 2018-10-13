let activity = true
chrome.storage.sync.get('status', (items) => {
  if( 'status' in items )
    activity = items.status
  else
    activity = true
  chrome.browserAction.setIcon({path: activity ? 'active.png' : 'inactive.png'})
})

let send = (activity) => {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, activity)
    })
  })
}

chrome.browserAction.onClicked.addListener(() => {
  activity = !activity
  chrome.storage.sync.set({status: activity})
  chrome.browserAction.setIcon({path: activity ? 'active.png' : 'inactive.png'})
  send(activity)
})

chrome.runtime.onMessage.addListener((req, sender, res) => {
  if( sender.tab )
    chrome.tabs.sendMessage(sender.tab.id, activity)
})

send(activity)
