let express = require("express"),
  async = require("async"),
  router = express.Router(),
  con = require("../mysql_config/config");

router.post("/login", (req, res) => {
  console.log("Login Route");
  var sql = `select admAdminPK,admName from dataadmin where admAdminPK = '${req.body.userId}' and admpwd = '${req.body.password}';`
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.send(JSON.stringify({ result: "failed1" }));
    } else {
      if (result.length == 1) {
        console.log(result);
        user_id = result[0].admAdminPK;
        console.log("user_id",user_id);
        user_name=result[0].admName;
        var sql2 = `select linkRUMPAdminAccessPK,linkRUMPRoleFK,linkRuMPSpace from linkrumpadminaccess where linkRUMPAdminFK=${user_id} order by linkRUMPRoleFK limit 1;`
        con.query(sql2, function (err, result) {
          if (err) {
            console.log(err);
          } else {
            admin_access_id=result[0].linkRUMPAdminAccessPK
            role_id = result[0].linkRUMPRoleFK;
            space=result[0].linkRuMPSpace;
            console.log(result);
            res.send(
              JSON.stringify({
                result: "passed",
                user_id: user_id,
                space:space,
                admin_access_id:admin_access_id,
                role_id : role_id,
                user_name:user_name
              })
            );
          }
        })
      } else {
        console.log("Fail");
        res.send(JSON.stringify({ result: "failed2" }));
      }
    }
  });
});
router.post("/moreReq",(req,res) =>{
  console.log(req.body);
  role_id = req.body.userRole;
  req_offset = req.body.reqOffset;
  req_start = req.body.reqStart;
  user_id = req.body.user_id;
  if(role_id === 1){
    var sql1 = `select * from requests where req_initiator_id = '${user_id}' and  req_id < '${req_offset}' order by req_id desc ;`
    con.query(sql1,(err,result)=>{
      if(err){
        console.log(err);
      }else{
        console.log(result);
        res.send(
          JSON.stringify({
            result: "passed",
            user_id: user_id,
            req_data: result,
            role_id : role_id
          })
        );
      }
    })
  }else{
    h_id = req.body.hId;
    len = h_id.length;
    console.log('length of h_id is ' + len);
  // console.log(result);
  // h_id is substr of b_id ---> w_id (Link table)
  sql4 = `Select * from requests inner join (Select work_id from link inner join access on link.b_id = access.h_id where '${h_id}' = substr(b_id,1,'${len}')) as ids on requests.w_id = ids.work_id where req_id < '${req_offset}' order by req_id desc`
  con.query(sql4,function(err,result){
    if(err){
      console.log(err);
    }else{
      console.log(result);
      res.send(
        JSON.stringify({
          result: "passed",
          user_id: user_id,
          req_data: result,
          role_id : role_id
        })
      );
    }
  })
  }

});
router.post("/getLatestReqs", (req,res)=>{
  console.log(req.body);
  role_id = req.body.userRole;
//req_offset = req.body.reqOffset;
  req_start = req.body.reqStart;
  user_id = req.body.user_id;
  console.log(req_start);
  if(role_id === 1){
    var sql1 = `select * from requests where req_initiator_id = '${user_id}' and  req_id > '${req_start}' order by req_id desc ;`
    con.query(sql1,(err,result)=>{
      if(err){
        console.log(err);
      }else{
        console.log(result);
        res.send(
          JSON.stringify({
            result: "passed",
            user_id: user_id,
            req_data: result,
            role_id : role_id
          })
        );
      }
    })
  }else{
    h_id = req.body.hId;
    len = h_id.length;
    console.log('length of h_id is ' + len);
  // console.log(result);
  // h_id is substr of b_id ---> w_id (Link table)
  sql4 = `Select * from requests inner join (Select work_id from link inner join access on link.b_id = access.h_id where '${h_id}' = substr(b_id,1,'${len}')) as ids on requests.w_id = ids.work_id where req_id > '${req_start}' order by req_id desc`
  con.query(sql4,function(err,result){
    if(err){
      console.log(err);
    }else{
      console.log(result);
      res.send(
        JSON.stringify({
          result: "passed",
          user_id: user_id,
          req_data: result,
          role_id : role_id
        })
      );
    }
  })
  }
});
module.exports = router;
