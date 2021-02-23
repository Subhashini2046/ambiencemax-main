let express = require("express"),
  async = require("async"),
  router = express.Router(),
  con = require("../mysql_config/config");

router.post("/allReq", (req, res) => {
  if (req.body.role == 0) {
    con.query(`select * from datarumprequest
    inner join linkrumpadminaccess on RUMPInitiatorId=linkRUMPAdminAccessPK
    where linkrumprolefk=0 and linkRUMPSpace=?`, req.body.space, (err, result) => {
      if (err) throw err;
      res.end(JSON.stringify(result))
    })
  } else if (req.body.role == 3 || req.body.role == 4) {
    let myrole = req.body.role;
    let narr = [];
    con.query(`select w_id as wid,w_flow as wflow from linkrumprequestflow;
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
      con.query(`select * from datarumprequest where rumprequestmetype=? and rumprequestflowfk in(?)  `,
        [metype,narr], (err, result) => {
          if (err) throw err;
          res.end(JSON.stringify(result))
        }
      )
    })
  } else {
    let narr = [];
    con.query(`select w_id as wid,w_flow as wflow from linkrumprequestflow;
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
      con.query(`select * from datarumprequest where rumprequestflowfk in(?)`,
        [narr], (err, result) => {
          if (err) throw err;
          res.end(JSON.stringify(result))
        }
      )
    })
  }
});
module.exports = router;