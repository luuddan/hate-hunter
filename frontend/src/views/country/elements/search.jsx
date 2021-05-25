import React, { useState } from "react";
import { Box,Text,TextInput,Button } from "grommet";
import { useDispatch, useSelector} from "react-redux"
import {fetchCountry,changeCountryKeyHashUserState, changeCountryState, analyzeTweets, countryLoading} from '../../../redux/slices/country';
import Autocomplete from '@material-ui/lab/Autocomplete';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { TextField } from "@material-ui/core";
import { Languages } from "../../../services/utils/languages";
import { AbuseArray } from "../../../services/utils/abuseArray"
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import { fetchTopHashtags } from "../../../redux/slices/hashtagChart";
import { fetchTopUsers } from "../../../redux/slices/topUsers";


export const SearchField = () => {
    const dispatch = useDispatch()
  
    const keywords = useSelector(state => state.country.keywords)
    const excludeKeywords = useSelector(state => state.country.excludeKeywords)
    const hashtags = useSelector(state => state.country.hashtags)
    const excludeHashtags = useSelector(state => state.country.excludeHashtags)
    const users = useSelector(state => state.country.users)
    const excludeUsers = useSelector(state => state.country.excludeUsers)
    const languages = useSelector(state => state.country.languages)
    const abuseFilters = useSelector(state => state.country.abuseFilters)
    const fromDate = useSelector(state => state.country.fromDate)
    const toDate = useSelector(state => state.country.toDate)

    const search = async (renewData) => {
      dispatch(countryLoading(true));
      await dispatch(fetchCountry(renewData)).then(() => dispatch(fetchTopHashtags()).then(()=> dispatch(fetchTopUsers())))
      dispatch(countryLoading(false));
    }

    const analyze = () => dispatch(analyzeTweets())

    return (
      <Box width="100%" background="white" pad="small" round="small" margin={{top: "medium"}}>
      <Box direction="row" gap="small" width="100%" justify="between" >
        <Autocomplete
        multiple
        limitTags={2}
        freeSolo
        id="multiple-limit-tags"
        value={keywords}
        onChange={(event, newValue) => {
          dispatch(changeCountryState({key: "keywords", value: newValue}))
        }}
        options={[]}
        style={{ width: "38%" }}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Keywords" placeholder="Choose keywords" />
        )}
        />
        <Autocomplete
        multiple
        limitTags={2}
        freeSolo
        id="multiple-limit-tags"
        value={hashtags}
        onChange={(event, newValue) => {
          dispatch(changeCountryState({key: "hashtags", value: newValue}))
        }}
        options={[]}
        style={{ width: "20%" }}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Hashtags" placeholder="Choose hashtags" />
        )}
      />
      
        <Autocomplete
        multiple
        limitTags={2}
        freeSolo
        id="multiple-limit-tags"
        value={users}
        onChange={(event, newValue) => {
          dispatch(changeCountryState({key: "users", value: newValue}))
        }}
        options={[]}
        style={{ width: "20%" }}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Users" placeholder="Search users" />
        )}
      />
                  <Autocomplete
        multiple
        limitTags={2}
        id="multiple-limit-tags"
        options={AbuseArray}
        style={{ width: "20%" }}
        value={abuseFilters}
        onChange={(event, newValue) => {
          dispatch(changeCountryState({key: "abuseFilters", value: newValue}))
        }}
        filterSelectedOptions
        getOptionLabel={(option)=>option.label}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Abuse" placeholder="Choose abuses" />
        )}
      />
             <Autocomplete
        multiple
        limitTags={2}
        id="multiple-limit-tags"
        options={Languages}
        style={{ width: "20%" }}
        value={languages}
        onChange={(event, newValue) => {
          dispatch(changeCountryState({key: "languages", value: newValue}))
        }}
        filterSelectedOptions
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Launguages" placeholder="Choose languages" />
        )}
      />
      </Box>
      <Box direction="row" gap="small" width="100%" justify="between" margin={{vertical: "small"}}>
        <Autocomplete
        multiple
        limitTags={2}
        freeSolo
        id="multiple-limit-tags"
        value={excludeKeywords}
        onChange={(event, newValue) => {
          dispatch(changeCountryState({key: "excludeKeywords", value: newValue}))
        }}
        options={[]}
        style={{ width: "24%" }}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Exclude keywords" placeholder="Exclude keywords" />
        )}
        />
          <Autocomplete
        multiple
        limitTags={2}
        freeSolo
        id="multiple-limit-tags"
        value={excludeHashtags}
        onChange={(event, newValue) => {
          dispatch(changeCountryState({key: "excludeHashtags", value: newValue}))
        }}
        options={[]}
        style={{ width: "24%" }}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Exclude hashtags" placeholder="Choose hashtags" />
        )}
      />
        <Autocomplete
        multiple
        limitTags={2}
        freeSolo
        id="multiple-limit-tags"
        value={excludeUsers}
        onChange={(event, newValue) => {
          dispatch(changeCountryState({key: "excludeUsers", value: newValue}))
        }}
        options={[]}
        style={{ width: "24%" }}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Exclude users" placeholder="Exclude users" />
        )}
      />
      <MuiPickersUtilsProvider utils={DateFnsUtils} >
        <Box width="14%" margin={{right: "10px"}}>
        <DatePicker label="Date: from" value={fromDate} onChange={(val) => dispatch(changeCountryState({key: "fromDate", value: val.toISOString()}))} inputVariant="outlined"/>
        </Box>
        <Box width="14%" >
        <DatePicker label="Date: to" value={toDate} onChange={(val) => dispatch(changeCountryState({key: "toDate", value: val.toISOString()}))} inputVariant="outlined"/>
        </Box>
      </MuiPickersUtilsProvider>
      </Box>
      <Box direction="row" gap="small">
      <Box width="small">
        <Button primary style={{color:"white"}} onClick={() => search(false)} fill={false} size="medium" label="Search" />
      </Box>
      <Box width="small">
        <Button primary style={{color:"white"}} onClick={() => search(true)} fill={false} size="medium" label="Search new data" />
      </Box>
      <Box width="small">
        <Button primary onClick={analyze} fill={false} size="medium" label="Analyze data" />
      </Box>
      </Box>
        {/*<Button primary label="user-search" onClick={()=> onChangeUsers()}/>*/}
        </Box>
        
        /*<Select
          options={keywords}
          value={value}
          onChange={({ option }) => setValue(option)}
        />*/
      );
}