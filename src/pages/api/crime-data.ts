import { NextApiHandler } from "next";
import data from "../../data/crime_record.csv";

type ApiError = { error: string };
type OrApiError<T> = T | ApiError;

export type CrimeDataResponseBody = OrApiError<Record<string, string>[]>;

/**
 * TODO: filter/group/aggregate by col!
 * 
 * TODO: Optimise with caching
 * TODO: Pagination!
 * TODO: Write wrapper that handles return/throw-ApiError behaviour, auth, etc...
 */
const handler: NextApiHandler<CrimeDataResponseBody> = async (req, res) => {
  res.json(data);
};

export default handler;
