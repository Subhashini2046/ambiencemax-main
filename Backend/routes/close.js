let express = require("express"),
  async = require("async"),
  router = express.Router(),
  con = require("../mysql_config/config");

  router.post("/closedReq",(req,res) =>{
    data = req.body;
    user_id = data.user_id;
    console.log(data);
          var sql2 = `select role_id from access where user_id = '${user_id}';`
          con.query(sql2, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              role_id = result[0].role_id;
              console.log(result);
              
                sql3 = `Select h_id from access where user_id = '${user_id}' and role_id = '${role_id}';`
                con.query(sql3,function(err , result){
                  if(err){
                    console.log(err);
                  }else{
                    h_id = result[0].h_id;
                    len = h_id.length;
                    console.log('length of h_id is ' + len);
                    console.log(result);
                    // h_id is substr of b_id ---> w_id (Link table)
                    sql4 = `Select * from link inner join access on link.b_id = access.h_id where '${h_id}' = substr(b_id,1,'${len}');`
                    con.query(sql4,function(err,result){
                      if(err){
                        console.log(err);
                      }else{
                        if(result.length > 0){
                          let w_id;
                          reqData = [];
                          req_stats = {
                            
                            Pending: 0,
                          }
                          const loop = new Promise((resolve,reject) =>{  result.forEach((element,index) => {
                                w_id = element.work_id;
                                console.log(w_id);
                                sql5 = `Select * from requests where req_status = 'closed' and w_id = '${w_id}' order by req_id desc;select count(*) as "closed" from requests where w_id = '${w_id}' and req_status = 'closed'`;
                                let fetch = new Promise((resolve,reject)=>{
                                con.query(sql5,function(err,result){
                                  if(err){
                                    console.log(err);
                                  }else{
                                    reqData.push(...result[0]);
                                    // console.log('From DB :-' + reqData);
                                    // req_stats = {
                                    //   Pending: req_stats.Pending + result[1][0].pending,
                                    //     }
                                    // if (result.length === 10){
                                    //   console.log(req_stats);
                                    //   resolve();
                                    // }
                                    resolve();
                                  }
  
                                })
                              })
                              fetch.then(()=>{
                                // console.log(reqData);
                                if(index === result.length -1){
                                  resolve();
                                }
                              })
  
                          })
  
                        })
                        loop.then(()=>{
                          // console.log(reqData);
                          res.send(
                            JSON.stringify({
                              result: "passed",
                             // user_id: user_id,
                              //req_data: reqData.slice(0,10),
                              req_data: reqData,
                              role_id : role_id,
                              //req_stats: req_stats,
                              h_id: h_id
                            })
                          );
                        })
                        }
                      }
                    })
                  }
                })
              //}
            }
          })
      
    });
    // console.log(req.body);
    // role_id = req.body.userRole;
    // req_offset = req.body.reqOffset;
    // req_start = req.body.reqStart;
    // user_id = req.body.user_id;
    // console.log(user_id);
    // if(role_id === 1){
    //   var sql1 = `select * from requests where req_initiator_id = '${user_id}' and req_status = 'Pending' order by req_id desc ;`
    //   con.query(sql1,(err,result)=>{
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
    // }else{
    //   h_id = req.body.hId;
    //   len = h_id.length;
    //   console.log('length of h_id is ' + len);
    // // console.log(result);
    // // h_id is substr of b_id ---> w_id (Link table)
    // sql4 = `Select * from requests inner join (Select work_id from link inner join access on link.b_id = access.h_id where '${h_id}' = substr(b_id,1,'${len}')) as ids on requests.w_id = ids.work_id where req_id < '${req_offset}' order by req_id desc`
    // con.query(sql4,function(err,result){
    //   if(err){
    //     console.log(err);
    //   }else{
    //     console.log(result);
    //     res.send(
    //       JSON.stringify({
    //         result: "passed",
    //         user_id: user_id,
    //         req_data: result,
    //         role_id : role_id
    //       })
    //     );
    //   }
    // })
    // }

  
  

  module.exports = router;