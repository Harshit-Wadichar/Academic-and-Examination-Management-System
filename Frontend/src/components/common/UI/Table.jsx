export default function Table({ columns = [], data = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-2 text-sm text-slate-300">{c.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t border-slate-700 hover:bg-slate-800/40">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 align-top">{c.render ? c.render(row) : row[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
