import React from 'react';
import { Box, DropButton, Text, RadioButtonGroup } from 'grommet';
import { useDispatch, useSelector} from "react-redux"
import { changeUserState } from '../../redux/slices/user';
import {changeCountryState} from '../../redux/slices/country';

const orderByArray = [
    {
        value: "value",
        label: "Abusive Content",
    },
    {
        value: "like_count",
        label: 'Likes',
    },
    {
        value: "retweet_count",
        label: 'Retweets',
    },
    {
        value: "reply_count",
        label: 'Replies',
    },
    {
        value: "created_at",
        label: 'Time',
    }
]

const DropContentCountry = () => {
    const dispatch = useDispatch()
    return (
        <Box pad="small">
            <Box>
                <Text margin={{bottom:"6px"}}><strong>Order by:</strong></Text>
                <RadioButtonGroup
                    name="verticalRadio"
                    options={orderByArray}
                    value={useSelector(state => state.country.fetchSort)}
                    onChange={event =>  dispatch(changeCountryState({key: "fetchSort", value: event.target.value}))}
                />

            </Box>
        </Box>
    )
};
const DropContentUser = () => {
    const dispatch = useDispatch()
    return (
        <Box pad="small">
            <Box>
                <Text margin={{bottom:"6px"}}><strong>Order by:</strong></Text>
                <RadioButtonGroup
                    name="verticalRadio"
                    options={orderByArray}
                    value={useSelector(state => state.user.fetchSort)}
                    onChange={event =>  dispatch(changeUserState({key: "fetchSort", value: event.target.value}))}
                />

            </Box>
        </Box>
    )
};

export const DropContainer = (domain) => {

    const [open, setOpen] = React.useState();
    const onOpen = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    return (
            <Box align="center">
                
                <DropButton
                    label="Order by"
                    open={open}
                    onOpen={onOpen}
                    onClose={onClose}
                    dropContent={domain.domain=="user"?<DropContentUser />:<DropContentCountry/>}
                    dropProps={{ align: { top: 'bottom' } }}
                />
            </Box>
    );
};
