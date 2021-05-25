import React, { useEffect } from 'react';
import { Box, Text, Button, TextInput, Heading, Tip } from 'grommet';
import { HeaderCard } from './elements'
import { LineChart } from '../../components/graphs/lineChart'
import { useDispatch, useSelector } from "react-redux"
import { fetchUsers, changeUserState, usersLoading } from '../../redux/slices/user';
import { ViralTweets } from '../../components/viralTweets'
import { WordCloud } from '../../components/wordCloudComponent'
import { useHistory } from "react-router-dom";
import { AbuseComponent } from '../country/elements/abuseComponent';


export const User = ({ match }) => {

  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");
  const [orderBool,setOrderBool] = React.useState(true);

  const data = useSelector(state => state.user.user);
  const abuseData = useSelector((state) => state.user.user && state.user.user.countOfAbuse)
  const order  = useSelector(state => state.user.fetchOrder);
  const limit  = useSelector(state => state.user.fetchLimit);
  const sort = useSelector(state => state.user.fetchSort)
  const userName = useSelector(state => state.user.userName);

  const history = useHistory();

  const dispatch = useDispatch()

  const searchUser = async () => {
    dispatch(usersLoading(true))
    await dispatch(fetchUsers());
    dispatch(usersLoading(false))
  }


  const initialSearch = async () => {
    await dispatch(changeUserState({ key: "userName", value: match.params.userName }))
    searchUser()
  }

  useEffect(async () => {
        let isMounted = true;
        if(isMounted)
        dispatch(usersLoading(true));
          await dispatch(fetchUsers())
          dispatch(usersLoading(false));
        return () => {
          isMounted = false;
        }
  }, [order,limit,sort])

  useEffect(() => {
    let isMounted = true;
    if (isMounted)
      initialSearch()
    return () => {
      isMounted = false;
    }
    // eslint-disable-next-line
  }, [])
    


  return (
    <Box gap="medium" pad="medium" background="#f6f6f6">
      <Box gap="small" pad="medium" background="white" round="medium" direction="column">
      <TextInput
        id="user-input-id"
        name="user"
        placeholder="Search user"
        value={userName}
        onChange={(e) =>
          dispatch(changeUserState({ key: "userName", value: e.target.value }))
        }
      />
      <Button
        primary
        style={{color:"white"}}
        label="Search for user"
        onClick={searchUser}
      />
      </Box>
      {data.userData && (
        <HeaderCard data={data.userData} botScore={data.botometerScore} />
      )}
      {data && (
        <Box
          width="100%"
          gap="large"
          direction="row"
          justify="between"
          pad="small"
        >
          <AbuseComponent data={abuseData} />
          <ViralTweets data={data.tweetData} view="user"/>
        </Box>
      )}
      {data.trendLine && (
        <Box background="white" width="100%" round="small" pad="small">
          <Tip
            content={
              <Box
                background="white"
                size="xsmall"
                round="small"
                align="center"
                pad="small"
              >
                <Text>Number of tweets in the filtered dataset. </Text>
              </Box>
            }
          >
            <Text textAlign="center" size="large" weight={300}>
              {" "}
              Trendline of Tweets{" "}
            </Text>
          </Tip>

          <Box
            align="center"
            justify="center"
            background="white"
            pad="small"
            margin="small"
          >
            <LineChart
              width={1000}
              height={400}
              margintop={40}
              marginbottom={40}
              color={["#999999"]}
              data={data.trendLine}
            />
          </Box>
        </Box>
      )}
      {/*<Box width="100%" gap="medium" direction="row">
        {data.userData && data.hashtags?.length > 0 ? (
          <WordCloud data={data.hashtags} />
        ) : (
          <Box width="45%" round="small" height="300px">
            <Text alignSelf="center">Hashtags</Text>
          </Box>
        )}
        </Box>*/}
    </Box>
  );
};