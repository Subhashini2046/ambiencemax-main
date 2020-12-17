let express = require("express"),
  async = require("async"),
  router = express.Router(),
  con = require("../mysql_config/config");

  router.post("/dashboard", (req, res) => {
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
                          req_stats = {
                                All: 0,
                                Pending: 0,
                                Closed: 0,
                                Open: 0
                                    }
                          const loop = new Promise((resolve,reject) =>{  result.forEach((element,index) => {
                                w_id = element.work_id;
                                console.log(w_id);
                                sql5 = `select count(*) as "all" from requests inner join workflow on(workflow.w_id=requests.w_id);select count(*) as "pending" from requests inner join workflow on(workflow.w_id=requests.w_id) where req_status='Pending' and (w_flow like '%${user_id},%' or req_initiator_id='${user_id}') and '${user_id}'<>req_level;select count(*) as "closed" from requests where w_id = '${w_id}' and req_status = 'Closed';select count(*) as "open" from requests inner join workflow on(workflow.w_id=requests.w_id) where req_status='Pending' and '${user_id}'=req_level;`;
                                let fetch = new Promise((resolve,reject)=>{
                                con.query(sql5,function(err,result){
                                  if(err){
                                    console.log(err);
                                  }else{
                                    req_stats = {
                                        All: req_stats.All + result[0][0].all,
                                        Pending: req_stats.Pending + result[1][0].pending,
                                        Closed: req_stats.Closed + result[2][0].closed,
                                        Open: req_stats.Open + result[3][0].open
                                      }                                  
                                    resolve();
                                  }
  
                                })
                              })
                              fetch.then(()=>{
                                if(index === result.length -1){
                                  resolve();
                                }
                              })
  
                          })
  
                        })
                        loop.then(()=>{
                          res.send(
                            JSON.stringify({
                              result: "passed",
                              req_stats: req_stats
                            })
                          );
                        })
                        }
                      }
                    })
                  }
                })
              
            }
          })
  });

 
  module.exports = router;