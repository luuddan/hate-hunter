import React from "react";
import { Route } from "react-router-dom";
import { AppBar,Footer } from "./elements";
import { Box } from "grommet";

export const WithSideBarTemplate = (props) => {
  return (
    <div>
      <AppBar />
      <Box  width="calc(100% - 240px)">
        {props.children}
      </Box>
      <Footer/>
    </div>
  );
};
