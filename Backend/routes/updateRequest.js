let express = require("express"),
    async = require("async"),
    router = express.Router(),
    con = require("../mysql_config/config");

router.post("/requestDetails", (req, res) => {
    sql1 = `select * from datarumprequest where RUMPRequestPK=${req.body.reqId};`
    con.query(sql1, (err, result) => {
        if (err) {
            console.log(err);}
        else {
            res.send(JSON.stringify(result));
        }
    });
});

// router.post("/updateRequest", (req, res) => {
//     data = req.body;
//     RequestData = data.RequestData;
//     req_id=data.reqId;
//     req_budget=data.RequestData.RequestBudget;
//     req_description=data.RequestData.Requestdes;
//     req_title=data.RequestData.RequestTitle;
//     console.log("/////",req_description);
//     if(req_description!=''){
//         sql1 = `update requests set req_description='${req_description}' where req_id=${req_id};`
//         con.query(sql1, (err, result) => {
//             if (err) {
//                 console.log(err);
//             } 
//     });
// }
// if(req_title!=''){
//     sql1 = `update requests set req_title='${req_title}' where req_id=${req_id};`
//     con.query(sql1, (err, result) => {
//         if (err) {
//             console.log(err);
//         } 
// });
// }
// if(req_budget!=0){
//     sql1 = `update requests set req_budget='${req_budget}' where req_id=${req_id};`
//     con.query(sql1, (err, result) => {
//         if (err) {
//             console.log(err);
//         } 
// });
// }
// })
module.exports = router;