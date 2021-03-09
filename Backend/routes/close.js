const date = require('date-and-time');
let express = require("express"),
  async = require("async"),
  router = express.Router(),
  con = require("../mysql_config/config");

  router.post("/closedReq",(req,res) =>{
 
    if (req.body.role == 0) {
      con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
      RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus from datarumprequest
      inner join linkrumpadminaccess on RUMPInitiatorId=linkRUMPAdminAccessPK
      where linkrumprolefk=0 and linkRUMPSpace=? and RUMPRequestStatus='Closed' order by rumprequestpk desc `, req.body.space, (err, result) => {
        if (err) throw err;
        res.end(JSON.stringify(result))
      })
    } else if (req.body.role == 3 || req.body.role == 4) {
      let myrole = req.body.role;
      let narr = [];
      con.query(`select linkrumprequestflowpk as wid,w_flow as wflow from linkrumprequestflow;
      select linkrumpadminaccesspk as id from linkrumpadminaccess where linkrumprolefk=? and linkrumpspace=? ;`, [req.body.role, req.body.space], (err, result) => {
        if (err) throw err;
        for (let i = 0; i < result[0].length; i++) {
          let wflowdata = result[0][i].wflow.split(',');
          if (myrole == 3) {
            wflowdata = wflowdata.filter(data => data.includes('c')).map(data => {
              return data.split('or').filter(data => data.includes('c')).map(data => data.replace('c', ''))[0]
            })
          }
          else if (myrole == 4) {
            wflowdata = wflowdata.filter(data => data.includes('e')).map(data => {
              return data.split('or').filter(data => data.includes('e')).map(data => data.replace('e', ''))[0]
            })
          }
          for (let j = 0; j < wflowdata.length; j++) {
            for (k = 0; k < result[1].length; k++) {
              if (result[1][k].id == wflowdata[j]) {
                narr.push(result[0][i].wid);
                break;
              }
            }
          }
        }
        let metype=1;
        if(myrole==3){
          metype=0;
        }
        con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
        RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus from datarumprequest where rumprequestmetype=? and rumprequestflowfk in(?) and RUMPRequestStatus='Closed' order by rumprequestpk desc  `,
          [metype,narr], (err, result) => {
            if (err) throw err;
            res.end(JSON.stringify(result))
          }
        )
      })
    } else {
      let narr = [];
      con.query(`select linkrumprequestflowpk as wid,w_flow as wflow from linkrumprequestflow;
      select linkrumpadminaccesspk as id from linkrumpadminaccess where linkrumprolefk=? and linkrumpspace=? ;`, [req.body.role, req.body.space], (err, result) => {
        if (err) throw err;
        for (let i = 0; i < result[0].length; i++) {
          let wflowdata = result[0][i].wflow.split(',');
          wflowdata = wflowdata.filter(data => !data.includes('or') && !data.includes('i'));
          console.log(wflowdata);
          for (let j = 0; j < wflowdata.length; j++) {
            for (k = 0; k < result[1].length; k++) {
              if (result[1][k].id == wflowdata[j]) {
                narr.push(result[0][i].wid);
                break;
              }
            }
          }
        }
        con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
        RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus from datarumprequest where rumprequestflowfk in(?) and RUMPRequestStatus='Closed' order by rumprequestpk desc`,
          [narr], (err, result) => {
            if (err) throw err;
            res.end(JSON.stringify(result))
          }
        )
      })
    }
    });
   
    router.post("/complete_reqs",(req,res)=>{

      if (req.body.role == 0) {
        con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
        RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus from datarumprequest
        inner join linkrumpadminaccess on RUMPInitiatorId=linkRUMPAdminAccessPK
        where linkrumprolefk=0 and linkRUMPSpace=? and RUMPRequestStatus='Completed' order by RUMPRequestDate desc`, req.body.space, (err, result) => {
          if (err) throw err;
          res.end(JSON.stringify(result))
        })
      } else if (req.body.role == 3 || req.body.role == 4) {
        let myrole = req.body.role;
        let narr = [];
        con.query(`select linkrumprequestflowpk as wid,w_flow as wflow from linkrumprequestflow;
        select linkrumpadminaccesspk as id from linkrumpadminaccess where linkrumprolefk=? and linkrumpspace=? ;`, [req.body.role, req.body.space], (err, result) => {
          if (err) throw err;
          for (let i = 0; i < result[0].length; i++) {
            let wflowdata = result[0][i].wflow.split(',');
            if (myrole == 3) {
              wflowdata = wflowdata.filter(data => data.includes('c')).map(data => {
                return data.split('or').filter(data => data.includes('c')).map(data => data.replace('c', ''))[0]
              })
            }
            else if (myrole == 4) {
              wflowdata = wflowdata.filter(data => data.includes('e')).map(data => {
                return data.split('or').filter(data => data.includes('e')).map(data => data.replace('e', ''))[0]
              })
            }
            for (let j = 0; j < wflowdata.length; j++) {
              for (k = 0; k < result[1].length; k++) {
                if (result[1][k].id == wflowdata[j]) {
                  narr.push(result[0][i].wid);
                  break;
                }
              }
            }
          }
          let metype=1;
          if(myrole==3){
            metype=0;
          }
          con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
          RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus
           from datarumprequest where rumprequestmetype=? and rumprequestflowfk in(?) and RUMPRequestStatus='Completed' order by RUMPRequestDate desc`,
            [metype,narr], (err, result) => {
              if (err) throw err;
              res.end(JSON.stringify(result))
            }
          )
        })
      } else {
        let narr = [];
        con.query(`select linkrumprequestflowpk as wid,w_flow as wflow from linkrumprequestflow;
        select linkrumpadminaccesspk as id from linkrumpadminaccess where linkrumprolefk=? and linkrumpspace=? ;`, [req.body.role, req.body.space], (err, result) => {
          if (err) throw err;
          for (let i = 0; i < result[0].length; i++) {
            let wflowdata = result[0][i].wflow.split(',');
            wflowdata = wflowdata.filter(data => !data.includes('or') && !data.includes('i'));
            console.log(wflowdata);
            for (let j = 0; j < wflowdata.length; j++) {
              for (k = 0; k < result[1].length; k++) {
                if (result[1][k].id == wflowdata[j]) {
                  narr.push(result[0][i].wid);
                  break;
                }
              }
            }
          }
          con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
          RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus
           from datarumprequest where rumprequestflowfk in(?) and RUMPRequestStatus='Completed' order by RUMPRequestDate desc`,
            [narr], (err, result) => {
              if (err) throw err;
              res.end(JSON.stringify(result))
            }
          )
        })
      }
    
    });

    router.post("/addCompeteRequest", (req, res) => {
        sql = `update datarumprequest set RUMPRequestUnreadStatus=1,RUMPRequestStatus='Completed' where RUMPRequestPK = '${req.body.req_id}';`
    
        con.query(sql,function(err,result){
        if(err){
          console.log(err);
        }else{
          console.log(result);
          const now = new Date();
          let actionTime=date.format(now, 'YYYY-MM-DD HH:mm:ss')
          sql = `insert into datarumprequestaction (RUMPRequestFK,RUMPRequestRole,RUMPRequestAction,RUMPRequestActionTiming,RUMPRequestComments,RUMPRequestRoleName,RUMPRequestStage) values(${req.body.req_id},${req.body.accessID},'Completed','${actionTime}','Completed','${req.body.role_name}',1);`
    
          con.query(sql,function(err,result){
          if(err){
            console.log(err);
          }else{
            console.log(result);
            res.send(JSON.stringify({
              result:"passed"
            }));
          }
        })
        }
      })
    });
  module.exports = router;