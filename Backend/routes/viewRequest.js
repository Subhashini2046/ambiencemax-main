let express = require("express"),
  async = require("async"),
  router = express.Router(),
  con = require("../mysql_config/config");

  router.post("/viewRequestData",(req,res) =>{
    console.log("+++++++++++++");
    data = req.body;
    req_id=data.reqId;
    console.log(req_id);
    sql1 = `select * from requests where req_id='${req_id}';`
      con.query(sql1, (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
    req_data= result
    console.log('-----',req_data);
    req_level=result[0].req_level;
      console.log('-----',req_level);
      sql = `Select role_name from roles where role_id='${req_level}';`
    con.query(sql,function(err,result){
      if(err){
        console.log(err);
      }else{
        console.log(result);
        role_name=result;
        res.send(
            JSON.stringify({
              req_data: req_data,
              role_name:role_name
            })
          );
      }
    })
    }
  })
})
module.exports = router;