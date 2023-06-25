import crimeDataHandler from "~/pages/api/crime-data";
import { createMocks } from "node-mocks-http";
import data from "~/data/crime_record.csv";
import { NextApiRequest } from "next";

const allKeys = [
  "_id",
  "Reported Date",
  "Suburb - Incident",
  "Postcode - Incident",
  "Offence Level 1 Description",
  "Offence Level 2 Description",
  "Offence Level 3 Description",
  "Offence count",
];

describe(crimeDataHandler.name, () => {
  it("returns plain data as expected with no query params", async () => {
    const { req, res } = createMocks<NextApiRequest>();

    await crimeDataHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ data, keys: allKeys, allKeys });
  });

  it("returns data filtered by date param [formatted per HTML date input]", async () => {
    const { req, res } = createMocks<NextApiRequest>({
      query: {
        date: "2018-07-01",
      },
    });

    await crimeDataHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      data: [
        {
          _id: 2,
          "Reported Date": "01/07/2018",
          "Suburb - Incident": "ADELAIDE",
          "Postcode - Incident": 5000,
          "Offence Level 1 Description": "OFFENCES AGAINST PROPERTY",
          "Offence Level 2 Description": "FRAUD DECEPTION AND RELATED OFFENCES",
          "Offence Level 3 Description": "Other fraud, deception and related offences",
          "Offence count": 1,
        },
      ],
      keys: allKeys,
      allKeys,
    });
  });

  it("returns data of offence cont aggregated by column specified in offencesBy param", async () => {
    const { req, res } = createMocks<NextApiRequest>({
      query: {
        offencesBy: "Offence Level 1 Description",
      },
    });

    await crimeDataHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      data: [
        {
          "Offence Level 1 Description": "OFFENCES AGAINST PROPERTY",
          "Offence count": 104,
        },
        {
          "Offence Level 1 Description": "OFFENCES AGAINST THE PERSON",
          "Offence count": 22,
        },
      ],
      keys: ["Offence Level 1 Description", "Offence count"],
      allKeys,
    });
  });

  it("throws when trying to use date & offencesBy params together", async () => {
    const { req, res } = createMocks<NextApiRequest>({
      query: {
        date: "2019-07-01",
        offencesBy: "Reported Date",
      },
    });

    await crimeDataHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      data: [
        {
          "Reported Date": "01/07/2019",
          "Offence count": 125,
        },
      ],
      keys: ["Reported Date", "Offence count"],
      allKeys,
    });
  });
});
