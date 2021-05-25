import {getDaysArray} from './utils'

export const trendLine = (filter, tweets, start_time, end_time) => {
    if(end_time){
        var start = new Date(end_time);
    }else{
        const today = new Date();
        start = today;
    }
    if(start_time){
        var end = new Date(start_time);
    }else{
        const last = tweets[tweets.length - 1].created_at;
        end = last;
    }

    const count = [];
    switch (filter) {
        case "day":
            getDaysArray(end, start).map((d) => {
                count.push({ "name": d, "count": 0 })
            });
            
            tweets.map((t) => {
                const index = count.findIndex(o => o.name === t.created_at.slice(0, 10))
                count[index].count += 1;
            })
            break;
        case "week":
            // code block
            break;
        case "month":
            // code block
            break;
        case "year":
            // code block
            break;
        default:
        // code block
    }

    return count;

};

