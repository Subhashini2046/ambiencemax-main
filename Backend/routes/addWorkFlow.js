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
router.post("/getFlowDetails", (req, res) => {
  let w_id = req.body.Workflow.data;
  sql = `select w_flow from linkrumprequestflow where linkrumprequestflowpk=?;`
  con.query(sql, w_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      let w_flow = [];
      let wflowdata = [];
      w_flow = result[0].w_flow.split(',');
      for (let i = 0; i < w_flow.length; i++) {
        if (typeof w_flow[i] === 'string' && (w_flow[i].includes('or') == false && w_flow[i].includes('i') == false)) {
          wflowdata.push(w_flow[i]);
          console.log(" wi]", w_flow[i]);
        }

        else if (w_flow[i].includes('or')) {
          if (w_flow[i].includes('c')) {
            nextValue = w_flow.filter(data => data.includes('c')).map(data => {
              return data.split('or').filter(data => data.includes('c')).map(data => data.replace('c', ''))[0]
            })
            console.log("next", nextValue);
            wflowdata.push(nextValue);
          }
          if (w_flow[i].includes('c')) {
            nextValue = w_flow.filter(data => data.includes('e')).map(data => {
              return data.split('or').filter(data => data.includes('e')).map(data => data.replace('e', ''))[0]
            })
            wflowdata.push(nextValue);
          }
        }
        else if (w_flow[i].includes('i')) {
          w_flow[i] = w_flow[i].replace('i', '');

        }
      }
      sql = `select dataadmin.admName as adminName,linkrumpadminaccess.linkRUMPAdminAccessPK as id, linkrumpadminaccess.linkrumprolefk as role,
      COALESCE(locname,buiname,cluname,citname) as name,pickRUMPRoleDescription as role from linkrumpadminaccess 
      left join datalocation on(datalocation.locLocationPK=linkRUMPAdminAccess.linkRUMPspace)
      left join databuilding on(databuilding.buiBuildingPK=linkRUMPAdminAccess.linkRUMPspace)
      left join dataclub on(dataclub.cluclubpk=linkRUMPAdminAccess.linkRUMPspace)
      left join datacity on(datacity.citCityPK=linkRUMPAdminAccess.linkRUMPspace)
      inner join pickrumprole on(pickrumprole.pickrumprolepk=linkrumpadminaccess.linkRUMPRoleFK)
      inner join dataadmin on(dataadmin.admAdminPK=linkrumpadminaccess.linkRUMPAdminFK)
      where linkRUMPAdminAccessPK in (?) order by linkrumprolefk;`
      con.query(sql, [wflowdata], (err, result) => {
        if (err) {
          console.log(err);
        } else {

          res.send(result);
        }
      })
    }
  })
})

router.get("/getFlow", (req, res) => {
  sql = `select COALESCE(locname,buiname,cluname,citname) as name,linkrumprequestflow.linkrumprequestflowpk as w_id,
    linkrumprequestflow.w_flow as w_flow from linkrumprequestinitiators 
    left join datalocation on(datalocation.locLocationPK=linkrumprequestinitiators.b_id)
    left join databuilding on(databuilding.buiBuildingPK=linkrumprequestinitiators.b_id)
    left join dataclub on(dataclub.cluclubpk=linkrumprequestinitiators.b_id)
    left join datacity on(datacity.citCityPK=linkrumprequestinitiators.b_id)
    left join linkrumprequestflow on(linkrumprequestflow.linkrumprequestflowpk=linkrumprequestinitiators.work_id);`
  con.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
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
router.post("/addLink", (req, res) => {
  work_id = req.body.work_id;
  b_id = req.body.b_id;
  sql = `insert into linkrumprequestinitiators (work_id,b_id) values (${work_id},${b_id})`;
  con.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  })
})
module.exports = router;
