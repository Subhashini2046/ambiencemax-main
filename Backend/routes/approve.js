let express = require("express"),
  async = require("async"),
  router = express.Router(),
  con = require("../mysql_config/config");

  router.post("/approve",(req,res)=>{
    role = req.body.userRole;
    reqId = req.body.req_id;
    sql = `update requests set req_level = '${role}' where req_id = '${reqId}';`
    con.query(sql,function(err,result){
      if(err){
        console.log(err);
      }else{
        console.log(result);
      }
    })
  })

  router.post("/workflow",(req,res)=>{
    reqId = req.body.req_id;
    console.log(reqId);
    sql = `Select w_flow from requests inner join workflow on requests.w_id = workflow.w_id where req_id = '${reqId}';`
    con.query(sql,function(err,result){
      if(err){
        console.log(err);
      }else{
        console.log(result);
        res.send(result);
      }
    })
  })

  router.post("/closeReq",(req,res)=>{
    reqId = req.body.req_id;
    console.log('Close Route called' + reqId);
    sql = `Update requests set req_status = 'closed' where req_id = '${reqId}';`;
    con.query(sql , (err,res)=>{
      if (err){
        console.log(err);
      }else{
        console.log(res);
      }
    })
  });

  module.exports = router;
