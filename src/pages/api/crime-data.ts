import { NextApiHandler } from "next";
import { ApiError } from "next/dist/server/api-utils";
import dataSource from "~/data/crime_record.csv";

type CrimeDataRow = {
  [key: string & {}]: unknown;
  _id: number;
  "Reported Date": string;
  "Suburb - Incident": string;
  "Offence Level 1 Description": string;
  "Offence Level 2 Description": string;
  "Offence count": number;
};
type CrimeDataOffencesByRow<K extends keyof CrimeDataRow = keyof CrimeDataRow> = Pick<
  CrimeDataRow,
  K | "Offence count"
>;
export type CrimeDataRowAny<K extends keyof CrimeDataRow = keyof CrimeDataRow> =
  | CrimeDataRow
  | CrimeDataOffencesByRow<K>;
type CrimeData = CrimeDataRow[];
type CrimeDataOffencesBy<K extends keyof CrimeDataRow = keyof CrimeDataRow> = CrimeDataOffencesByRow<K>[];
type CrimeDataAny<K extends keyof CrimeDataRow = keyof CrimeDataRow> = CrimeDataRowAny<K>[];

type WithKeys<T> = { data: T; keys: string[]; allKeys: (keyof CrimeDataRow)[] };

export type CrimeDataResponseBody = WithKeys<CrimeDataAny>;

/**
 * TODO: Optimise with caching
 * TODO: Pagination!
 * TODO: Write wrapper that handles return/throw-ApiError behaviour, auth, etc...
 */
const crimeDataHandler: NextApiHandler<CrimeDataResponseBody> = async (req, res) => {
  const { date, offencesBy } = req.query;
  if (Array.isArray(date)) throw new ApiError(422, "can only filter data by max of 1 date");
  if (Array.isArray(offencesBy)) throw new ApiError(422, "can only aggregate offences by max of 1 column");
  // if (date && offencesBy) throw new ApiError(422, "date & offencesBy parameters cannot be used together");

  let data: CrimeDataAny = dataSource as CrimeData;

  const allKeys = [...new Set(data.flatMap((row) => Object.keys(row)))];

  if (date) {
    const dates = [date].flatMap((d) => new Date(d).toLocaleDateString("en-AU"));

    data = data.filter((row) => {
      const rowDate = row["Reported Date"];
      return rowDate && dates.includes(rowDate);
    });
  }
  // else
  if (offencesBy) {
    const groupMap = new Map<unknown, number>();
    for (const row of data) {
      const groupByValue = row[offencesBy];
      groupMap.set(groupByValue, (groupMap.get(groupByValue) ?? 0) + row["Offence count"]);
    }

    data = Array.from(groupMap).map(([key, value]) => ({
      [offencesBy]: key,
      "Offence count": value,
    })) as CrimeDataOffencesBy<typeof offencesBy>;
  }

  const keys = [...new Set(data.flatMap((row) => Object.keys(row)))];

  res.json({ data, keys, allKeys });
};

export default crimeDataHandler;
