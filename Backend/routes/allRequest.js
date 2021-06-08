let express = require("express"),
  async = require("async"),
  router = express.Router(),
  con = require("../mysql_config/config");

// router.post("/allReq", (req, res) => {
//   if (req.body.role == 0) {
//     con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
//     RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus from datarumprequest
//     inner join linkrumpadminaccess on RUMPInitiatorId=linkRUMPAdminAccessPK
//     where linkrumprolefk=0 and linkRUMPSpace=? order by RUMPRequestdate desc`, req.body.space, (err, result) => {
//       if (err) throw err;
//       res.end(JSON.stringify(result))
//     })
//   } else if (req.body.role == 3 || req.body.role == 4) {
//     let myrole = req.body.role;
//     let narr = [];
//     // con.query(`select linkrumprequestflowpk as wid,w_flow as wflow from linkrumprequestflow;
//     // select linkrumpadminaccesspk as id from linkrumpadminaccess where linkrumprolefk=? and linkrumpspace=? ;`, [req.body.role, req.body.space], (err, result) => {
//     //   if (err) throw err;
//     //   for (let i = 0; i < result[0].length; i++) {
//     //     let wflowdata = result[0][i].wflow.split(',');
//     //     if (myrole == 3) {
//     //       wflowdata = wflowdata.filter(data => data.includes('c')).map(data => {
//     //         return data.split('or').filter(data => data.includes('c')).map(data => data.replace('c', ''))[0]
//     //       })
//     //     }
//     //     else if (myrole == 4) {
//     //       wflowdata = wflowdata.filter(data => data.includes('e')).map(data => {
//     //         return data.split('or').filter(data => data.includes('e')).map(data => data.replace('e', ''))[0]
//     //       })
//     //     }
//     //     for (let j = 0; j < wflowdata.length; j++) {
//     //       for (k = 0; k < result[1].length; k++) {
//     //         if (result[1][k].id == wflowdata[j]) {
//     //           narr.push(result[0][i].wid);
//     //           break;
//     //         }
//     //       }
//     //     }
//     //   }
//     con.query(`select linkrumprequestflowpk as wid
//     from linkrumprequestflow where 
//     if(${myrole}=3,REVERSE(SUBSTRING_INDEX(REVERSE(SUBSTRING_INDEX(w_flow, 'c', 1)), ',', 1)),
//     REVERSE(SUBSTRING_INDEX(REVERSE(SUBSTRING_INDEX(w_flow, 'e', 1)), 'r', 1)))=(select linkrumpadminaccesspk as id from linkrumpadminaccess where linkrumprolefk=? and linkrumpspace=?);`,
//     [req.body.role, req.body.space], (err, result) => {
//       if (err) throw err;
//       for (let i = 0; i < result.length; i++) {
//         narr.push(result[i].wid);
//       }
//       let metype=1;
//       if(myrole==3){
//         metype=0;
//       }
//       con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
//       RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus from datarumprequest where rumprequestmetype=? and rumprequestflowfk in(?) order by RUMPRequestdate desc `,
//         [metype,narr], (err, result) => {
//           if (err) throw err;
//           res.end(JSON.stringify(result))
//         }
//       )
//     })
//   } else {
//     let narr = [];
//     con.query(`select linkrumprequestflowpk as wid,w_flow as wflow from linkrumprequestflow;
//     select linkrumpadminaccesspk as id from linkrumpadminaccess where linkrumprolefk=? and linkrumpspace=? ;`, [req.body.role, req.body.space], (err, result) => {
//       if (err) throw err;
//       for (let i = 0; i < result[0].length; i++) {
//         let wflowdata = result[0][i].wflow.split(',');
//         wflowdata = wflowdata.filter(data => !data.includes('or') && !data.includes('i'));
//         for (let j = 0; j < wflowdata.length; j++) {
//           for (k = 0; k < result[1].length; k++) {
//             if (result[1][k].id == wflowdata[j]) {
//               narr.push(result[0][i].wid);
//               break;
//             }
//           }
//         }
//       }
//       con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
//       RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus from datarumprequest where rumprequestflowfk in(?) order by RUMPRequestdate desc`,
//         [narr], (err, result) => {
//           if (err) throw err;
//           res.end(JSON.stringify(result))
//         }
//       )
//     })
//   }
// });



router.post("/allReq", (req, res) => {
  if (req.body.role == 0) {
    con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
    RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus from datarumprequest
    inner join linkrumpadminaccess on RUMPInitiatorId=linkRUMPAdminAccessPK
    where linkrumprolefk=0 and linkRUMPSpace=? and RUMPRequestCancelStatus=0 order by RUMPRequestdate desc`, req.body.space, (err, result) => {
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
      RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus from datarumprequest where rumprequestmetype=? and rumprequestflowfk in(?) and RUMPRequestCancelStatus=0 order by RUMPRequestdate desc `,
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
      RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus from datarumprequest where rumprequestflowfk in(?) and RUMPRequestCancelStatus=0 order by RUMPRequestdate desc`,
        [narr], (err, result) => {
          if (err) throw err;
          res.end(JSON.stringify(result))
        }
      )
    })
  }
});
module.exports = router;