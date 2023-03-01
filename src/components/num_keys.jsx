import NumKey from "./num_key"

export default function NumKeys({ code, setCode }) {
  const nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  const handleClick = (e) => {
    if (code == "________") {
      setCode("");
    } else if (code.length > 0) {
      setCode(code.slice(0, code.length - 1));
    }
  }
  return (
    <div className="mt-2 grid grid-cols-3 gap-2">
      {nums.map((item, i) => {
        return (
          <NumKey code={code} setCode={setCode} num={item} key={i} />
        )
      })}
      <button type="button" className="py-5 leading-10 text-5xl text-center bg-stone-300 rounded border-4 border-stone-800" onClick={handleClick}>←</button>
    </div>
  )
}