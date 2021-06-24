let express = require("express"),
  async = require("async"),
  router = express.Router(),
  con = require("../mysql_config/config");

router.post("/login", (req, res) => {
  var sql = `select admAdminPK,admName from dataadmin where admAdminPK = '${req.body.userId}'`;
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.send(JSON.stringify({ result: "failed1" }));
    } else {
      if (result.length == 1) {
        console.log(result);
        user_id = result[0].admAdminPK;
        user_name=result[0].admName;
        var sql2 = `select linkRUMPAdminAccessPK,linkRUMPRoleFK,linkRuMPSpace from linkrumpadminaccess where linkRUMPAdminFK=${user_id} and linkRUMPActiveFlag=1 order by linkRUMPRoleFK desc limit 1;`
        con.query(sql2, function (err, result) {
          if (err) {
            console.log(err);
          } else {
            if(result.length<1){
              res.end(
                JSON.stringify({
                  key: "failed",
                  value: "Unauthorized User",
                  status:401}));
            }
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
        res.send(JSON.stringify({ result: "failed2" }));
      }
    }
  });
});
// router.post("/moreReq",(req,res) =>{
//   console.log(req.body);
//   role_id = req.body.userRole;
//   req_offset = req.body.reqOffset;
//   req_start = req.body.reqStart;
//   user_id = req.body.user_id;
//   if(role_id === 1){
//     var sql1 = `select * from requests where req_initiator_id = '${user_id}' and  req_id < '${req_offset}' order by req_id desc ;`
//     con.query(sql1,(err,result)=>{
//       if(err){
//         console.log(err);
//       }else{
//         console.log(result);
//         res.send(
//           JSON.stringify({
//             result: "passed",
//             user_id: user_id,
//             req_data: result,
//             role_id : role_id
//           })
//         );
//       }
//     })
//   }else{
//     h_id = req.body.hId;
//     len = h_id.length;
//     console.log('length of h_id is ' + len);
//   // console.log(result);
//   // h_id is substr of b_id ---> w_id (Link table)
//   sql4 = `Select * from requests inner join (Select work_id from link inner join access on link.b_id = access.h_id where '${h_id}' = substr(b_id,1,'${len}')) as ids on requests.w_id = ids.work_id where req_id < '${req_offset}' order by req_id desc`
//   con.query(sql4,function(err,result){
//     if(err){
//       console.log(err);
//     }else{
//       console.log(result);
//       res.send(
//         JSON.stringify({
//           result: "passed",
//           user_id: user_id,
//           req_data: result,
//           role_id : role_id
//         })
//       );
//     }
//   })
//   }

// });
// router.post("/getLatestReqs", (req,res)=>{
//   console.log(req.body);
//   role_id = req.body.userRole;
//   req_start = req.body.reqStart;
//   user_id = req.body.user_id;
//   console.log(req_start);
//   if(role_id === 1){
//     var sql1 = `select * from requests where req_initiator_id = '${user_id}' and  req_id > '${req_start}' order by req_id desc ;`
//     con.query(sql1,(err,result)=>{
//       if(err){
//         console.log(err);
//       }else{
//         console.log(result);
//         res.send(
//           JSON.stringify({
//             result: "passed",
//             user_id: user_id,
//             req_data: result,
//             role_id : role_id
//           })
//         );
//       }
//     })
//   }else{
//     h_id = req.body.hId;
//     len = h_id.length;
//     console.log('length of h_id is ' + len);
//   // console.log(result);
//   // h_id is substr of b_id ---> w_id (Link table)
//   sql4 = `Select * from requests inner join (Select work_id from link inner join access on link.b_id = access.h_id where '${h_id}' = substr(b_id,1,'${len}')) as ids on requests.w_id = ids.work_id where req_id > '${req_start}' order by req_id desc`
//   con.query(sql4,function(err,result){
//     if(err){
//       console.log(err);
//     }else{
//       console.log(result);
//       res.send(
//         JSON.stringify({
//           result: "passed",
//           user_id: user_id,
//           req_data: result,
//           role_id : role_id
//         })
//       );
//     }
//   })
//   }
// });

router.get('/roles',(req,res)=>{
let getrolesquery=`select linkrumpadminaccess.linkRUMPAdminAccessPK as sid,linkrumpadminaccess.linkrumprolefk as role,linkrumpspace as space,
COALESCE(locname,buiname,cluname,citname) as name,pickRUMPRoleDescription as roledesc from linkrumpadminaccess 
left join datalocation on(datalocation.locLocationPK=linkRUMPAdminAccess.linkRUMPspace)
left join databuilding on(databuilding.buiBuildingPK=linkRUMPAdminAccess.linkRUMPspace)
left join dataclub on(dataclub.cluclubpk=linkRUMPAdminAccess.linkRUMPspace)
left join datacity on(datacity.citCityPK=linkRUMPAdminAccess.linkRUMPspace)
inner join pickrumprole on(pickrumprole.pickrumprolepk=linkrumpadminaccess.linkRUMPRoleFK)
where linkrumpadminfk=? and linkRUMPActiveFlag=1 order by linkrumprolefk
`;
con.query(getrolesquery,[req.query.userid],(err,result)=>{
  if(err) throw err;
  res.send(JSON.stringify(result));
})  
})
module.exports = router;
