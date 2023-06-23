import crimeDataHandler from "~/pages/api/crime-data";
import { createMocks } from "node-mocks-http";
import data from "~/data/crime_record.csv";

describe(crimeDataHandler.name, () => {
  it("returns plain data as expected with no query params", async () => {
    const { req, res } = createMocks();

    await crimeDataHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual(data);
  });
});
