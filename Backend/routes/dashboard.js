let express = require("express"),
  async = require("async"),
  router = express.Router(),
  con = require("../mysql_config/config");

  router.post("/dashboard", (req, res) => {
    let space = req.body.space;
    let role = req.body.role;
console.log(space,role,"/////////////////////")
    req_stats = {
      All: 0,
      Pending: 0,
      Closed: 0,
      Open: 0,
      Completed: 0
    }

    if (req.body.role == 0) {

      console.log("mmmmmmmmm");

      con.query(`select count(*) as "all" from datarumprequest inner join linkrumpadminaccess on RUMPInitiatorId=linkRUMPAdminAccessPK where linkrumprolefk=0 and linkRUMPSpace=${space} ; 
      select count(*) as "completed" from datarumprequest inner join linkrumpadminaccess on RUMPInitiatorId=linkRUMPAdminAccessPK where linkrumprolefk=0 and linkRUMPSpace=${space} and RUMPRequestStatus='Completed'; 
      select count(*) as "closed" from datarumprequest inner join linkrumpadminaccess on RUMPInitiatorId=linkRUMPAdminAccessPK where linkrumprolefk=0 and linkRUMPSpace=${space} and RUMPRequestStatus='Closed'; 
      select count(*) as "pending" from datarumprequest inner join linkrumpadminaccess as t1 on RUMPInitiatorId=t1.linkRUMPAdminAccessPK inner join linkrumpadminaccess as t2 on RumprequestLevel=t2.linkRUMPAdminAccessPK where t1.linkrumprolefk=0 and t1.linkRUMPSpace=${space} and RUMPRequestStatus='Pending' and (t1.linkrumpspace!=t2.linkRUMPSpace or t1.linkRUMPRoleFK != t2.linkRUMPRoleFK); 
      select count(*) as "open" from datarumprequest inner join linkrumpadminaccess on rumprequestlevel=linkRUMPAdminAccessPK where linkrumprolefk=0 and linkRUMPSpace=${space} and RUMPRequestStatus='Pending';`, (err, result) => {
        if (err) throw err;
        console.log(result[0],"-------");
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
          req_stats: req_stats
          })
        );

      })



    } else if (req.body.role == 3 || req.body.role == 4) {
      let myrole = req.body.role;
      let narr = [];
      con.query(`select w_id as wid,w_flow as wflow from linkrumprequestflow;
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
        con.query(`select count(*) as "all" from datarumprequest where rumprequestmetype=${metype} and rumprequestflowfk in(${[...narr]}); 
        select count(*) as "completed" from datarumprequest where rumprequestmetype=${metype} and rumprequestflowfk in(${[...narr]}) and RUMPRequestStatus='Completed'; 
        select count(*) as "closed" from datarumprequest where rumprequestmetype=${metype} and rumprequestflowfk in(${[...narr]}) and RUMPRequestStatus='Closed';
        select count(*) as "pending" from datarumprequest inner join linkrumpadminaccess as t2 on RumprequestLevel=t2.linkRUMPAdminAccessPK where rumprequestmetype=${metype} and rumprequestflowfk in(${[...narr]}) and RUMPRequestStatus='Pending' and t2.linkRUMPSpace != ${space} or t2.linkrumprolefk != ${role};
        select count(*) as "open" from datarumprequest inner join linkrumpadminaccess on linkrumpadminaccesspk=rumprequestlevel where rumprequestmetype=${metype} and rumprequestflowfk in(${[...narr]}) and linkrumprolefk=${role} and linkRUMPSpace=${space} `,
         (err, result) => {
            if (err) throw err;
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
              req_stats: req_stats
              })
            );

          }
        )
      })
    } else {
      let narr = [];
      con.query(`select w_id as wid,w_flow as wflow from linkrumprequestflow;
      select linkrumpadminaccesspk as id from linkrumpadminaccess where linkrumprolefk=${role} and linkrumpspace=${space} ;`, (err, result) => {
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
        console.log(narr,"\\\\\\\\\\");
        con.query(`select count(*) as "all" from datarumprequest where rumprequestflowfk in(${narr}); 
        select count(*) as "completed" from datarumprequest where rumprequestflowfk in(${narr}) and RUMPRequestStatus='Completed'; 
        select count(*) as "closed" from datarumprequest where rumprequestflowfk in(${narr}) and RUMPRequestStatus='Closed'; 
        select count(*) as "pending" from datarumprequest inner join linkrumpadminaccess as t2 on RumprequestLevel=t2.linkRUMPAdminAccessPK where rumprequestflowfk in(${narr}) and RUMPRequestStatus='Pending' and t2.linkRUMPSpace != ${space} or t2.linkrumprolefk != ${role}; 
        select count(*) as "open" from datarumprequest inner join linkrumpadminaccess on linkrumpadminaccesspk=rumprequestlevel where rumprequestflowfk in(${narr}) and linkrumprolefk=${role} and linkRUMPSpace=${space};`,
           (err, result) => {
            if (err) throw err;
            console.log("///////////",result[0].all);
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
              req_stats: req_stats
              })
            );

          }
        )
      })
    }

  });

 
  module.exports = router;