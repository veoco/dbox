export default function NumPad({ code, setCode, setNavBlock }) {
  const codes = code.split('');

  const handleCopy = (e) => {
    navigator.clipboard.writeText(code);
  }

  const handleGet = (e) => {
    setNavBlock(4);
  }

  return (
    <div className="p-4 pb-2 bg-stone-300 rounded border-4 border-stone-800">
      <div className="font-mono flex justify-center items-center text-5xl sm:text-6xl bg-white border-2 border-stone-800 text-left px-0.5 sm:px-2 pb-2 h-20 min-h-full">
        {codes.map((item, i) => {
          return (
            <span className={"mr-1 last:mr-0 underline" + (i == 4 ? " ml-4" : '')} key={i}>{item}</span>
          )
        })}
      </div>
      <div className='mt-2 flex items-center'>
        <button type="button" className='px-2 py-0.5 bg-rose-300 border-2 border-stone-800 hover:ring' onClick={e => { setCode("") }}>清空</button>
        <button type="button" className='px-2 py-0.5 ml-auto mr-1 bg-sky-300 border-2 border-stone-800 hover:ring' onClick={handleCopy}>复制</button>
        <button type="button" className='px-2 py-0.5 bg-emerald-300 border-2 border-stone-800 hover:ring' onClick={handleGet}>取件</button>
      </div>
    </div>
  )
}