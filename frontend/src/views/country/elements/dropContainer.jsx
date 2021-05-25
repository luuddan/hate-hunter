import React from 'react';
import { Box, DropButton, Text, RadioButtonGroup } from 'grommet';
import { useDispatch, useSelector} from "react-redux"
import { changeTopUsersState } from '../../../redux/slices/topUsers';

const orderByArray = [
    {
        value: "topScore",
        label: 'Top score',
    },
    {
        value: "tweet_count",
        label: 'Tweet count',
    },
    {
        value: "like_count",
        label: 'Likes',
    },
    {
        value: "reply_count",
        label: 'Replies',
    },
    {
        value: "quote_count",
        label: 'Quoted',
    },
    {
        value: "retweet_count",
        label: "Retweets",
    }
]

const DropContent = () => {
    const dispatch = useDispatch()
    return (
        <Box pad="small">
            <Box>
                <Text margin={{bottom:"6px"}}><strong>Order by:</strong></Text>
                <RadioButtonGroup
                    name="verticalRadio"
                    options={orderByArray}
                    value={useSelector(state => state.topUsers.orderBy)}
                    onChange={event =>  dispatch(changeTopUsersState({key: "orderBy", value: event.target.value}))}
                />

            </Box>
        </Box>
    )
};


export const DropContainer = () => {

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
                    dropContent={<DropContent/>}
                    dropProps={{ align: { top: 'bottom' } }}
                />
            </Box>
    );
};
