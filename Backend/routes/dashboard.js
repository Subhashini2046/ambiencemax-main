let express = require("express"),
  async = require("async"),
  router = express.Router(),
  con = require("../mysql_config/config");

  router.post("/dashboard", (req, res) => {
    let space = req.body.space;
    let role = req.body.role;
    req_stats = {
      All: 0,
      Pending: 0,
      Closed: 0,
      Open: 0,
      Completed: 0
    }
   let unreadStatusAll=0;
   let unreadStatuscompleted=0;
   let unreadStatusclosed=0;
   let unreadStatuspending=0;
   let unreadStatusopen=0;
    if (req.body.role == 0) {

      con.query(`select SUM(CASE WHEN RUMPRequestUnreadStatus=1 THEN 1 ELSE 0 END) as UnreadStatusAll,count(*) as "all" from datarumprequest inner join linkrumpadminaccess on RUMPInitiatorId=linkRUMPAdminAccessPK where linkrumprolefk=0 and linkRUMPSpace=${space} and RUMPRequestCancelStatus=0; 
      select SUM(CASE WHEN RUMPRequestUnreadStatus=1 THEN 1 ELSE 0 END) as UnreadStatuscompleted,count(*) as "completed" from datarumprequest inner join linkrumpadminaccess on RUMPInitiatorId=linkRUMPAdminAccessPK where linkrumprolefk=0 and linkRUMPSpace=${space} and RUMPRequestStatus='Completed'and RUMPRequestCancelStatus=0; 
      select SUM(CASE WHEN RUMPRequestUnreadStatus=1 THEN 1 ELSE 0 END) as UnreadStatusclosed,count(*) as "closed" from datarumprequest inner join linkrumpadminaccess on RUMPInitiatorId=linkRUMPAdminAccessPK where linkrumprolefk=0 and linkRUMPSpace=${space} and RUMPRequestStatus='Closed' and RUMPRequestCancelStatus=0; 
      select SUM(CASE WHEN RUMPRequestUnreadStatus=1 THEN 1 ELSE 0 END) as UnreadStatuspending,count(*) as "pending" from datarumprequest inner join linkrumpadminaccess as t1 on RUMPInitiatorId=t1.linkRUMPAdminAccessPK inner join linkrumpadminaccess as t2 on RumprequestLevel=t2.linkRUMPAdminAccessPK where t1.linkrumprolefk=0 and t1.linkRUMPSpace=${space} and RUMPRequestStatus='Pending' and RUMPRequestCancelStatus=0 and (t1.linkrumpspace!=t2.linkRUMPSpace or t1.linkRUMPRoleFK != t2.linkRUMPRoleFK); 
      select SUM(CASE WHEN RUMPRequestUnreadStatus=1 THEN 1 ELSE 0 END) as UnreadStatusopen,count(*) as "open" from datarumprequest inner join linkrumpadminaccess on rumprequestlevel=linkRUMPAdminAccessPK where linkrumprolefk=0 and linkRUMPSpace=${space} and RUMPRequestStatus='Pending' and RUMPRequestCancelStatus=0;`, (err, result) => {
        if (err) throw err;
        unreadStatusAll=result[0][0].UnreadStatusAll;
        unreadStatuscompleted=result[1][0].UnreadStatuscompleted;
        unreadStatusclosed=result[2][0].UnreadStatusclosed;
        unreadStatuspending=result[3][0].UnreadStatuspending;
        unreadStatusopen=result[4][0].UnreadStatusopen;
        req_stats = {
          
          All: result[0][0].all,
          Pending:  result[3][0].pending,
          Closed:  result[2][0].closed,
          Open:  result[4][0].open,
          Completed:  result[1][0].completed
        }

        res.send(
          JSON.stringify({
          result: "passed",
          req_stats: req_stats,
          UnreadStatusAll:unreadStatusAll,
          UnreadStatuscompleted:unreadStatuscompleted,
          UnreadStatusclosed:unreadStatusclosed,
          UnreadStatuspending:unreadStatuspending,
          UnreadStatusopen:unreadStatusopen
          })
        );

      })



    } else if (req.body.role == 3 || req.body.role == 4) {
      let myrole = req.body.role;
      let narr = [];
      con.query(`select linkrumprequestflowpk as wid,w_flow as wflow from linkrumprequestflow;
      select linkrumpadminaccesspk as id from linkrumpadminaccess where linkrumprolefk=${role} and linkrumpspace=${space} ;`, (err, result) => {
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
        let unreadStatusAll=0;
        let unreadStatuscompleted=0;
        let unreadStatusclosed=0;
        let unreadStatuspending=0;
        let unreadStatusopen=0;

        con.query(`select SUM(CASE WHEN RUMPRequestUnreadStatus=1 THEN 1 ELSE 0 END) as UnreadStatusAll,count(*) as "all" from datarumprequest where rumprequestmetype=${metype} and rumprequestflowfk in(${[...narr]}) and RUMPRequestCancelStatus=0; 
        select SUM(CASE WHEN RUMPRequestUnreadStatus=1 THEN 1 ELSE 0 END) as UnreadStatuscompleted,count(*) as "completed" from datarumprequest where rumprequestmetype=${metype} and rumprequestflowfk in(${[...narr]}) and RUMPRequestStatus='Completed'and RUMPRequestCancelStatus=0; 
        select SUM(CASE WHEN RUMPRequestUnreadStatus=1 THEN 1 ELSE 0 END) as UnreadStatusclosed,count(*) as "closed" from datarumprequest where rumprequestmetype=${metype} and rumprequestflowfk in(${[...narr]}) and RUMPRequestStatus='Closed'and RUMPRequestCancelStatus=0;
        select SUM(CASE WHEN RUMPRequestUnreadStatus=1 THEN 1 ELSE 0 END) as UnreadStatuspending,count(*) as "pending" from datarumprequest inner join linkrumpadminaccess as t2 on RumprequestLevel=t2.linkRUMPAdminAccessPK where rumprequestmetype=${metype} and rumprequestflowfk in(${[...narr]}) and RUMPRequestStatus='Pending' and RUMPRequestCancelStatus=0 and (t2.linkRUMPSpace != ${space} or t2.linkrumprolefk != ${role});
        select SUM(CASE WHEN RUMPRequestUnreadStatus=1 THEN 1 ELSE 0 END) as UnreadStatusopen,count(*) as "open" from datarumprequest inner join linkrumpadminaccess on linkrumpadminaccesspk=rumprequestlevel where rumprequestmetype=${metype} and rumprequestflowfk in(${[...narr]}) and linkrumprolefk=${role} and RUMPRequestCancelStatus=0 and linkRUMPSpace=${space} `,
         (err, result) => {
            if (err) throw err;
        unreadStatusAll=result[0][0].UnreadStatusAll;
        unreadStatuscompleted=result[1][0].UnreadStatuscompleted;
        unreadStatusclosed=result[2][0].UnreadStatusclosed;
        unreadStatuspending=result[3][0].UnreadStatuspending;
        unreadStatusopen=result[4][0].UnreadStatusopen;
            req_stats = {
              All: result[0][0].all,
          Pending:  result[3][0].pending,
          Closed:  result[2][0].closed,
          Open:  result[4][0].open,
          Completed:  result[1][0].completed
            }

            res.send(
              JSON.stringify({
              result: "passed",
              req_stats: req_stats,
              UnreadStatusAll:unreadStatusAll,
          UnreadStatuscompleted:unreadStatuscompleted,
          UnreadStatusclosed:unreadStatusclosed,
          UnreadStatuspending:unreadStatuspending,
          UnreadStatusopen:unreadStatusopen
              })
            );

          }
        )
      })
    } else {
      let narr = [];
      let unreadStatusAll=0;
      let unreadStatuscompleted=0;
      let unreadStatusclosed=0;
      let unreadStatuspending=0;
      let unreadStatusopen=0;
      con.query(`select linkrumprequestflowpk as wid,w_flow as wflow from linkrumprequestflow;
      select linkrumpadminaccesspk as id from linkrumpadminaccess where linkrumprolefk=${role} and linkrumpspace=${space} ;`, (err, result) => {
        if (err) throw err;
        for (let i = 0; i < result[0].length; i++) {
          let wflowdata = result[0][i].wflow.split(',');
          wflowdata = wflowdata.filter(data => !data.includes('or') && !data.includes('i'));
          for (let j = 0; j < wflowdata.length; j++) {
            for (k = 0; k < result[1].length; k++) {
              if (result[1][k].id == wflowdata[j]) {
                narr.push(result[0][i].wid);
                break;
              }
            }
          }
        }
        con.query(`select SUM(CASE WHEN RUMPRequestUnreadStatus=1 THEN 1 ELSE 0 END) as UnreadStatusAll,count(*) as "all" from datarumprequest where rumprequestflowfk in(${narr}) and RUMPRequestCancelStatus=0; 
        select SUM(CASE WHEN RUMPRequestUnreadStatus=1 THEN 1 ELSE 0 END) as UnreadStatuscompleted,count(*) as "completed" from datarumprequest where rumprequestflowfk in(${narr}) and RUMPRequestStatus='Completed' and RUMPRequestCancelStatus=0; 
        select SUM(CASE WHEN RUMPRequestUnreadStatus=1 THEN 1 ELSE 0 END) as UnreadStatusclosed, count(*) as "closed" from datarumprequest where rumprequestflowfk in(${narr}) and RUMPRequestStatus='Closed'; 
        select SUM(CASE WHEN RUMPRequestUnreadStatus=1 THEN 1 ELSE 0 END) as UnreadStatuspending, count(*) as "pending" from datarumprequest inner join linkrumpadminaccess as t2 on RumprequestLevel=t2.linkRUMPAdminAccessPK where rumprequestflowfk in(${narr}) and RUMPRequestStatus='Pending' and RUMPRequestCancelStatus=0 and (t2.linkRUMPSpace != ${space} or t2.linkrumprolefk != ${role}); 
        select SUM(CASE WHEN RUMPRequestUnreadStatus=1 THEN 1 ELSE 0 END) as UnreadStatusopen, count(*) as "open" from datarumprequest inner join linkrumpadminaccess on linkrumpadminaccesspk=rumprequestlevel where rumprequestflowfk in(${narr}) and linkrumprolefk=${role} and linkRUMPSpace=${space} and RUMPRequestCancelStatus=0;`,
           (err, result) => {
            if (err) throw err;
        unreadStatusAll=result[0][0].UnreadStatusAll;
        unreadStatuscompleted=result[1][0].UnreadStatuscompleted;
        unreadStatusclosed=result[2][0].UnreadStatusclosed;
        unreadStatuspending=result[3][0].UnreadStatuspending;
        unreadStatusopen=result[4][0].UnreadStatusopen;
            req_stats = {
              All: result[0][0].all,
          Pending:  result[3][0].pending,
          Closed:  result[2][0].closed,
          Open:  result[4][0].open,
          Completed:  result[1][0].completed
            }

            res.send(
              JSON.stringify({
              result: "passed",
              req_stats: req_stats,
          UnreadStatusAll:unreadStatusAll,
          UnreadStatuscompleted:unreadStatuscompleted,
          UnreadStatusclosed:unreadStatusclosed,
          UnreadStatuspending:unreadStatuspending,
          UnreadStatusopen:unreadStatusopen
              })
            );

          }
        )
      })
    }

  });

 
  module.exports = router;