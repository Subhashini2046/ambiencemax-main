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
router.get("/getFlowDetails",(req,res)=>{
  sql = `select linkrumpadminaccess.linkRUMPAdminAccessPK as id, linkrumpadminaccess.linkrumprolefk as role,
  COALESCE(locname,buiname,cluname,citname) as name,pickRUMPRoleDescription as role from linkrumpadminaccess 
  left join datalocation on(datalocation.locLocationPK=linkRUMPAdminAccess.linkRUMPspace)
  left join databuilding on(databuilding.buiBuildingPK=linkRUMPAdminAccess.linkRUMPspace)
  left join dataclub on(dataclub.cluclubpk=linkRUMPAdminAccess.linkRUMPspace)
  left join datacity on(datacity.citCityPK=linkRUMPAdminAccess.linkRUMPspace)
  inner join pickrumprole on(pickrumprole.pickrumprolepk=linkrumpadminaccess.linkRUMPRoleFK)
  where linkRUMPAdminAccessPK in (15,11,9,51,66,19,37,5,3) order by linkrumprolefk;`
  con.query(sql,(err,result) => {
    if(err){
      console.log(err);
    }else{
      res.send(result);
    }
  })
})

  router.get("/getFlow",(req,res)=>{
    sql = `select COALESCE(locname,buiname,cluname,citname) as name,linkrumprequestflow.linkrumprequestflowpk as w_id,
    linkrumprequestflow.w_flow as w_flow from linkrumprequestinitiators 
    left join datalocation on(datalocation.locLocationPK=linkrumprequestinitiators.b_id)
    left join databuilding on(databuilding.buiBuildingPK=linkrumprequestinitiators.b_id)
    left join dataclub on(dataclub.cluclubpk=linkrumprequestinitiators.b_id)
    left join datacity on(datacity.citCityPK=linkrumprequestinitiators.b_id)
    left join linkrumprequestflow on(linkrumprequestflow.linkrumprequestflowpk=linkrumprequestinitiators.work_id);`
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
