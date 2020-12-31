let express = require("express"),
  async = require("async"),
  router = express.Router(),
  con = require("../mysql_config/config");

router.post("/approve", (req, res) => {
  role = req.body.userRole;
  reqId = req.body.req_id;
  console.log('role....', role);
  console.log('reqId......', reqId);
  sql = `update requests set req_level = '${role}' where req_id = '${reqId}';`
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  })
})

router.post("/workflow", (req, res) => {
  reqId = req.body.req_id;
  console.log(reqId);
  sql = `Select w_flow from requests inner join workflow on requests.w_id = workflow.w_id where req_id = '${reqId}';`
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  })
})
router.get("/getRole", (req, res) => {
  reqId = req.body.req_id;
  sql = `Select role_name from roles order by role_id;`
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(JSON.stringify({
        result: "passed",
        role_name: result
      }));
    }
  })
})

router.post("/viewStatus", (req, res) => {
  reqId = req.body.req_id;
  console.log(reqId);
  w_flow = [];
  role = [];
  role1 = [];
  sql = `Select w_flow from requests inner join workflow on requests.w_id = workflow.w_id where req_id = '${reqId}';`
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      w_flow = result[0].w_flow.split(',');
      console.log("............");
      console.log(w_flow);
      sql1 = `Select * from roles;`
      con.query(sql1, function (err, result) {
        if (err) {
          console.log(err);
          console.log(result);

        }
        else {
          role = result;
          role.forEach((e1) => {
            for (let i = 0; i < w_flow.length; i++) {
              if (e1.role_id == w_flow[i]) {
                role1.push(e1);
              }
            }
          });
          res.send(
            JSON.stringify({
              result: "passed",
              w_flow: w_flow,
              role: role1
            })
          );
        }

      });
    }
  })
})

router.post("/viewRequestLog",(req,res) =>{
  reqId = req.body.reqId;
  console.log("//////////",reqId);
  sql1 = `select areq_action as req_action, aaction_taken_by, atime_stamp as req_date,time(atime_stamp) as req_time from request_actionnnn where req_id='${reqId}';`
    con.query(sql1, (err, result) => {
  if (err) {
    console.log(err);
  }
  else {
    console.log(result);
    res.send(
      JSON.stringify({
        result: "passed",
        req_data: result
      })
    );
  }
})
});

router.post("/closeReq", (req, res) => {
  reqId = req.body.req_id;
  console.log('Close Route called' + reqId);
  sql = `Update requests set req_status = 'closed' where req_id = '${reqId}';`;
  con.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log(res);
    }
  })
});

module.exports = router;
