
//  ----------------------------------------   手写    ----------------------------------------- //  
// import React, { Component, useState } from 'react';
// import ReactDOM from 'react-dom';
// import ReactDOM from './zreactV1/react-dom';
// import ReactDOM from './zreactV2/react-dom';
import ReactDOM from './zreactV3/react-dom';
import Component from './zreactV3/component';
import App from './App';

// 函数组件
function FunctionComponent(props) {
  const [count , setCount] = useState(0)
  return (
    <div style={{color: 'red', marginLeft: `${count}px`}}>
      <span>函数组件-{props.name}</span>
      <h2 style={{color: 'red'}} onClick={() => {setCount(count + 1)}}> {count} </h2>
    </div>
  )
}

// 类组件
class ClassComponent extends Component {
  render() {
    return (
      <div>
        <span>类组件-{this.props.name}</span>
      </div>
    )
  }
}

const jsx = (
  <div> 
    <h1> 枣仁React17学习 </h1>
    <a href="https://www.baidu.com">百度</a>
    <FunctionComponent name="function"/>
    <ClassComponent name="class"/>
  </div>
)

console.error('app', <App />);
console.error('FunctionComponent', <FunctionComponent />);
console.error('ClassComponnet', <ClassComponent />);
console.error('jsx', jsx);

ReactDOM.render(
  <App />,
  document.getElementById('root')
)