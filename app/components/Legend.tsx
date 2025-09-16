export const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {payload.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="flex items-center gap-2">
          <span
            className="block w-4 h-1 rounded"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-700 text-sm">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}