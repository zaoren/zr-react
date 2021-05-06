import './App.css';
import React, {useMemo, useState}from 'react';

function App() {
  const [num, setStr] = useState(1);
  const [len, setLen] = useState(1);
  const [height, setHeight] = useState(1);
  // const len = 10000;
  useMemo(() => {console.log('num + len', num + len)}, [num, len])
  return (
    <>
      <div onClick={() => {setStr(num + 1)}}> {num}</div>
      <div onClick={() => {setLen(len + 1)}}> {len}</div>
      <div onClick={() => {setHeight(height + 1)}}> {height}</div>
    </>
  );
}

export default App;
