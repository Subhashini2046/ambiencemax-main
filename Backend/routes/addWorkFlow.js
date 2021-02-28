let express = require("express"),
  async = require("async"),
  router = express.Router(),
  con = require("../mysql_config/config");

// router.get("/getWorkFlow",(req,res)=>{
//   sql='Select * from workflow inner join (select w_id from requests where request.w_id=workflow.w_id);'
// con.query(sql,(err,result)=> {
// if(err)
// {
//   console.log(err)
// }
// else{
//   res.send(JSON.stringify({data,result}));}
// })})

  router.get("/getFlow",(req,res)=>{
    sql = `select distinct linkrumprequestflow.linkrumprequestflowpk,linkrumprequestflow.w_flow from linkrumprequestflow
    inner join linkrumprequestinitiators on work_id=linkrumprequestflowpk;`
    con.query(sql,(err,result) => {
      if(err){
        console.log(err);
      }else{
        res.send(result);
      }
    })
  })
  // router.post("/setFlow",(req,res)=>{
  //   wflow = req.body.wflow;
  //   console.log(wflow);
  //   sql = `insert into workflow (w_flow) values ('${wflow}')`
  //   con.query(sql,(err,result)=>{
  //     if(err){
  //       console.log(err);
  //     }else{
  //       console.log(result);
  //     }
  //   })
  // })
  // router.post("/addHierarchy",(req,res)=> {
  //   h_id = req.body.h_id;
  //   h_name = req.body.h_name;
  //   h_level = req.body.h_level;
  //   console.log('h_id:'+h_id);
  //   sql = `insert into hierarchy (h_id,h_name,h_level) values ('${h_id}','${h_name}','${h_level}')`
  //   con.query(sql,(err,result)=>{
  //     if(err){
  //       console.log(err);
  //     }else{
  //       console.log(result);
  //     }
  //   })
  // })
  router.post("/addLink",(req,res)=>{
    work_id = req.body.work_id;
    b_id = req.body.b_id;
    sql = `insert into linkrumprequestinitiators (work_id,b_id) values (${work_id},${b_id})`;
    con.query(sql,(err,result)=>{
      if(err){
        console.log(err);
      }else{
        res.send(result);
      }
    })
  })
module.exports =  router;
