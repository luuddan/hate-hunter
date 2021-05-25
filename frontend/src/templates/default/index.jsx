import React from "react";
import { Route } from "react-router-dom";
import { AppBar,Footer } from "./elements";
import { Box } from "grommet";
import { Loader } from "../../components/loader";


export const DefaultTemplate = (props) => {


  return (
      <Box width="100%" margin={{left: "240px"}}>
        <Loader/>
        <Route {...props} />
      </Box>
  );
};
