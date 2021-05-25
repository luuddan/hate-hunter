export const getAllCountOfAbuse = (countOfAbuse) =>{
    const AbuseType = [
        {name:"personal_attack",count:0},
        {name:"bigotry",count: 0},
        {name:"profanity", count: 0},
        {name:"sexual_advances",count: 0}, 
        {name:"criminal_activity",count: 0},
        {name:"adult_only",count: 0},
        {name: "mental_issues", count: 0},
        {name: "spam", count: 0},
    ]
    countOfAbuse.forEach(element => {
        if(element.name==="no_abuse" || element.name==="external_contact"){
            console.log("---fix this---")
        }else{
            AbuseType.find(a => a.name === element.name).count = element.count;
        }
    });
    return AbuseType;
}