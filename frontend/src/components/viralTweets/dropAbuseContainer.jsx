import React from 'react';
import { Box, DropButton, Text, CheckBoxGroup } from 'grommet';
import { useDispatch, useSelector} from "react-redux"
import { changeUserState } from '../../redux/slices/user';
import {changeCountryState} from '../../redux/slices/country';
import {AbuseArray} from '../../services/utils/abuseArray'

const DropContent = () => {
    const dispatch = useDispatch()
    const values = useSelector(state => state.country.abuseFilters)
    const onClick = ({ value: nextValue, option }) => dispatch(changeCountryState({key: "abuseFilters", value: nextValue}))
    return (
        <Box pad="small">
            <Box>
                <Text margin={{bottom:"6px"}}><strong>Filter by:</strong></Text>
                <CheckBoxGroup
                    name="verticalCheckBox"
                    options={AbuseArray}
                    value={values}
                    onChange={onClick}
                />

            </Box>
        </Box>
    )
};

export const DropAbuseContainer = () => {

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
                    label="Filter by"
                    open={open}
                    onOpen={onOpen}
                    onClose={onClose}
                    dropContent={<DropContent/>}
                    dropProps={{ align: { top: 'bottom' } }}
                />
            </Box>
    );
};
