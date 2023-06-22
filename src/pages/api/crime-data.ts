import { NextApiHandler } from "next";

type ApiError = { error: string };
type OrApiError<T> = T | ApiError;

export type CrimeDataResponseBody = OrApiError<{}>;

/**
 * TODO: Optimise with caching
 * TODO: Pagination!
 * TODO: Write wrapper that handles return/throw-ApiError behaviour, auth, etc...
 */
const handler: NextApiHandler<CrimeDataResponseBody> = async (_req, res) => {
  res.json();
};

export default handler;
