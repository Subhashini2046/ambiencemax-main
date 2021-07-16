let express = require("express"),
    async = require("async"),
    router = express.Router(),
    con = require("../mysql_config/config");


router.post("/openReqSwitch", (req, res) => {
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
            con.query(`select linkRUMPSpace,linkrumprolefk,RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
          RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus,ispnc from datarumprequest 
          inner join linkrumpadminaccess on linkrumpadminaccesspk=rumprequestlevel
          where rumprequestmetype=? and rumprequestflowfk in(?) and linkrumprolefk=? and linkRUMPSpace in (select linkRUMPSpace from linkrumpadminaccess where linkRUMPAdminFK=${req.body.userId} order by linkrumprolefk)
          and RUMPRequestCancelStatus=0 order by RUMPRequestdate desc`,
                [metype, narr, myrole, req.body.space], (err1, result1) => {
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
            con.query(`select linkRUMPSpace,linkrumprolefk,RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
    RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus,ispnc from datarumprequest inner join linkrumpadminaccess on linkrumpadminaccesspk=rumprequestlevel
    where rumprequestflowfk in(?) and linkRUMPRoleFK in (select distinct linkRUMPRoleFK from linkrumpadminaccess where linkRUMPAdminFK=${req.body.userId}) and
    RUMPRequestStatus='Pending' and linkRUMPSpace in (select linkRUMPSpace from linkrumpadminaccess where linkRUMPAdminFK=${req.body.userId} order by linkrumprolefk) and RUMPRequestCancelStatus=0 order by RUMPRequestdate desc;`,
                [narr], (err3, result3) => {
                    if (err3) throw err3;
                    res.end(JSON.stringify(result3))
                }
            )
        }
    })
});


// router.post("/openReqSwitch", (req, res) => {
//   if (req.body.role == 0) {
//     con.query(`select linkRUMPSpace,linkrumprolefk,RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
//     RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus,ispnc from datarumprequest
//     inner join linkrumpadminaccess on rumprequestlevel=linkRUMPAdminAccessPK
//     where linkrumprolefk=0  and 
//     linkRUMPSpace in (select linkRUMPSpace from linkrumpadminaccess where linkRUMPAdminFK=346755 and linkRUMPRoleFK=0 order by linkrumprolefk) 
//     and RUMPRequestStatus='Pending' and RUMPRequestCancelStatus=0 order by RUMPRequestdate desc;`, [req.body.space], (err, result) => {
//       if (err) throw err;
//       res.end(JSON.stringify(result))
//     })
//   } else if (req.body.role == 3 || req.body.role == 4) {
//     let myrole = req.body.role;
//     let narr = [];
//     con.query(`select linkrumprequestflowpk as wid,w_flow as wflow from linkrumprequestflow;
//     select linkrumpadminaccesspk as id from linkrumpadminaccess where linkrumprolefk=3 and linkRUMPAdminFK=112951;`, [req.body.role, req.body.space], (error, result) => {
//       if (error) throw error;

//       for (let i = 0; i < result[0].length; i++) {
//         let wflowdata = result[0][i].wflow.split(',');
//         if (myrole == 3) {
//           wflowdata = wflowdata.filter(data => data.includes('c')).map(data1 => {
//             return data1.split('or').filter(data2 => data2.includes('c')).map(data3 => data3.replace('c', ''))[0]
//           })
//         }
//         else if (myrole == 4) {
//           wflowdata = wflowdata.filter(data => data.includes('e')).map(data1 => {
//             return data1.split('or').filter(data2 => data2.includes('e')).map(data3 => data3.replace('e', ''))[0]
//           })
//         }
//         for (let j = 0; j < wflowdata.length; j++) {
//           for (let k = 0; k < result[1].length; k++) {
//             if (result[1][k].id == wflowdata[j]) {
//               narr.push(result[0][i].wid);
//               break;
//             }
//           }
//         }
//       }
//       console.log("narr",narr)
//       let metype = 1;
//       if (myrole == 3) {
//         metype = 0;
//       }
//       con.query(`select linkRUMPSpace,linkrumprolefk,RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
//       RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus,ispnc from datarumprequest inner join linkrumpadminaccess on linkrumpadminaccesspk=rumprequestlevel
//         where rumprequestmetype=? and rumprequestflowfk in(?) and linkrumprolefk=3 and linkRUMPSpace in (select linkRUMPSpace from linkrumpadminaccess where linkRUMPAdminFK=112951 and linkRUMPRoleFK=3 order by linkrumprolefk)
//          and RUMPRequestCancelStatus=0 order by RUMPRequestdate desc`,
//         [metype, narr, myrole, req.body.space], (err1, result1) => {
//           if (err1) throw err1;
//           res.end(JSON.stringify(result1))
//         }
//       )
//     })
//   } else {
//     let narr = [];
//     con.query(`select linkrumprequestflowpk as wid,w_flow as wflow from linkrumprequestflow;
//       select linkrumpadminaccesspk as id from linkrumpadminaccess where linkRUMPAdminFK=112591;`, [req.body.role, req.body.space], (err2, result) => {
//       if (err2) throw err2;
//       for (let i = 0; i < result[0].length; i++) {
//         let wflowdata = result[0][i].wflow.split(',');
//         wflowdata = wflowdata.filter(data => !data.includes('or') && !data.includes('i'));
//         for (let j = 0; j < wflowdata.length; j++) {
//           for (let k = 0; k < result[1].length; k++) {
//             if (result[1][k].id == wflowdata[j]) {
//               narr.push(result[0][i].wid);
//               break;
//             }
//           }
//         }
//       }

//       con.query(`select linkRUMPSpace,linkrumprolefk,RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
//       RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus,ispnc from datarumprequest inner join linkrumpadminaccess on linkrumpadminaccesspk=rumprequestlevel
//         where rumprequestflowfk in(?) and linkRUMPSpace in (select linkRUMPSpace from linkrumpadminaccess where linkRUMPAdminFK=112951 order by linkrumprolefk) and RUMPRequestCancelStatus=0 order by RUMPRequestdate desc;`,
//         [narr, req.body.role], (err3, result3) => {
//           if (err3) throw err3;
//           res.end(JSON.stringify(result3))
//         }
//       )
//     })
//   }

// });
module.exports = router;