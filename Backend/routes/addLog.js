let express = require("express"),
  router = express.Router(),
  con = require("../mysql_config/config");


  // router.post("/addLog",(req,res)=>{
  //   role = req.body.userRole;
  //   reqId = req.body.req_id;
  //   action_by=req.body.action_taken_by;
  //   console.log("........role",role,reqId,action_by);
  //   sql = `insert into request_actionnnn (req_id,acc_id,areq_action,aaction_taken_by,acomment) values(${reqId},${role},"Approved",'${action_by}',"Approved")`
  //   con.query(sql,function(err,result){
  //     if(err){
  //       console.log(err);
  //     }else{
  //       console.log(result);
  //       res.send(JSON.stringify({id:res.insertId}));
  //     }
  //   })
  // })

  // router.post("/newLog" , (req,res) =>{
  //   request = req.body.request;
  //   req_title = request.req_title;
  //   req_type = request.req_type;
  //   req_status = request.req_status;
  //   req_level = request.req_level;
  //   req_description = request.req_description;
  //   req_initiator_id = request.req_initiator_id;
  //   req_budget = request.req_budget;
  //   sql = `select work_id from link inner join access on link.b_id = access.h_id where user_id = '${request.req_initiator_id}';`;
  //   con.query(sql,(err,res)=>{
  //     if(err){
  //       console.log(err);
  //     }else{
  //       console.log(res);
  //       w_id = res[0].work_id;
  //       req_date = new Date().toJSON().slice(0,10).replace(/-/g,'/');
  //       console.log(req_date);
  //       sql_nested = `insert into requests (req_title,req_type,req_status,req_level,req_description,req_date,w_id,req_initiator_id,req_budget) values ('${req_title}','${req_type}','${req_status}','${req_level}','${req_description}','${req_date}',${w_id},'${req_initiator_id}','${req_budget}')`
  //     }
  //     con.query(sql_nested,(err,res) => {
  //       if(err){
  //         console.log(err);
  //       }else{
  //         console.log(res);
  //         return;
  //       }
  //     })
  //   })
  // })

  
  module.exports = router;
