// vnode 虚拟dom对象
// node 真实dom节点


// work in progress 进行中的 fiber
let wipRoot = null;
/**
 * vnode -> node
 *  node节点 插入到 container
 */
function render(vnode, container) {
  // console.log(vnode);
  // const node = createNode(vnode); // 生成真实的dom节点
  // container.appendChild(node);

  wipRoot = {
    type: 'div',
    props: {
      children: {...vnode},
    },
    stateNode: container,
  }

  nextUnitOfWork = wipRoot;
}

/**
 * 根据组件类型的不同创建不同的dom节点
 */
function createNode(workInProgress) {
  const { type, props } = workInProgress;
  const node = document.createElement(type);
  updateNode(node, props);
  return node;
}

/**
 * 原生标签
 */
function updateHostComponent(workInProgress) {
  const { type, props, stateNode } = workInProgress;
  if (!stateNode) {
    workInProgress.stateNode = createNode(workInProgress);
  }

  reconcileChildren(workInProgress, workInProgress.props.children);

  console.log('workInProgress', workInProgress);
}

/**
 * 原生标签属性赋值（除了children属性）
 */
function updateNode(node, nextVal) {
  Object.keys(nextVal)
    // .filter((k) => k !== "children")
    .forEach((k) => {
      if (k === 'children') {
        if (typeof nextVal[k] === 'string') {
          node.textContent = nextVal[k];
        }
      } else {
        node[k] = nextVal[k];
      }
    });
}

/**
 * 函数组件的创建
 */
function updateFunctionComponent(workInProgress) {
  const { type, props } = workInProgress;
  
  const children = type(props);
  reconcileChildren(workInProgress, children);
}

/**
 * 类组件的创建
 */
function updateClassComponent(vnode) {
  const { type, props } = vnode;
  const instance = new type(props);

  const vvnode = instance.render();
  // vnode => node
  const node = createNode(vvnode);
  return node;
}

/**
 * 文本节点 (没有children 已经是叶子节点了)
 */
function updateTextComponent(workInProgress) {
  if (!workInProgress.stateNode) {
    // 真实的DOM节点
    workInProgress.stateNode = document.createTextNode(workInProgress.props);
  }

  return document.createTextNode(workInProgress);
}


/**
 * 协调子节点
 * 这里只考虑了挂载阶段的场景，没有考虑update的场景
*/
function reconcileChildren(workInProgress, children) {
  if (typeof children === 'string' || typeof children === 'number') {
    return ;
  }
  // 单节点 和 多节点diff
  const newChildren = Array.isArray(children) ? children : [children];

  let previousNewFiber = null;
  for (let i = 0; i < newChildren.length; i++) {
    let child = newChildren[i];
    let newFiber = {
      type: child.type,
      props: { ...child.props },
      stateNode: null,
      child: null,
      sibling: null,
      return: workInProgress,
    };

    if (typeof child === 'string') {
      newFiber.props = child;
    }

    if (i === 0) {
      // 第一个子节点
      workInProgress.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }

    // 记录上一个fiber
    previousNewFiber = newFiber;
  }
}

// 下一个单元任务Fiber
let nextUnitOfWork = null;

// fiber js对象
// type 类型
// key
// props 属性
// stateNode 指向DOM节点
// child 下一个子节点
// sibling 下一个兄弟节点
// return 父节点

function performUnitOfWork(workInProgress) {
  // step1 执行任务
  const { type } = workInProgress;
  if (typeof type === "string") {
    // 原生标签节点
    updateHostComponent(workInProgress);
  } else if (typeof type === 'function') {
    updateFunctionComponent(workInProgress);
  } else if (typeof type === 'undefined') {
    updateTextComponent(workInProgress);
  }

  // step2 返回下一个执行任务
  // 王朝的故事
  if (workInProgress.child) {
    return workInProgress.child;
  }

  let nextFiber = workInProgress;
  while (nextFiber) {
    // 如果有兄弟，传给兄弟节点
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
    // B D G C H
  }
}

function workLoop(IdleDeadline) {
  // 有任务 并且 浏览器是有空闲时间的
  while (nextUnitOfWork && IdleDeadline.timeRemaining() > 1) {
    // 1.执行任务 2.返回下一个任务
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  // commit 提交阶段
  if(!nextUnitOfWork && wipRoot)  {
    commitRoot();
  }
}

function commitRoot() {
  commitWorker(wipRoot.child);
  wipRoot = null;
}

function commitWorker(workInProgress) {
  // 提交自己
  if (!workInProgress) {
    return;
  }

  let parentNodeFiber = workInProgress.return;

  // 父fiber不一定有函数组件
  while(!parentNodeFiber.stateNode) {
    parentNodeFiber = parentNodeFiber.return;
  }

  let parentNode = parentNodeFiber.stateNode;

  if (workInProgress.stateNode) {
    // 原生标签，直接appendChild
    parentNode.appendChild(workInProgress.stateNode);
  }
  // 提交子节点
  commitWorker(workInProgress.child);
  // 提交兄弟节点
  commitWorker(workInProgress.sibling);
}

// 浏览器的空闲时间段内调用 workLoop函数
requestIdleCallback(workLoop);

export default { render };
