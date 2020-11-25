let express = require("express"),
  router = express.Router(),
  con = require("../mysql_config/config");

  router.post("/newReq" , (req,response) =>{
    request = req.body.request;
    req_title = request.req_title;
    req_type = request.req_type;
    req_status = request.req_status;
    req_level = request.req_level;
    req_description = request.req_description;
    req_initiator_id = request.req_initiator_id;
    req_budget = request.req_budget;
    sql = `select work_id from link inner join access on link.b_id = access.h_id where user_id = '${request.req_initiator_id}';`;
    con.query(sql,(err,res)=>{
      if(err){
        console.log(err);
      }else{
        console.log(res);
        w_id = res[0].work_id;
        req_date = new Date().toJSON().slice(0,10).replace(/-/g,'/');
        console.log(req_date);
        sql_nested = `insert into requests (req_title,req_type,req_status,req_level,req_description,req_date,w_id,req_initiator_id,req_budget) values ('${req_title}','${req_type}','${req_status}','${req_level}','${req_description}','${req_date}',${w_id},'${req_initiator_id}','${req_budget}')`
      }
      con.query(sql_nested,(err,res) => {
        if(err){
          console.log(err);
        }else{
          console.log(res);
          console.log(res.insertId,"req_id");
          // userDataService.addReqToLog(res.insertId);
          response.send(JSON.stringify({id:res.insertId}))
        }
      })
    })
  })

  module.exports = router;
