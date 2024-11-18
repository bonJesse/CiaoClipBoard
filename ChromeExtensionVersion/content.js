// 创建并添加气泡到页面
function createChatBubble() {
  const chatBubble = document.createElement('div');
  chatBubble.className = 'chat-bubble';
  
  // 添加图标
  const icon = document.createElement('img');
  icon.src = chrome.runtime.getURL('icons/icon.svg');
  icon.alt = 'Chat';
  chatBubble.appendChild(icon);
  
  document.body.appendChild(chatBubble);
  makeDraggable(chatBubble);
}

// 拖拽功能
function makeDraggable(element) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  
  element.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    let newTop = element.offsetTop - pos2;
    let newLeft = element.offsetLeft - pos1;
    
    const maxX = window.innerWidth - element.offsetWidth;
    const maxY = window.innerHeight - element.offsetHeight;
    
    newTop = Math.min(Math.max(0, newTop), maxY);
    newLeft = Math.min(Math.max(0, newLeft), maxX);

    element.style.top = newTop + "px";
    element.style.left = newLeft + "px";
    element.style.bottom = "auto";
    element.style.right = "auto";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// 页面加载完成后创建气泡
document.addEventListener('DOMContentLoaded', createChatBubble); 