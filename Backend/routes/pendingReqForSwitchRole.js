let express = require("express"),
  async = require("async"),
  router = express.Router(),
  con = require("../mysql_config/config");

  router.post("/pendingReqSwitch",(req,res) =>{

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
            RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus,ispnc from datarumprequest 
            inner join linkrumpadminaccess as t2 on (RumprequestLevel=t2.linkRUMPAdminAccessPK) 
            where rumprequestmetype=? and rumprequestflowfk in(?) and RUMPRequestStatus='Pending' and 
            RUMPRequestCancelStatus=0 and (t2.linkRUMPSpace not in (select linkRUMPSpace from linkrumpadminaccess where linkRUMPAdminFK=${req.body.userId} order by linkrumprolefk)
             or t2.linkrumprolefk not in (select distinct linkRUMPRoleFK from linkrumpadminaccess where linkRUMPAdminFK=${req.body.userId})) 
            order by RUMPRequestdate desc`,
              [metype,[...narr],req.body.space,req.body.role], (err1, result1) => {
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
            con.query(`select distinct RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
            RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus,ispnc from datarumprequest 
            inner join linkrumpadminaccess as t1 on RUMPInitiatorId=t1.linkRUMPAdminAccessPK inner join linkrumpadminaccess as t2 on RumprequestLevel=t2.linkRUMPAdminAccessPK 
            where (t1.linkRUMPRoleFK=0 and t1.linkRUMPSpace in (select linkRUMPSpace from linkrumpadminaccess where linkRUMPAdminFK=${req.body.userId} order by linkrumprolefk) 
            and RUMPRequestStatus='Pending' and RUMPRequestCancelStatus=0 and (t1.linkrumpspace!=t2.linkRUMPSpace or t1.linkRUMPRoleFK != t2.linkRUMPRoleFK)) 
            or (rumprequestflowfk in(?) and RUMPRequestStatus='Pending' and RUMPRequestCancelStatus=0 and 
            (t2.linkRUMPSpace not in (select linkRUMPSpace from linkrumpadminaccess where linkRUMPAdminFK=${req.body.userId} order by linkrumprolefk) or 
            t2.linkrumprolefk not in (select distinct linkRUMPRoleFK from linkrumpadminaccess where linkRUMPAdminFK=${req.body.userId})))
            order by RUMPRequestdate desc`,
              [narr], (err3, result4) => {
                if (err3) throw err3;
                res.end(JSON.stringify(result4))
              }
            )
        }
    })
    });
 
  module.exports = router;