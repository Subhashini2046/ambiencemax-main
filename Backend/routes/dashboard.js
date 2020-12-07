let express = require("express"),
  async = require("async"),
  router = express.Router(),
  con = require("../mysql_config/config");

  router.post("/dashboard", (req, res) => {
    console.log("Dashboard Route");
    data = req.body;
    user_id=data.user_id;
    console.log(data);
    var sql1 = `select role_id from access where user_id = '${user_id}';`
        con.query(sql1, function (err, result) {
          if (err) {
            console.log(err);
          } else {
            role_id = result[0].role_id;
            console.log(result);
          }
        });
        sql2 = `Select h_id from access where user_id = '${user_id}' and role_id = '${role_id}';`
              con.query(sql2,function(err , result){
                if(err){
                  console.log(err);
                }else{
                  h_id = result[0].h_id;
                  len = h_id.length;
                  console.log('length of h_id is ' + len);
                  console.log(result);
                  // h_id is substr of b_id ---> w_id (Link table)
                  sql3 = `Select * from link inner join access on link.b_id = access.h_id where '${h_id}' = substr(b_id,1,'${len}');`
                  con.query(sql3,function(err,result){
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
                              sql5 = `Select * from requests where w_id = '${w_id}' order by req_id desc ; select count(*) as "all" from requests where w_id = '${w_id}';select count(*) as "pending" from requests where w_id = '${w_id}' and req_status = 'Pending';select count(*) as "closed" from requests where w_id = '${w_id}' and req_status = 'Closed';select count(*) as "open" from requests where w_id = '${w_id}' and req_level = '${role_id - 1 }'`;
                              let fetch = new Promise((resolve,reject)=>{
                              con.query(sql5,function(err,result){
                                if(err){
                                  console.log(err);
                                }else{
                                  req_stats = {
                                    All: req_stats.All + result[1][0].all,
                                    Pending: req_stats.Pending + result[2][0].pending,
                                    Closed: req_stats.Closed + result[3][0].closed,
                                    Open: req_stats.Open + result[4][0].open
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
                            role_id : role_id,
                            req_stats: req_stats,
                            h_id: h_id
                          })
                        );
                      })
                      }
                    }
                  })
                }
              })
         
  });
  module.exports = router;