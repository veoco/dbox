import useSWR from 'swr'

import { sizeFormat } from "../utils";

function FilesBlock({ code }) {
  const { data, error, isLoading } = useSWR(`/api/files/${code}`);

  if (error) return <div className="mt-2">加载失败</div>;
  if (isLoading) return <div className="mt-2">正在加载</div>;

  if (!data.results) {
    return (
      <div className='mt-2'>
        未找到
      </div>
    )
  }

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
                <li className="ml-auto text-xs"><a href={item.url} className="text-sky-300 hover:text-sky-400">下载</a></li>
              </ul>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default FilesBlock;
