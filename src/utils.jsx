function sizeFormat(size) {
  let num = size;
  for (let unit of ["", "K", "M"]) {
    if (Math.abs(num) < 1000.0) {
      return `${num.toFixed(1)} ${unit}B`
    }
    num /= 1000.0
  }
  return `${num.toFixed(1)} GB`
}

async function mapErrorResult(r) {
  if (r.status == 400) {
    const res = await r.json();
    const detail = res.detail;
    switch (detail) {
      case "40001": alert("未找到"); break;
      case "40002": alert("文件过多"); break;
      case "40003": alert("文件过大"); break;
      case "40004": alert("流量限制"); break;
      case "40005": alert("流量限制"); break;
      case "40006": alert("非法名称"); break;
      case "40007": alert("非法文件"); break;
      default: alert(`参数错误`);
    }
  } else {
    alert(`未知错误 ${r.status}`);
  }
}

function blobToBuffer(blob){
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.readAsArrayBuffer(blob)
  })
}

function blobToText(blob){
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.readAsText(blob)
  })
}

export { sizeFormat, mapErrorResult, blobToBuffer, blobToText };