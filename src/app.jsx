import { useState } from 'react'

import NumPad from "./components/num_pad"
import NumKeys from './components/num_keys';
import UploadBlock from './components/upload_block';
import CountBlock from './components/count_block';
import FilesBlock from './components/files_block';


function App() {
  const [navBlock, setNavBlock] = useState(1);
  const [code, setCode] = useState("DBOX2022");

  if (window.location.hash && window.location.hash.length > 0) {
    let matches = /\d{8}/g.exec(window.location.hash)
    if (matches && matches.length > 0) {
      if (code == "DBOX2022") {
        setCode(matches[0]);
      }
    }
  }

  const handlePaste = async (e) => {
    e.clipboardData.items[0].getAsString(input => {
      const matches = /\d{8}/g.exec(input);
      if (matches && matches.length > 0) {
        const matchedCode = matches[0];
        if (matchedCode != code) {
          setCode(matchedCode);
        }
      }
    });
  }

  document.addEventListener('paste', handlePaste);

  return (
    <main className="w-full h-screen flex flex-col items-center">
      <div className="w-full max-w-sm px-2 mt-4 sm:mt-36">
        <NumPad code={code} setCode={setCode} setNavBlock={setNavBlock} />
        <nav className="w-full flex mt-2 leading-8 border-b border-stone-800">
          <button type="button" className={"w-1/3" + (navBlock == 1 ? " bg-slate-100 border border-b-0 border-stone-800" : "")} onClick={e => { setNavBlock(1) }}>取件</button>
          <button type="button" className={"w-1/3" + (navBlock == 2 ? " bg-slate-100 border border-b-0 border-stone-800" : "")} onClick={e => { setNavBlock(2) }}>寄件</button>
          <button type="button" className={"w-1/3" + (navBlock == 3 ? " bg-slate-100 border border-b-0 border-stone-800" : "")} onClick={e => { setNavBlock(3) }}>容量</button>
        </nav>
        {navBlock == 1 ? <NumKeys code={code} setCode={setCode} /> : ""}
        {navBlock == 2 ? <UploadBlock code={code} setCode={setCode} /> : ""}
        {navBlock == 3 ? <CountBlock /> : ""}
        {navBlock == 4 ? <FilesBlock code={code} setCode={setCode} setNavBlock={setNavBlock} /> : ""}
      </div>
      <div className='text-slate-400 text-xs text-center pt-8 sm:mt-auto pb-4'>
        <span>开源项目: </span>
        <a className='underline' href="https://github.com/veoco/dbox">网页端</a>
        <a className='underline ml-2' href="https://github.com/veoco/fbox">服务端</a>
      </div>
    </main>
  )
}

export default App;
