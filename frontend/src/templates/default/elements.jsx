import React from "react";
import { Box, Text } from "grommet";
import { Link } from "react-router-dom";



export const AppBar = (props) => (
  <Box
    tag='header'
    direction='row'
    align='center'
    justify='between'
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    elevation='medium'
    style={{ zIndex: '1' }}
  >
      <Box
      direction="row"
      align="center"
      justify="between"
      width="100%"
      pad={{ left: "xlarge", right: "xlarge" }}
      style={{ zIndex: "1" }}
    >
      <Link to="/">
        <Text>
          Home
        </Text>
      </Link>
      <Link to="/user">
        <Text>
          User
        </Text>
      </Link>
      <Link to="/twitterTest">
        <Text>
          Twitter
        </Text>
      </Link>
    </Box>
  </Box>

);
export const Footer = (props) => (
  <Box
    tag="footer"
    direction="row"
    align="center"
    justify="center"
    height="140px"
    border={{
      size: "xsmall",
      side: "top",
    }}
    margin={{ top: "40px" }}
    pad={{ left: "medium", right: "small", vertical: "small" }}
    style={{ zIndex: "1" }}
  >
    <Text>This is a footer</Text>
  </Box>
);
