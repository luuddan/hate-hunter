import React, { useState, useEffect } from 'react';
import { Box, Text, Button, TextInput, InfiniteScroll } from 'grommet';
import { TweetCard } from './elements'
import { Down, Up } from "grommet-icons";
import { DropContainer } from "./dropContainer"
import { useDispatch, useSelector } from "react-redux"
import { fetchCountry, changeCountryState, countryLoading } from '../../redux/slices/country';
import { fetchUsers, changeUserState,usersLoading } from '../../redux/slices/user';


export const ViralTweets = (props) => {
    const { data, view } = props;
    const order = useSelector((state) => state.country.fetchOrder);
    const limit = useSelector((state) => state.country.fetchLimit);
    const sort = useSelector((state) => state.country.fetchSort)
    const orderUser = useSelector((state) => state.user.fetchOrder);
    const limitUser = useSelector((state) => state.user.fetchLimit);
    const sortUser = useSelector((state) => state.user.fetchSort)


    const [orderBool, setOrderBool] = React.useState("DESC");

    const dispatch = useDispatch()
    useEffect(async () => {
        let isMounted = true;
        if (isMounted && view === "country") {
            dispatch(countryLoading(true));
            await dispatch(fetchCountry())
            dispatch(countryLoading(false));
        }
        if (isMounted && view === "user") {
            dispatch(usersLoading(true));
            await dispatch(fetchUsers())
            dispatch(usersLoading(false));
        }
        return () => {
            isMounted = false;
        }
    }, [order, limit, sort,orderUser, limitUser, sortUser])

    const setOrder = (view) => {
        if (view === "country"){
            if (order === "DESC"){
                dispatch(changeCountryState({ key: "fetchOrder", value: "ASC" }))
                setOrderBool("ASC")
            }else{
                dispatch(changeCountryState({ key: "fetchOrder", value: "DESC" })) 
                setOrderBool("DESC")
            }
        }
        if (view === "user"){
            if (orderUser === "DESC"){
                dispatch(changeUserState({ key: "fetchOrder", value: "ASC" }))
                setOrderBool("ASC")
            }else{
                dispatch(changeUserState({ key: "fetchOrder", value: "DESC" })) 
                setOrderBool("DESC")
            }
        }
    }



    return (
        <Box background="white" width="58%" border="border" round="small" gap="xxsmall" >
            <Box direction="row" justify="between" margin={{ vertical: "xsmall", left: "medium", right: "small" }}>
                <Text alignSelf="center" size="large" weight={300}>Viral Tweets</Text>
                <Box direction="row" gap="small" style={{ height: 36 }}>
                    <DropContainer domain={view} />
                    <Button onClick={() => setOrder(view)}>{orderBool==="DESC" ? Down : Up}</Button>
                </Box>
            </Box>
            <Box height="450px" overflow="auto">
                {(data && <InfiniteScroll items={data} step={15}>
                    {(tweet) => (<TweetCard key={tweet.id || tweet.tweet.id} userData={tweet.user} data={tweet.tweet || tweet} abuseData={tweet.abuse} />)}
                </InfiniteScroll>)}
            </Box>
        </Box>
    )
}