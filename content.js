let addSpace = () => {
  let walker = document.createTreeWalker(document.body, 4)
  while( walker.nextNode() ){
    let textNode = walker.currentNode
    let segs = textNode.nodeValue.split('性')
    if( segs.length <= 1 )
      continue
    for(let i=1; i<segs.length; ++i)
      segs[i] = '性' + segs[i]
    if( segs[0]=='' )
      segs.shift()
    let par = textNode.parentNode
    textNode.nodeValue = segs.pop()
    segs.forEach((seg) => {
      par.insertBefore(document.createTextNode(seg), textNode)
      let space = document.createElement('span')
      space.classList.add('spaced-sex')
      space.innerHTML = ' '
      par.insertBefore(space, textNode)
    })
  }
}

let removeSpace = () => {
    document.querySelectorAll('.spaced-sex').forEach((space) => {
      if( space.previousSibling && space.previousSibling.nodeType==3 && space.nextSibling && space.nextSibling.nodeType==3 ){
        space.previousSibling.nodeValue += space.nextSibling.nodeValue
        space.parentNode.removeChild(space.nextSibling)
      }
      space.parentNode.removeChild(space)
    })
}

let observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach(addSpace)
  })
})

chrome.runtime.onMessage.addListener((req, sender, res) => {
  if( req ){
    addSpace()
    observer.observe(document.body, {childList:true, subtree:true});
  }
  else{
    removeSpace()
    observer.disconnect()
  }
})

chrome.runtime.sendMessage({})
