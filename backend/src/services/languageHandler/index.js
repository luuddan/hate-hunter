import {getLanguageCount} from "../neoQueryHandler"
import {languages} from "./languages"

export const languageHandler = async (keywords,hashtags,users,start_time,end_time) => {
    const languageCount = await getLanguageCount(keywords || [],hashtags || [],users || [], start_time.slice(0,10), end_time.slice(0,10));
    const formatLangcount = languageCount.map( l=>(  {name: (languages.find( la=> la.code===l.name)||{name:l.name}).name ,count:l.count}));
    return formatLangcount;

}

