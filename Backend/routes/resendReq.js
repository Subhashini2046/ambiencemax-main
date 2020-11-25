let express = require("express"),
  async = require("async"),
  router = express.Router(),
  con = require("../mysql_config/config");

  router.post("/resendReq",(req,res)=>{
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
  });

module.exports = router;