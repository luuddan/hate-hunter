var express = require("express");
var router = express.Router();
const { Botometer } = require("botometer");
 
const botometer = new Botometer({
  consumerKey: "",
  consumerSecret: "",
  accessToken: "-",
  accessTokenSecret: "",
  rapidApiKey: "",
  supressLogs: false, // Not required. Defaults to true
  usePro: true,
});
 
async function run(name) {
  const results = await botometer.getScores([name]).then(
    (result)=>{
        console.log(result);
        return result;
    }
  );
}
 


router.get("/", function (req, res, next) {
    //res.send("Bot is working properly");
    //data = run(req.query.name).then((data)=> data = data);
    //const name = req.query.name;
    botometer.getScores([req.query.name]).then(
        (result)=>{
            console.log(result);
            res.send(result);
    });
});

module.exports = router;