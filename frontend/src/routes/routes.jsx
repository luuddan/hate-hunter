import React from "react";
import { Router, Switch } from "react-router-dom";
import { DefaultTemplate } from "../templates/default";
import { paths } from "./paths";
import { LandingPage } from "../views/landingPage/index";
import { CountryView } from "../views/country/index";
import { User } from "../views/user/index";
import  {NotFound}  from "../views/404";

export const Routes = () => (
    <Switch>
      
      <DefaultTemplate path={[paths.USER+"/:userName",paths.USER]} component={User} />
      <DefaultTemplate path={paths.HOME} component={CountryView} />
      {/*<DefaultTemplate path={paths.HOME} component={LandingPage} />*/}
      <DefaultTemplate component={NotFound} />
    </Switch>
);
