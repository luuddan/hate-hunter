import React from "react";
import { Box, Button, Image, Text } from "grommet";
import { Link } from "react-router-dom";
import { User } from "grommet-icons";
import { FaBroadcastTower, FaRegCompass, FaHome } from "react-icons/fa"
import { BiUserCircle } from "react-icons/bi"
import { IconContext } from "react-icons";
import CRDLogo from "../../components/images/crd-logo.png"
import WhiteCRDLogo from "../../components/images/crd-logo-white.png"

const MenuItem = (props) => (
  <Link to={props.link}>
  <Box direction="row" color="white" align="center" justify="center" gap="large" style={{height: "40px"}}>
  {props.icon}
  <Box style={{width: "100px"}}>
  <Text color="white" weight="500">
    {props.title}
  </Text>
  <Text color="white" weight="300">{props.subTitle}</Text>
  </Box>
</Box>
</Link>
)



export const AppBar = (props) => (
  <IconContext.Provider value={{ color: "white", className: "global-class-name" }}>
  <Box
    direction='column'
    align='center'
    pad={{ right: 'small', vertical: 'medium' }}
    style={{ zIndex: '1', top: '0', position:"fixed"}}
    width="240px"
    height="100vh"
    background="#212530"
  >
    <Box pad={{top: "medium"}} direction="column" direction="column" align="start" justify="center" gap="medium">
      <Box direction="row" direction="row" align="center" justify="center" gap="medium">
        <FaBroadcastTower />
        <Text ><b>Hate</b>Hunter</Text>
      </Box>
      <Box gap="small" align="center">
        <Text weight={300}>In collaboration with</Text>
        <Image style={{maxWidth: "90px"}} src={CRDLogo} />
      </Box>
    </Box>
      <Box
      direction="column"
      align="center"
      justify="between"
      width="100%"
      pad={{ top:"xlarge"}}
      style={{ zIndex: "1" }}
      gap="medium"
    >
      <MenuItem 
        link="/twitterTest"
        icon={<FaRegCompass />}
        title="General"
        subTitle="Analysis"
      />
      <MenuItem 
        link="/user"
        icon={<BiUserCircle />}
        title="User"
        subTitle="Analysis"
      />
    </Box>
  </Box>
  </IconContext.Provider>
);
export const Footer = (props) => (
  <Box
    tag="footer"
    direction="row"
    align="center"
    justify="between"
    height="140px"
    border={{
      size: "xsmall",
      side: "top",
    }}
    background="white"
    pad={{ left: "260px", right: "100px", vertical: "small" }}
    style={{ zIndex: "3" }}
    gap="medium"
  >
      <Image style={{maxHeight:"65px"}} src={WhiteCRDLogo} />
      <Box height="80px">
        <Text weight="bold">Engage</Text>
        <Text weight={300}>Send us a gift</Text>
      </Box>
      <Box style={{maxWidth: "300px"}} height="80px">
        <Text weight="bold">About</Text>
        <Text weight={300}>Text about the platform, maybe a link to the open source repository.</Text>
      </Box>
  </Box>
);
