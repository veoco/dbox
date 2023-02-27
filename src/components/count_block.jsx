import { useState, useEffect } from 'react'

function CountBlock({ code, setCode }) {
  const [count, setCount] = useState(0);
  const blocks = [...Array(400)];

  useEffect(() => {
    const fetchData = async () => {
      const r = await fetch("/api/files/capacity");
      if (r.ok) {
        const res = await r.json();
        setCount(res.count);
      }
    };
    fetchData();
  }, []);

  return (
    <ul className="mt-2 grid grid-cols-20 gap-1">
      {blocks.map((item, i) => {
        return (
          <li className={"w-4 h-4 border border-slate-800" + (i < count ? " bg-sky-300" : " bg-white")}></li>
        )
      })}
    </ul>
  )
}

export default CountBlock;
