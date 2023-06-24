import type { NextPage } from "next";
import React from "react";

const EndpointData = React.lazy(() => import("~/components/endpoint-data").then((m) => ({ default: m.EndpointData })));

const Home: NextPage = () => {
  return (
    <main data-testid="main">
      <EndpointData endpoint="/api/crime-data" />
    </main>
  );
};
export default Home;
