import { NextApiHandler } from "next";
import data from "~/data/crime_record.csv";

type ApiError = { error: string };
type OrApiError<T> = T | ApiError;

type Data = Record<string, string>[];

// type GroupedData<D extends Data> = { groupedBy: keyof D; data: D };
// type DataOrExtensions<D extends Data> = D | GroupedData<D>;

export type CrimeDataResponseBody = OrApiError<Data>;

/**
 * TODO: filter/group/aggregate by col!
 *
 * TODO: Optimise with caching
 * TODO: Pagination!
 * TODO: Write wrapper that handles return/throw-ApiError behaviour, auth, etc...
 */
const crimeDataHandler: NextApiHandler<CrimeDataResponseBody> = async (_req, res) => {
  res.json(data);
};

export default crimeDataHandler;
