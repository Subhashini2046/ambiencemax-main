const { json } = require("body-parser");

let express = require("express"),
  async = require("async"),
  router = express.Router(),
  con = require("../mysql_config/config");

router.post("/login", (req, res) => {
  let sql = `select admAdminPK,admName from dataadmin where admAdminPK = '${req.body.userId}'`;
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.send(JSON.stringify({ result: "failed1" }));
    } else {
      if (result.length == 1) {
        console.log(result);
        let user_id = result[0].admAdminPK;
        let user_name = result[0].admName;
        let sql2 = `select linkRUMPAdminAccessPK,linkRUMPRoleFK,linkRuMPSpace from linkrumpadminaccess where linkRUMPAdminFK=${user_id} and linkRUMPActiveFlag=1 order by linkRUMPRoleFK desc limit 1;`
        con.query(sql2, function (error, result1) {
          if (error) {
            console.log(error);
          } else {
            if (result1.length < 1) {
              return res.status(401).send(
                JSON.stringify({
                  "failed": "Unauthorized Access"
                }));
            }
            let admin_access_id = result1[0].linkRUMPAdminAccessPK
            let role_id = result1[0].linkRUMPRoleFK;
            let space = result1[0].linkRuMPSpace;
            res.send(
              JSON.stringify({
                result: "passed",
                user_id: user_id,
                space: space,
                admin_access_id: admin_access_id,
                role_id: role_id,
                user_name: user_name
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

router.post('/location',(req,res)=>{
  con.query(`select linkRUMPSpace,COALESCE(locname,buiname,cluname,citname) as name from linkrumpadminaccess 
  left join datalocation on(datalocation.locLocationPK=linkRUMPAdminAccess.linkRUMPspace)
  left join databuilding on(databuilding.buiBuildingPK=linkRUMPAdminAccess.linkRUMPspace)
  left join dataclub on(dataclub.cluclubpk=linkRUMPAdminAccess.linkRUMPspace)
  left join datacity on(datacity.citCityPK=linkRUMPAdminAccess.linkRUMPspace)
  where linkRUMPAdminFK=? and linkRUMPRoleFK=0;`,
  [req.body.userId],(err,result)=>{
    if (err) throw err;
    res.send(JSON.stringify(result));
  })
})

router.get('/roles', (req, res) => {
  let result1=[];
  con.query(`select distinct linkrumpadminaccess.linkrumprolefk as role,
  concat("All Request",' | ',pickRUMPRoleDescription)  as roledesc from linkrumpadminaccess 
  inner join pickrumprole on(pickrumprole.pickrumprolepk=linkrumpadminaccess.linkRUMPRoleFK)
  where linkrumpadminfk=? and linkRUMPActiveFlag=1 order by linkrumprolefk;
  select linkrumpadminaccess.linkRUMPAdminAccessPK as sid,linkrumpadminaccess.linkrumprolefk as role,linkrumpspace as space,
    COALESCE(locname,buiname,cluname,citname) as name,pickRUMPRoleDescription as roledesc from linkrumpadminaccess 
    left join datalocation on(datalocation.locLocationPK=linkRUMPAdminAccess.linkRUMPspace)
    left join databuilding on(databuilding.buiBuildingPK=linkRUMPAdminAccess.linkRUMPspace)
    left join dataclub on(dataclub.cluclubpk=linkRUMPAdminAccess.linkRUMPspace)
    left join datacity on(datacity.citCityPK=linkRUMPAdminAccess.linkRUMPspace)
    inner join pickrumprole on(pickrumprole.pickrumprolepk=linkrumpadminaccess.linkRUMPRoleFK)
    where linkrumpadminfk=? and linkRUMPActiveFlag=1 order by linkrumprolefk;
    `, [req.query.userid,req.query.userid], (err, result) => {
    if (err) throw err;
    for(r of result[0]){
      result1.push(r);
    }
    for(r of result[1]){
      result1.push(r);
    }
    res.send(JSON.stringify(result1));
  })
})
module.exports = router;
