let express = require("express"),
  async = require("async"),
  router = express.Router(),
  con = require("../mysql_config/config");


router.post("/pdfTableData", (req, res) => {
  let req_id = req.body.req_id;
  let tableData = [];
  let tableData1 = [];
  let tableData2 = [];
  let sql1 = `select  RUMPRequestRoleName user, RUMPRequestRole as role, RUMPRequestAction as action ,
  RUMPRequestActionTiming as actionTiming,RUMPRequestComments as comment,
  (select pickRUMPRoleDescription from pickrumprole where pickRUMPRolePK=linkrumpadminaccess.linkRUMPRoleFK) as role1,
  (select pickRUMPRolePK from pickrumprole where pickRUMPRolePK=linkrumpadminaccess.linkRUMPRoleFK) as roleId from datarumprequestaction
  inner join linkrumpadminaccess on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole) where RUMPRequestFK=?  and 
(RUMPRequestAction='Initiated Phase 1' or RUMPRequestAction='Approved' or RUMPRequestAction='Submitted' or RUMPRequestAction='Approved (Closed)') group by RUMPRequestRole order by RUMPRequestActionTiming desc;`
  con.query(sql1, req_id, (error, result) => {
    if (error) {
      console.log(error);
    }
    else {
      result.forEach(element => {
        tableData.push(element);
      })

      for (let i = tableData.length - 1; i >= 0; i--) {
        tableData1.push(tableData[i]);
      }
      let HeadOfMaintenanceIndex = 0;
      for (let i = 0; i < tableData1.length - 1; i++) {
        if (tableData1[i].role1.includes('Head of Maintenance')) { HeadOfMaintenanceIndex = i }
      }
      let sql = `select  RUMPRequestRoleName user, RUMPRequestRole as role, RUMPRequestAction as action ,
      RUMPRequestActionTiming as actionTiming,RUMPRequestComments as comment,
      (select pickRUMPRoleDescription from pickrumprole where pickRUMPRolePK=linkrumpadminaccess.linkRUMPRoleFK) as role1,
      (select pickRUMPRolePK from pickrumprole where pickRUMPRolePK=linkrumpadminaccess.linkRUMPRoleFK) as roleId   from datarumprequestaction
      inner join linkrumpadminaccess on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole) where RUMPRequestFK=?  and 
    (RUMPRequestAction='Initiated Phase 2') order by RUMPRequestActionTiming desc limit 1;`
      con.query(sql, req_id, (err1, result2) => {
        if (err1) {
          console.log(err1);
        }
        else {
          for (let i = 0; i <= HeadOfMaintenanceIndex; i++) {
            tableData2.push(tableData1[i])
          }
          tableData2.push(result2[0]);
          for (let i = HeadOfMaintenanceIndex + 1; i < tableData1.length; i++) {
            tableData2.push(tableData1[i]);
          }
          let sqlQuery = `select  RUMPRequestRoleName user, RUMPRequestRole as role, RUMPRequestAction as action ,
    RUMPRequestActionTiming as actionTiming,RUMPRequestComments as comment,
    (select pickRUMPRoleDescription from pickrumprole where pickRUMPRolePK=linkrumpadminaccess.linkRUMPRoleFK) as role1,
    (select pickRUMPRolePK from pickrumprole where pickRUMPRolePK=linkrumpadminaccess.linkRUMPRoleFK) as roleId   from datarumprequestaction
    inner join linkrumpadminaccess on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole) where RUMPRequestFK=?  and 
  RUMPRequestAction='Completed';`
          con.query(sqlQuery, req_id, (err2, result1) => {
            if (err2) {
              console.log(err2);
            }
            else {
              tableData2.push(result1[0]);
              res.send(tableData2);
            }
          })
        }
      })
    }
  })
})


