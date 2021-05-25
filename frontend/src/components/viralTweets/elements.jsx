import React, { useState } from 'react';
import { Box, Text, Image, Button, Layer } from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRetweet, faReply, faHeart, faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from "react-router-dom";
import { changeUserState } from '../../redux/slices/user';
import { useDispatch} from "react-redux"
import {FaRegAngry,FaBeer} from "react-icons/fa"
import {GiPunch,GiPistolGun} from "react-icons/gi"
import {BiShocked,BiWinkSmile} from "react-icons/bi"
import { scaleLinear } from "d3-scale";

export const TweetCard = (props) => {
    
    const [show, setShow] = React.useState(false);

    const history = useHistory();

    const onClickHandler = (user) => {
        history.push("/user/"+user)
    }

    const colorScale = scaleLinear()
    .domain([-1,0, 1])
    .range(["#f09292", "white","#B80C09"]);
    return (
        <Box
            flex={false}
            direction="column"
            justify="between"
            background={(props.data.sentiment?colorScale(props.data.sentiment):0)}
            style={{borderTop: "1px #e8e8e8 solid"}}
        >

            <Box gap="medium" direction="row" justify="between" align="center" margin="small" >

            <Box gap="small" direction="row" align="center">
                <Box height="50px" width="50px" background="lightgrey" style={{borderRadius: "50%"}} overflow="hidden">
                    <Image fit="contain" src={props.userData && props.userData.profile_image_url} />
                </Box>
                <Button onClick={()=>onClickHandler(props.userData.username)}>
                    <Text weight={500}> @{props.userData.username}</Text>
                </Button>
                <Text weight={300}> {props.data.created_at.slice(0, 10)} </Text>
            </Box>
                <Box direction="row" gap="small">
                {Array.isArray(props.abuseData) && props.abuseData.map(abuse => <AbuseTag data={abuse}/>)}
                </Box>
            </Box>
            <Box margin={{left:"12px",right:"6px"}}overflow="hidden">
                <Text size="small">{props.data.text}</Text>
            </Box>
            <Box direction="row" justify="between" align="center" margin="small">
                <Box />
                <Box gap="medium" direction="row" align="center">
                <Box direction="row" gap="small" align="center">
                    <FontAwesomeIcon icon={faReply} />
                    <Text>{props.data.reply_count}</Text>
                </Box>
                <Box direction="row" gap="small" align="center">
                    <FontAwesomeIcon icon={faHeart} />
                    <Text>{props.data.like_count}</Text>
                </Box>
                <Box direction="row" gap="small" align="center">
                    <FontAwesomeIcon icon={faRetweet} />
                    <Text>{props.data.retweet_count}</Text>
                </Box>
                </Box>
                <Button onClick={() => setShow(!show)}>
                    <FontAwesomeIcon icon={faEllipsisH} />
                </Button>
                {show && (
                    <Layer
                        onEsc={() => setShow(false)}
                        onClickOutside={() => setShow(false)}
                    >
                        <Box >
                            <Text >
                                {props.data.text}
                            </Text>
                        </Box>
                        <Button label="close" onClick={() => setShow(false)} />
                    </Layer>
                )}
            </Box>
        </Box>
    )
};

const AbuseTag = ({data}) => (
    <>
    {data && data.properties && data.properties.text && data.properties.text !== "no_abuse" && (
        <Box background="#B80C09" round="100px" direction="row" gap="xsmall" pad={{horizontal:"xsmall", vertical: "3px"}} align="center">
            {AbuseType[data.properties.text]}
            <Text size="11px">{data.properties.text}</Text>
        </Box>
    )}
    </>
);

const AbuseType = {
    personal_attack: <GiPunch />,
    bigotry: <FaRegAngry />,
    profanity: <BiShocked />,
    sexual_advances: <BiWinkSmile />, 
    criminal_activity: <GiPistolGun />,
    adult_only: <FaBeer />,
    mental_issues: <BiShocked />,
}