let express = require("express"),
    async = require("async"),
    router = express.Router(),
    con = require("../mysql_config/config");

router.post("/viewUpdateRequest", (req, res) => {
    data = req.body;
    req_id = data.reqId;
    sql1 = `select * from requests where req_id='${req_id}';`
    con.query(sql1, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            req_data = result
            console.log(result);
            res.send(
                JSON.stringify({
                    req_data: req_data
                })
            );
        }
    })
})

router.post("/updateRequest", (req, res) => {
    data = req.body;
    RequestData = data.RequestData;
    req_id=data.reqId;
    req_budget=data.RequestData.RequestBudget;
    req_description=data.RequestData.Requestdes;
    req_title=data.RequestData.RequestTitle;
    console.log("/////",req_description);
    if(req_description!=''){
        sql1 = `update requests set req_description='${req_description}' where req_id=${req_id};`
        con.query(sql1, (err, result) => {
            if (err) {
                console.log(err);
            } 
    });
}
if(req_title!=''){
    sql1 = `update requests set req_title='${req_title}' where req_id=${req_id};`
    con.query(sql1, (err, result) => {
        if (err) {
            console.log(err);
        } 
});
}
if(req_budget!=0){
    sql1 = `update requests set req_budget='${req_budget}' where req_id=${req_id};`
    con.query(sql1, (err, result) => {
        if (err) {
            console.log(err);
        } 
});
}
})
module.exports = router;