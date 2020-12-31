let express = require("express"),
  async = require("async"),
  router = express.Router(),
  con = require("../mysql_config/config");

  router.post("/viewRequestData",(req,res) =>{
    data = req.body;
    req_id=data.reqId;
    sql1 = `select * from requests where req_id='${req_id}';`
      con.query(sql1, (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
    req_data= result
    sql = `select aaction_taken_by as role_name, areq_action as req_action from request_actionnnn where req_id='${req_id}' order by atime_stamp desc limit 1;`
    con.query(sql,function(err,result){
      if(err){
        console.log(err);
      }else{
        console.log(result);
        role_name=result[0].role_name;
        req_action=result[0].req_action;
        res.send(
            JSON.stringify({
              req_data: req_data,
              role_name:role_name,
              req_action:req_action
            })
          );
      }
    })
    }
  })
})
module.exports = router;