//check.............
router.post("/viewStatuss", (req, res) => {
  let reqId = req.body.req_id;
  let wflowdata = [];
  let me_type = null;
  let intiator_id = '';
  let w_flow = [];
  let sql = `select RUMPRequestProcessingTime, admPhotoURL,RUMPRequestRoleName as RequestRoleName,RUMPRequestAction as 
  RequestAction,RUMPRequestActionTiming as RequestActionDate,time(RUMPRequestActionTiming) 
  RequestActionTiming from datarumprequestaction 
  inner join linkrumpadminaccess on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole) 
  inner join dataadmin on(dataadmin.admAdminPK=linkrumpadminaccess.linkRUMPAdminFK) 
  where RUMPRequestFK= ?;`
  con.query(sql,[reqId], function (error, result1) {
    if (error) {
      console.log(error);
    } else {
      let reqLog = result1;
      con.query(`Select linkRUMPRoleFK as roleId,linkRUMPSpace as space,ispnc,RUMPRequestStatus,RumprequestLevel,RUMPInitiatorId,w_flow,RUMPRequestMEType from datarumprequest 
      inner join linkrumprequestflow on (datarumprequest.RUMPRequestFlowFK = linkrumprequestflow.linkrumprequestflowpk)
      inner join linkrumpadminaccess on (datarumprequest.RumprequestLevel=linkrumpadminaccess.linkRUMPAdminAccessPK)
      where RUMPRequestPK = ?;`, [reqId],
        function (err, result) {
          if (err) {
            console.log(err);
          } else {
            let roleId = result[0].roleId;
            let space = result[0].space;
            w_flow = result[0].w_flow.split(',');
            me_type = result[0].RUMPRequestMEType;
            let reqStatus = result[0].RUMPRequestStatus;
            intiator_id = result[0].RUMPInitiatorId;

            for (let i = 0; i < w_flow.length; i++) {
              if (typeof w_flow[i] === 'string' && (!w_flow[i].includes('or') && !w_flow[i].includes('i'))) {
                wflowdata.push(w_flow[i]);
              }
              else if (me_type == 0 && w_flow[i].includes('or')) {
                w_flow[i] = w_flow[i].replace("c", "");
                w_flow[i] = w_flow[i].replace('e', '');
                w_flow[i] = w_flow[i].substring(0, w_flow[i].indexOf('or') + 'or'.length);
                w_flow[i] = w_flow[i].replace('or', '');
                wflowdata.push(w_flow[i]);
              }
              else if (me_type == 1 && w_flow[i].includes('or')) {
                w_flow[i] = w_flow[i].replace("c", "");
                w_flow[i] = w_flow[i].replace('e', '');
                w_flow[i] = w_flow[i].substring(w_flow[i].indexOf('r') + 1);
                w_flow[i] = w_flow[i].replace('or', '');
                wflowdata.push(w_flow[i]);
              }
              else if (w_flow[i].includes('i')) {
                wflowdata.push(intiator_id);
              }

            }
            if (reqStatus == 'Pending') {
              con.query(`select linkRUMPAdminAccessPK,linkRUMPRoleFK as roleId,linkRUMPSpace as space,pickRUMPRoleDescription as role, concat('Pending') as status
              from linkrumpadminaccess inner join pickrumprole on(pickrumprole.pickRUMPRolePK=linkrumpadminaccess.linkRUMPRoleFK) 
              where linkRUMPAdminAccessPK in(?) ORDER BY FIELD(linkRUMPAdminAccessPK,?);`,
                [wflowdata, wflowdata], (err, result) => {
                  if (err) throw err;
                  let wdata = result;
                  let getIndex;
                  for (let i = 0; i < wdata.length; i++) {
                    if (wdata[i].roleId == roleId && wdata[i].space == space) {
                      getIndex = i;
                      break;
                    }
                  }
                  for (let i = 0; i < getIndex; i++) {
                    wdata[i].status = 'Approved';
                  }
                  res.end(JSON.stringify({ reqLog: reqLog, approval_status: result }))
                })
            }
            else if (reqStatus == 'Closed' || reqStatus == 'Completed') {
              con.query(`select linkRUMPAdminAccessPK,linkRUMPRoleFK as roleId,linkRUMPSpace as space,pickRUMPRoleDescription as role, concat('Approved') as status
              from linkrumpadminaccess inner join pickrumprole on(pickrumprole.pickRUMPRolePK=linkrumpadminaccess.linkRUMPRoleFK) 
              where linkRUMPAdminAccessPK in(?) ORDER BY FIELD(linkRUMPAdminAccessPK,?);`,
                [wflowdata, wflowdata], (err, result) => {
                  if (err) throw err;
                  res.end(JSON.stringify({ reqLog: reqLog, approval_status: result }))
                })
            }
          }
        })
    }
  });
});

