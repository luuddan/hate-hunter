
import React, { useState } from "react";
import { Box, Text, Heading } from 'grommet';
import ReactTooltip from "react-tooltip";
import MapChart from "../../components/mapChart"

export const LandingPage = () => {
  const [content, setContent] = useState("");
  return (
    <Box>
      <MapChart setTooltipContent={setContent} />
      <ReactTooltip>{content}</ReactTooltip>
    </Box>
  )
};