import type { NextPage } from "next";
import React from "react";
import { EndpointData } from "~/components/endpoint-data";

const Home: NextPage = () => {
  return (
    <main>
      <EndpointData endpoint="/api/crime-data" />;
    </main>
  );
};
export default Home;
