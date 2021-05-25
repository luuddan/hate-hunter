import React, {useEffect} from "react";
import { Box} from 'grommet';
import { SearchField } from "./elements/search";
import { LineChart } from "../../components/graphs/lineChart";
import { BarChart } from "../../components/graphs/barChart";
import { ViralTweets } from "../../components/viralTweets";
import { useDispatch, useSelector} from "react-redux"
import {TopUsers} from './elements/topUsers'
import { fetchCountry, changeCountryState,countryLoading } from '../../redux/slices/country';
import { fetchTopUsers } from '../../redux/slices/topUsers';
import { fetchHashtagTrendline, fetchTopHashtags,changeHashtagState } from '../../redux/slices/hashtagChart';
import { WordCloud } from '../../components/wordCloudComponent'
import { HashtagChart } from "../../components/hashtagChart";
import {InfoComp} from "./elements/infoComp"
import {LanguageComp} from "./elements/languageComp"
import { AbuseComponent } from "./elements/abuseComponent";
import { TrendlineComponent } from "./elements/trendlineComponent"

export const CountryView = () => {
  const data = useSelector((state) => state.country.country);
  const abuseData = useSelector((state) => state.country.country && state.country.country.countOfAbuse)
  const graph = useSelector((state) => state.hashtagChart.graph);
  const hashtags = useSelector((state) => state.hashtagChart.hashtags);
  const topUsersData = useSelector((state) => state.topUsers.topUsers);
  const topUsersOrderBy = useSelector((state) => state.topUsers.orderBy);
  const dispatch = useDispatch();
  
console.log("----topUser result---",topUsersData)
  const handleHashtagGraphClick = async (value, name) => {
    dispatch(changeHashtagState({name: name, checked: value}))
  }
  const initialSearch = async () => {
    dispatch(fetchCountry());
    dispatch(fetchTopHashtags());
    await dispatch(fetchTopUsers());
  }

  useEffect(async () => {
    let isMounted = true;
    if (isMounted) {
      dispatch(countryLoading(true));
      await initialSearch();
      dispatch(countryLoading(false));
    }
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      dispatch(fetchHashtagTrendline());
    }
    return () => {
      isMounted = false;
    };
  }, [hashtags]);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      dispatch(fetchTopUsers());
    }
    return () => {
      isMounted = false;
    };
  }, [topUsersOrderBy]);

  return (
    <Box
      align="start"
      justify="center"
      gap="medium"
      pad="small"
      width="100%"
      background="#f6f6f6"
    >
      
      <SearchField />
      {data && data.countOfTweets && data.userCount && data.avgAndCountOfSentiment && data.countOfAbuse &&(
        <Box width="100%" height="100px" direction="row" justify="between" >
          <InfoComp title="Total Tweets" data={data.countOfTweets}/>
          <InfoComp title="Total Authors" data={data.userCount}/>
          <InfoComp title="Average Tone" data={Math.round(data.avgAndCountOfSentiment[0].avgSentiment * 100) + "%"}/>
          <InfoComp title="Analyzed Tweets" data={data.avgAndCountOfSentiment[0].count}/>
        </Box>
        )}
        {data && (
          <Box width="100%" gap="large" direction="row" justify="between" pad="small">
                {abuseData &&(
                  <AbuseComponent data={abuseData}/>
      )}
        <ViralTweets data={data.abuseTweets} view="country" />
        </Box>)}
      {data && data.trendLine && (
        <TrendlineComponent
          data={data.trendLine}
        />
      )}
      <Box background="white" round="small" width="100%" pad="small">
        <HashtagChart graph={graph} hashtags={hashtags} onChange={handleHashtagGraphClick} />
      </Box>
      <Box width="100%" gap="medium" direction="row" justify="between" pad="small">
        {data && (
          <>
          <Box direction="column" gap="medium" width="45%"  margin={{right:"44px"}}>
          {data && data.languageCount &&(
            <LanguageComp data={data.languageCount}/> 
          )}
          <WordCloud data={data.wordcloud} />
            
          </Box>
          <Box width="50%">
          <TopUsers data={topUsersData.value.topUser} orderBy={topUsersOrderBy}/>
          </Box>
          </>
        )}
      </Box>
      
    </Box>
  );
};
