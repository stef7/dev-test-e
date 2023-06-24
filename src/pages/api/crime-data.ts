import { NextApiHandler } from "next";
import dataSource from "~/data/crime_record.csv";

type ApiError = { error: string };
type OrApiError<T> = T | ApiError;

type Data = Record<string, string>[];

type GroupedData<D extends Data = Data> = { groupBy: keyof D[number]; groups: Record<D[number][keyof D[number]], D> };
type DataOrExtensions<D extends Data = Data> = D | GroupedData<D>;

export type CrimeDataResponseBody = OrApiError<DataOrExtensions>;

const pickRowBy = <Row extends Data[number]>(row: Row, pickBy: (keyof Row)[]) =>
  Object.fromEntries(pickBy.map((key) => [key, row[key]!]));

/**
 * TODO: Optimise with caching
 * TODO: Pagination!
 * TODO: Write wrapper that handles return/throw-ApiError behaviour, auth, etc...
 */
const crimeDataHandler: NextApiHandler<CrimeDataResponseBody> = async (req, res) => {
  const { groupBy, pickBy: pickByInitial } = req.query;
  if (Array.isArray(groupBy)) return res.status(422).json({ error: "no more than 1 grouping dimension supported" });

  const pickBy = pickByInitial ? [pickByInitial].flat() : undefined;

  let data: DataOrExtensions = dataSource as Data;

  if (groupBy) {
    data = data.reduce(
      (result, row) => {
        const groupingValue = String(row[groupBy]);

        if (pickBy) row = pickRowBy(row, pickBy);

        (result.groups[groupingValue] ?? (result.groups[groupingValue] = [])).push(row);
        return result;
      },
      { groupBy, groups: {} } as GroupedData,
    );
  } else if (pickBy) {
    data = data.map((row) => pickRowBy(row, pickBy));
  }

  res.json(data);
};

export default crimeDataHandler;
