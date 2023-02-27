import useSWR from 'swr'

export default function CountBlock() {
  const { data } = useSWR(`/api/files/capacity`);

  let count = 0;
  if (data) count = data.count;

  const blocks = [...Array(400)];

  return (
    <ul className="mt-2 grid grid-cols-20 gap-1">
      {blocks.map((item, i) => {
        return (
          <li className={"w-4 h-4 border border-slate-800" + (i < count ? " bg-sky-300" : " bg-white")} key={i}></li>
        )
      })}
    </ul>
  )
}
