import type { NextPage } from "next";
import React from "react";
import { Accordion } from "~/components/accordion";

const EndpointData = React.lazy(() => import("~/components/endpoint-data").then((m) => ({ default: m.EndpointData })));

const Home: NextPage = () => {
  return (
    <main className="m-auto p-8 max-w-7xl">
      <Accordion controlText="View crime data">
        <EndpointData endpoint="/api/crime-data" />
      </Accordion>
    </main>
  );
};
export default Home;
