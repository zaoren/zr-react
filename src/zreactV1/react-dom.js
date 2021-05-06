// vnode 虚拟dom对象
// node 真实dom节点

/**
 * vnode -> node
*  node节点 插入到 container
*/
function render(vnode, container) {
  console.log(vnode);
  const node = createNode(vnode); // 生成真实的dom节点
  container.appendChild(node);
}

/**
 * 根据组件类型的不同创建不同的dom节点
*/
function createNode(vnode) {
  let node;
  const { type } = vnode;

  if (typeof type === 'string') {
    node = updateHostComponent(vnode);
  } else if (typeof type === 'function') {
    // 函数组件
    node = type.prototype.isReactComponent ? updateClassComponent(vnode) : updateFunctionComponent(vnode);
  } else {
    node = updateTextComponent(vnode);
  } 
  return node;
}

/**
 * 原生标签
*/
function updateHostComponent(vnode) {
  const { type, props } = vnode;
  const node =  document.createElement(type);
  updateNode(node, props);
  reconcileChildren(node, props.children);
  return node;
}

/**
 * 原生标签属性赋值（除了children属性）
*/
function updateNode(node, nextVal) {
  Object.keys(nextVal).filter(k => k!== 'children').forEach((k) => {
    node[k] = nextVal[k]
  })
}

/**
 * 函数组件的创建
*/
function  updateFunctionComponent(vnode) {
  const { type, props } = vnode;
  const vvnode = type(props);
  // vnode => node
  const node = createNode(vvnode);
  return node;
}

/**
 * 类组件的创建
*/
function updateClassComponent(vnode) {
  const { type, props } = vnode;
  const instance  = new type(props);
  
  const vvnode = instance.render();
   // vnode => node
   const node = createNode(vvnode);
   return node;
}


/**
 * 文本节点 (没有children 已经是叶子节点了)
*/
function updateTextComponent(vnode) {
  return document.createTextNode(vnode);
}

function reconcileChildren(parentNode, children) {
  const newChildren = Array.isArray(children) ? children : [children];
  for (let i = 0; i < newChildren.length; i++) {
    let child = newChildren[i];
    // vnode
    // vnode -> node, node插入到parentNode
    render(child, parentNode);
  }
}

export default { render }