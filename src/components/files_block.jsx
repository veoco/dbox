import { useState, useEffect } from 'fre'

import { sizeFormat } from "../utils";

function FilesBlock({ code, setCode, setNavBlock }) {
  const [data, setData] = useState({});
  const [status, setStatus] = useState("正在查找");

  useEffect(() => {
    const fetchData = async () => {
      const r = await fetch(`/api/files/${code}`);
      if (r.ok) {
        const res = await r.json();
        setData(res);
      } else if (r.status == 404) {
        setStatus("未找到")
      } else if (r.status == 400) {
        const res = await r.json();
        const detail = res.detail;
        if (detail == 40004) {
          setStatus("错误次数过多，请稍后再试")
        }
      } else if (r.status == 405) {
        setNavBlock(1);
      } else {
        setStatus(`未知错误 ${r.status}`);
      }
    }
    fetchData();
  }, [code]);

  if (Object.values(data).length > 0) {
    const date = new Date(data.created * 1000 + 24 * 3600 * 1000);
    return (
      <div className='mt-2'>
        <p>过期时间 {date.toLocaleString()}</p>
        <ul className="mt-2 bg-white border border-slate-800">
          {data.results.map((item, i) => {
            return (
              <li key={i} className='mx-2 px-1 py-1 border-b border-slate-400 last:border-0'>
                <p>{item.name}</p>
                <ul className="text-sm text-slate-400 flex">
                  <li>文件大小 {sizeFormat(item.size)}</li>
                  <li className="ml-auto text-xs"><a href={`/api/files/${code}/${item.name}`} className="text-sky-300 hover:text-sky-400">下载</a></li>
                </ul>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  return (
    <div className="mt-2">
      {status}
    </div>
  )
}

export default FilesBlock;
