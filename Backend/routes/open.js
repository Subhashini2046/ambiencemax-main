let express = require("express"),
  async = require("async"),
  router = express.Router(),
  con = require("../mysql_config/config");

router.post("/openReq", (req, res) => {
  if (req.body.role == 0) {
    console.log("ddddd", req.body.role)
    con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
    RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus,ispnc from datarumprequest
      inner join linkrumpadminaccess on rumprequestlevel=linkRUMPAdminAccessPK
      where linkrumprolefk=0 and linkRUMPSpace=? and RUMPRequestStatus='Pending' order by RUMPRequestdate desc`, [req.body.space, req.body.access_id], (err, result) => {
      if (err) throw err;
      res.end(JSON.stringify(result))
    })
  } else if (req.body.role == 3 || req.body.role == 4) {
    let myrole = req.body.role;
    console.log("----", req.body.access_id)
    let narr = [];
    con.query(`select linkrumprequestflowpk as wid,w_flow as wflow from linkrumprequestflow;
      select linkrumpadminaccesspk as id from linkrumpadminaccess where linkrumprolefk=? and linkrumpspace=? ;`, [req.body.role, req.body.space], (err, result) => {
      if (err) throw err;

      for (let i = 0; i < result[0].length; i++) {
        let wflowdata = result[0][i].wflow.split(',');
        if (myrole == 3) {
          console.log("bbb", wflowdata)
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
      let metype = 1;
      if (myrole == 3) {
        metype = 0;
      }
      con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
      RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus,ispnc from datarumprequest inner join linkrumpadminaccess on linkrumpadminaccesspk=rumprequestlevel
        where rumprequestmetype=? and rumprequestflowfk in(?) and linkrumprolefk=? and linkRUMPSpace=? order by RUMPRequestdate desc`,
        [metype, narr, myrole, req.body.space], (err, result) => {
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
        console.log("dddddd", result[1]);
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
      RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus,ispnc from datarumprequest inner join linkrumpadminaccess on linkrumpadminaccesspk=rumprequestlevel
        where rumprequestflowfk in(?) and linkrumprolefk=? and linkRUMPSpace=? order by RUMPRequestdate desc;`,
        [narr, req.body.role, req.body.space], (err, result) => {
          if (err) throw err;
          res.end(JSON.stringify(result))
        }
      )
    })
  }

});

module.exports = router;