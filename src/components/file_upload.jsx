import { sizeFormat } from "../utils";

export default function FileUpload({ uploadFiles, setUploadFiles, item }) {
  const handleClick = (e) => {
    const files = { ...uploadFiles };
    delete files[item.name]
    setUploadFiles(files);
  }

  return (
    <div className='mx-2 px-1 py-1 border-b border-slate-400 last:border-0'>
      <p>{item.name}</p>
      <ul className="text-sm text-slate-400 flex">
        <li>文件大小 {sizeFormat(item.size)}</li>
        <li className="ml-auto text-xs"><button type="button" onClick={handleClick} className="text-rose-300 hover:text-red-400">移除</button></li>
      </ul>
    </div>
  )
}