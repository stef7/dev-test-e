import { useMemo } from "react";
import { useAsync } from "react-use";
import { CrimeDataResponseBody } from "~/pages/api/crime-data";

export const EndpointData: React.FC<{ endpoint: string }> = ({ endpoint }) => {
  const data = useAsync(async () => {
    const response = await fetch(endpoint);
    const result: CrimeDataResponseBody = await response.json();
    if ("error" in result) throw new Error(result.error);
    return result;
  }, [endpoint]);

  const keys = useMemo(
    () => data.value && Array.from(new Set(data.value.flatMap((row) => Object.keys(row)))),
    [data.value],
  );

  return data.value?.length && keys ? (
    <table className="rounded text-sm">
      <thead>
        <tr>
          {keys.map((key, colIndex) => (
            <th key={`${colIndex}: ${key}`} scope="col" className="p-2 bg-slate-200 border-2 border-slate-300">
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.value.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {keys.map((key, colIndex) => (
              <td key={`${colIndex}: ${key}`} className="p-2 border-2 border-slate-300">{row[key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>{data.loading ? "Loading..." : data.error ? "Error loading data." : "No data to display."}</p>
  );
};
