const date = require('date-and-time');
let express = require("express"),
  async = require("async"),
  router = express.Router(),
  con = require("../mysql_config/config");

router.post("/closedReqSwitch", (req, res) => {
  let narr = [];
  con.query(`select linkrumprequestflowpk as wid,w_flow as wflow from linkrumprequestflow;
    select linkrumpadminaccesspk as id,linkRUMPRoleFK as role from linkrumpadminaccess where linkRUMPAdminFK=${req.body.userId};`, [req.body.role, req.body.space], (err2, result) => {
    if (err2) throw err2;
    if (result[1][0].role == 3 || result[1][0].role == 4) {
      for (let i = 0; i < result[0].length; i++) {
        let wflowdata = result[0][i].wflow.split(',');
        if (result[1][0].role == 3) {
          wflowdata = wflowdata.filter(data => data.includes('c')).map(data1 => {
            return data1.split('or').filter(data2 => data2.includes('c')).map(data3 => data3.replace('c', ''))[0]
          })
        }
        else if (result[1][0].role == 4) {
          wflowdata = wflowdata.filter(data => data.includes('e')).map(data1 => {
            return data1.split('or').filter(data2 => data2.includes('e')).map(data3 => data3.replace('e', ''))[0]
          })
        }
        for (let j = 0; j < wflowdata.length; j++) {
          for (let k = 0; k < result[1].length; k++) {
            if (result[1][k].id == wflowdata[j]) {
              narr.push(result[0][i].wid);
              break;
            }
          }
        }
      }
      let metype = 1;
      let myrole = 4;
      if (result[1][0].role == 3) {
        myrole = 3;
        metype = 0;
      }
      con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
      RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus from datarumprequest where rumprequestmetype=? and rumprequestflowfk in(?) and RUMPRequestStatus='Closed' and RUMPRequestCancelStatus=0 order by rumprequestpk desc  `,
        [metype, narr], (err1, result1) => {
          if (err1) throw err1;
          res.end(JSON.stringify(result1))
        }
      )
    }
    else {
      for (let i = 0; i < result[0].length; i++) {
        let wflowdata = result[0][i].wflow.split(',');
        wflowdata = wflowdata.filter(data => !data.includes('or') && !data.includes('i'));
        for (let j = 0; j < wflowdata.length; j++) {
          for (let k = 0; k < result[1].length; k++) {
            if (result[1][k].id == wflowdata[j]) {
              narr.push(result[0][i].wid);
              break;
            }
          }
        }
      }
      con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
            RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus from datarumprequest where rumprequestflowfk in(?) and RUMPRequestStatus='Closed' and RUMPRequestCancelStatus=0 order by rumprequestpk desc`,
        [narr], (err3, result2) => {
          if (err3) throw err3;
          res.end(JSON.stringify(result2))
        }
      )
    }
  })



});

router.post("/completeReqSwitch", (req, res) => {
  let narr = [];
  con.query(`select linkrumprequestflowpk as wid,w_flow as wflow from linkrumprequestflow;
  select linkrumpadminaccesspk as id,linkRUMPRoleFK as role from linkrumpadminaccess where linkRUMPAdminFK=${req.body.userId};`, [req.body.role, req.body.space], (err2, result) => {
    if (err2) throw err2;
    if (result[1][0].role == 3 || result[1][0].role == 4) {
      for (let i = 0; i < result[0].length; i++) {
        let wflowdata = result[0][i].wflow.split(',');
        if (result[1][0].role == 3) {
          wflowdata = wflowdata.filter(data => data.includes('c')).map(data1 => {
            return data1.split('or').filter(data2 => data2.includes('c')).map(data3 => data3.replace('c', ''))[0]
          })
        }
        else if (result[1][0].role == 4) {
          wflowdata = wflowdata.filter(data => data.includes('e')).map(data1 => {
            return data1.split('or').filter(data2 => data2.includes('e')).map(data3 => data3.replace('e', ''))[0]
          })
        }
        for (let j = 0; j < wflowdata.length; j++) {
          for (let k = 0; k < result[1].length; k++) {
            if (result[1][k].id == wflowdata[j]) {
              narr.push(result[0][i].wid);
              break;
            }
          }
        }
      }
      let metype = 1;
      let myrole = 4;
      if (result[1][0].role == 3) {
        myrole = 3;
        metype = 0;
      }
      con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
    RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus
     from datarumprequest where rumprequestmetype=? and rumprequestflowfk in(?) and RUMPRequestStatus='Completed' and RUMPRequestCancelStatus=0 order by RUMPRequestDate desc`,
        [metype, narr], (err1, result1) => {
          if (err1) throw err1;
          res.end(JSON.stringify(result1))
        }
      )
    }
    else {
      for (let i = 0; i < result[0].length; i++) {
        let wflowdata = result[0][i].wflow.split(',');
        wflowdata = wflowdata.filter(data => !data.includes('or') && !data.includes('i'));
        for (let j = 0; j < wflowdata.length; j++) {
          for (let k = 0; k < result[1].length; k++) {
            if (result[1][k].id == wflowdata[j]) {
              narr.push(result[0][i].wid);
              break;
            }
          }
        }
      }
      con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
    RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus
     from datarumprequest where rumprequestflowfk in(?) and RUMPRequestStatus='Completed' and RUMPRequestCancelStatus=0 order by RUMPRequestDate desc`,
        [narr], (err3, result3) => {
          if (err3) throw err3;
          res.end(JSON.stringify(result3))
        }
      )
    }
  })
});
module.exports = router;
