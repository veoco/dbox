function NumKey({ code, setCode, num }) {
  const handleClick = (e) => {
    if (code.length < 8) {
      setCode(code + num);
    } else if (code == "DBOX2022") {
      setCode(num);
    }
  }
  return (
    <button type="button" className={"py-5 leading-10 text-5xl text-center bg-stone-300 rounded border-4 border-stone-800" + (num == "0" ? " col-span-2" : "")} onClick={handleClick}>
      {num}
    </button>
  )
}

export default NumKey;