// router.post("/viewStatuss",(req,res)=>{
//   let reqId = req.body.req_id;
//   let wflowdata=[];
//   let me_type = null;
//   let intiator_id = '';
//   let w_flow=[];
//   let role1=[];
//   let sql = `select RUMPRequestRoleName as RequestRoleName,RUMPRequestAction as RequestAction,RUMPRequestActionTiming as RequestActionDate,time(RUMPRequestActionTiming) RequestActionTiming from datarumprequestaction where RUMPRequestFK= ${reqId};`
//   con.query(sql,function(error,result1){
//     if(error){
//       console.log(error);
//     }else{
//      let reqLog=result1;
//   con.query(`Select ispnc,RUMPRequestStatus,RumprequestLevel,RUMPInitiatorId,w_flow,RUMPRequestMEType from datarumprequest inner join linkrumprequestflow on datarumprequest.RUMPRequestFlowFK = linkrumprequestflow.linkrumprequestflowpk where RUMPRequestPK = ${reqId};`,
//   function(err,result){
//     if(err){
//       console.log(err);
//     }else{
//       w_flow=result[0].w_flow.split(',');
//       me_type = result[0].RUMPRequestMEType;
//      let requestLevel=result[0].RumprequestLevel;
//      let reqStatus=result[0].RUMPRequestStatus;
//       intiator_id = result[0].RUMPInitiatorId;
//      let ispnc=result[0].ispnc;

//       for (let i = 0; i < w_flow.length; i++) {

//         if(typeof w_flow[i] === 'string' && (!w_flow[i].includes('or') && !w_flow[i].includes('i'))){
//           wflowdata.push(w_flow[i]);
//         }

//         else if(me_type == 0 && w_flow[i].includes('or')){

//         w_flow[i] = w_flow[i].replace("c","");
//         w_flow[i] = w_flow[i].replace('e','');
//         w_flow[i] = w_flow[i].substring(0,w_flow[i].indexOf('or')+'or'.length);
//         w_flow[i] = w_flow[i].replace('or','');
//         wflowdata.push(w_flow[i]);

//         }
//         else if(me_type == 1 && w_flow[i].includes('or')){

//           w_flow[i] = w_flow[i].replace("c","");
//           w_flow[i] = w_flow[i].replace('e','');
//           w_flow[i] = w_flow[i].substring(w_flow[i].indexOf('r')+1);
//           w_flow[i] = w_flow[i].replace('or','');
//           wflowdata.push(w_flow[i]);

//         }
//         else if(w_flow[i].includes('i')){
//           wflowdata.push(intiator_id);
//         }

//       }
//       const loop = new Promise((resolve,reject) => {  wflowdata.forEach((element,i) => {
//        let tval = element;
//        let sql1= `select pickRUMPRoleDescription from linkrumpadminaccess inner join pickrumprole on linkrumpadminaccess.linkRUMPRoleFK = pickrumprole.pickRUMPRolePK where linkRUMPAdminAccessPK = ${tval};`
//         let fetch = new Promise((resolve1,reject1)=>{
//           con.query(sql1,function(err1,result2){
//             if(err1){
//               console.log(err1);         
//             }
//             else{
//               role1.push(result2);
//               resolve1();
//             }
//           })
//         })
//         fetch.then(()=>{
//           if(i === wflowdata.length -1){
//             resolve();
//           }
//         })

//         })
//       })

//       loop.then(()=>{
//         res.send(
//           JSON.stringify({
//               result:"passed",
//               w_flow:wflowdata,
//               role:role1,
//               requestLevel:requestLevel,
//               intiator_id:intiator_id,
//               reqStatus:reqStatus,
//               reqLog:reqLog,
//               ispnc:ispnc
//           })
//          );
//       })
//       }
//   })
// }
// });
// });
module.exports = router;