let express = require("express"),
    async = require("async"),
    router = express.Router(),
    con = require("../mysql_config/config");

router.post("/requestDetails", (req, res) => {
   let sql = `select * from datarumprequest where RUMPRequestPK=${req.body.reqId};`
    con.query(sql, (err, result) => {
        if (err) {
            console.log(err);}
        else {
            res.send(JSON.stringify(result));
        }
    });
});
module.exports = router;