import FileUpload from "./file_upload";

export default function FilesUpload({ uploadFiles, setUploadFiles, maxCount }) {
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = { ...uploadFiles };
    for (let item of e.dataTransfer.items) {
      if (item.kind == "file" && item.webkitGetAsEntry().isFile) {
        let f = item.getAsFile();
        let filename = f.name;
        if (Object.keys(files).length < maxCount && !files[filename]) {
          files[filename] = f;
        }
      }
    }
    setUploadFiles(files);
  }

  const handleChange = (e) => {
    e.preventDefault()

    const files = { ...uploadFiles };
    for (let f of e.target.files) {
      let filename = f.name;
      if (Object.keys(files).length < maxCount && !files[filename]) {
        files[filename] = f;
      }
    }
    setUploadFiles(files);
  }

  const uploadFilesList = Object.values(uploadFiles);
  return (
    <div className='w-full mt-3 mb-px flex flex-col bg-white border-2 border-dashed border-slate-600' onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}>
      <input type="file" id="fileInput" onChange={handleChange} className="hidden" multiple />
      {uploadFilesList.map((item, i) => {
        return (
          <FileUpload uploadFiles={uploadFiles} setUploadFiles={setUploadFiles} item={item} key={i} />
        )
      })}
      {uploadFilesList.length < 5 ? <div className={'flex justify-center items-center text-slate-600 ' + (uploadFilesList.length == 0 ? 'h-64' : 'h-32')}>
        <span>拖拽文件到此或 <label htmlFor="fileInput" className="text-sky-500 cursor-pointer">点击选择文件</label></span>
      </div> : ""}
    </div>
  )
}