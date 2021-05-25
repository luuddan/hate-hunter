
import React from "react";
import { Routes } from "./routes/routes";
import { Grommet } from "grommet";
import { theme } from "./theme/theme";
import { WithSideBarTemplate } from "./templates/withSideBar";
import { HashRouter, Router } from "react-router-dom";
import browserHistory from "./routes/history";

const App = () => {
  console.log(process.env.NODE_ENV, process.env.PRODUCTION_API_ENDPOINT, process.env.DEVELOPMENT_API_ENDPOINT)
  return (
    <HashRouter>
      <Grommet theme={theme} themeMode="dark" full>
        <WithSideBarTemplate>
          <Routes />
        </WithSideBarTemplate>
     </Grommet>
    </HashRouter>
  );
};


export default App;
