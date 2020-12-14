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

  router.post("/viewStatus",(req,res)=>{
    reqId = req.body.req_id;
    console.log(reqId);
    w_flow=[];
    role=[];
    role1=[];
    sql = `Select w_flow from requests inner join workflow on requests.w_id = workflow.w_id where req_id = '${reqId}';`
    con.query(sql,function(err,result){
      if(err){
        console.log(err);
      }else{
        w_flow=result[0].w_flow.split(',');
        console.log("............");
        console.log(w_flow);
          sql1= `Select * from roles;`
        
          con.query(sql1,function(err,result){
          if(err){
            console.log(err);
            console.log(result);
           
          }
          else{
           role.push(result[0]);
           role.push(result[1]);
           role.push(result[2]);
           role.push(result[3]);
           role.push(result[4]);
           role.push(result[5]);
           role.push(result[6]);

           role.forEach((e1) => {
            for(let i=0;i<w_flow.length;i++){
              if(e1.role_id==w_flow[i]){
                 role1.push(e1);
              }
            }
          });
           res.send(
            JSON.stringify({
                result:"passed",
                w_flow:w_flow,
                role:role1
            })
        );
          }
   
        });
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
