import { useState } from 'react'
import CryptoJS from 'crypto-js';
import sha256 from 'crypto-js/sha256';
import md5 from 'crypto-js/md5'

import FilesUpload from './files_upload';
import { sizeFormat, mapErrorResult, blobToBuffer, blobToText } from '../utils';

export default function UploadBlock({ setCode }) {
  const [uploadFiles, setUploadFiles] = useState({});
  const [level, setLevel] = useState(1);
  const [token, setToken] = useState("");

  let filesSize = 0;
  let filesCount = 0;
  for (let f of Object.values(uploadFiles)) {
    filesSize += f.size;
    filesCount += 1;
  }

  const maxCount = 5;
  const maxSize = level == 1 ? 100 * 1000 * 1000 : 1000 * 1000 * 1000;
  const canUpload = (0 < filesCount && filesCount <= maxCount && 0 < filesSize && filesSize < maxSize);

  const handleUpload = async (e) => {
    e.target.disabled = true;
    e.target.textContent = "上传中...";

    let boxData = [];
    for (let f of Object.values(uploadFiles)) {
      boxData.push({ "name": f.name, "size": f.size })
    }
    let boxHeader = {
      'Content-Type': 'application/json',
    };
    if (token) {
      boxHeader['Authorization'] = `Bearer ${token}`;
    }
    const box_r = await fetch("/api/files/", {
      method: 'POST',
      headers: boxHeader,
      body: JSON.stringify(boxData)
    })
    if (!box_r.ok) {
      await mapErrorResult(box_r);
      e.target.textContent = "寄件";
      e.target.disabled = false;
      return;
    }
    const res = await box_r.json();
    const code = res.code;
    const storage = res.storage
    const uploads = res.uploads
    const blockSize = 10 * 1024 * 1024;

    if (storage == "filesystem") {
      for (let f of Object.values(uploadFiles)) {
        const filename = f.name;
        let filesize = f.size;

        let offset = 0;
        let positions = [];
        while (filesize > 0) {
          positions.push(offset)
          filesize -= blockSize;
          offset += blockSize;
        }
        if (filesize == 0) {
          positions.pop()
        }

        let hasher = CryptoJS.algo.SHA256.create()
        let progress = 1;
        for (let pos of positions) {
          e.target.textContent = `正在上传 ${filename} 的 ${progress}/${positions.length}`;
          let end;
          if ((pos + blockSize) <= f.size) {
            end = pos + blockSize;
          } else {
            end = f.size
          }

          let chunk = f.slice(pos, end);

          let buffer = await blobToBuffer(chunk);
          let wordArray = CryptoJS.lib.WordArray.create(buffer);

          hasher.update(wordArray);
          let hash = sha256(wordArray).toString();

          const formData = new FormData();
          formData.append("offset", pos);
          formData.append("sha256", hash);
          formData.append("file", chunk, filename);

          const r = await fetch(`/api/files/${code}/${filename}`, {
            method: 'POST',
            body: formData
          })
          if (!r.ok) {
            await mapErrorResult(r);
            e.target.textContent = "寄件";
            e.target.disabled = false;
            return;
          }
          progress += 1;
        }

        const data_sha256 = hasher.finalize().toString();
        const data = { "sha256": data_sha256, "extra": {} };
        const r = await fetch(`/api/files/${code}/${filename}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        if (!r.ok) {
          await mapErrorResult(box_r);
          e.target.textContent = "寄件";
          e.target.disabled = false;
          return;
        }
      }

      const r = await fetch(`/api/files/${code}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!r.ok) {
        await mapErrorResult(box_r);
        return;
      }
      setCode(`${code}`);
    } else if (storage == "s3remote") {
      for (let f of Object.values(uploadFiles)) {
        const filename = f.name;
        let filesize = f.size;
        const uploadUrls = uploads[filename]

        let offset = 0;
        let positions = [];
        while (filesize > 0) {
          positions.push(offset)
          filesize -= blockSize;
          offset += blockSize;
        }
        if (filesize == 0) {
          positions.pop()
        }

        let progress = 1;
        const parts = [];
        for (let pos of positions) {
          e.target.textContent = `正在上传 ${filename} 的 ${progress}/${positions.length}`;
          let end;
          if ((pos + blockSize) <= f.size) {
            end = pos + blockSize;
          } else {
            end = f.size
          }

          let chunk = f.slice(pos, end);

          let buffer = await blobToBuffer(chunk);
          let wordArray = CryptoJS.lib.WordArray.create(buffer);

          let hash = md5(wordArray).toString();
          const r = await fetch(uploadUrls[progress-1], {
            method: 'PUT',
            body: buffer
          })
          if (!r.ok) {
            await mapErrorResult(r);
            e.target.textContent = "寄件";
            e.target.disabled = false;
            return;
          }
          const etag = r.headers.get("ETag").slice(1, -1);
          if (etag != hash) {
            alert("文件上传失败")
            e.target.textContent = "寄件";
            e.target.disabled = false;
            return;
          }
          parts.push({ "ETag": etag, "PartNumber": progress })
          progress += 1;
        }

        const uploadUrl = uploadUrls[0];
        const matches = /uploadId=(.+?)&/g.exec(uploadUrl)
        const uploadId = matches[1];

        const data = { "sha256": "", "extra": { "Parts": parts, "UploadId": uploadId } };
        const r = await fetch(`/api/files/${code}/${filename}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        if (!r.ok) {
          await mapErrorResult(r);
          e.target.textContent = "寄件";
          e.target.disabled = false;
          return;
        }
      }

      const r = await fetch(`/api/files/${code}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!r.ok) {
        await mapErrorResult(box_r);
        return;
      }
      setCode(`${code}`);
    }

    e.target.textContent = "寄件";
    e.target.disabled = false;
  }

  const handleCard = async (e) => {
    for (let filename in uploadFiles) {
      if (filename.endsWith(".jpg")) {
        let file = uploadFiles[filename];
        if (file.size > 1024) {
          let chunk = file.slice(-1024, file.size);
          let raw = await blobToText(chunk);
          let file_token = raw.trim();

          let r = await fetch("/api/cards/detail", {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${file_token}`,
            }
          })
          if (r.status == 200) {
            const res = await r.json();
            let newFiles = { ...uploadFiles };
            delete newFiles[filename]
            setLevel(res.level);
            setToken(file_token);
            setUploadFiles(newFiles);
            alert(`有效次数：${res.count}`)
            return;
          } else {
            alert("无效密钥");
            return;
          }
        }
      }
    }
    alert("未找到密钥");
    return;
  }

  const handleChangeCard = async (e) => {
    const r = await fetch("/api/cards/renew", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
    if (r.status == 200) {
      const res = await r.json();
      const new_token = res.token;
      const text = `${new_token}`.padStart(1024, ' ')

      const img_r = await fetch("/img/base.jpg")
      if (img_r.status == 200) {
        const img = await img_r.blob();
        const new_img = new Blob([img, text], { type: "image/jpeg" })

        let a = document.createElement('a');
        document.body.appendChild(a)
        let url = window.URL.createObjectURL(new_img);
        a.href = url;
        a.download = "dbox_cf.jpg";
        a.target = '_blank'
        a.click();
        a.remove()
        window.URL.revokeObjectURL(url);
        return;

      } else {
        alert("网络错误")
        return;
      }
    } else {
      alert("无效密钥")
      return;
    }
  }

  return (
    <div className="mt-2">
      <FilesUpload uploadFiles={uploadFiles} setUploadFiles={setUploadFiles} maxCount={maxCount} />
      <div className='text-slate-800 py-2 text-xs'>
        <span>文件数 {filesCount} / {maxCount} ( 容量 {sizeFormat(filesSize)} / {level == 1 ? "100MB" : "1GB"})</span>
        <button className='ml-1 border bg-white p-1 rounded disabled:cursor-not-allowed cursor-pointer disabled:bg-stone-100' type='button' onClick={handleCard} disabled={!canUpload}>使用密钥</button>
        <button className='ml-1 border bg-white p-1 rounded disabled:cursor-not-allowed cursor-pointer disabled:bg-stone-100' type='button' onClick={handleChangeCard} disabled={level == 1}>刷新密钥</button>
      </div>
      <button type='button' onClick={handleUpload} className="w-full mt-1 mb-8 border border-slate-600 py-3 bg-white cursor-pointer disabled:cursor-not-allowed disabled:bg-stone-100" disabled={!canUpload}>寄件</button>
    </div>
  )
}