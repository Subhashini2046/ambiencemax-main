let express = require("express"),
  async = require("async"),
  router = express.Router(),
  con = require("../mysql_config/config");

// router.get("/getWorkFlow",(req,res)=>{
//   sql='Select * from workflow inner join (select w_id from requests where request.w_id=workflow.w_id);'
// con.query(sql,(err,result)=> {
// if(err)
// {
//   console.log(err)
// }
// else{
//   res.send(JSON.stringify({data,result}));}
// })})
router.post("/getFlowDetails", (req, res) => {
  let w_id = req.body.Workflow.data;
  sql = `select w_flow from linkrumprequestflow where linkrumprequestflowpk=?;`
  con.query(sql, w_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      let w_flow = [];
      let wflowdata = [];
      w_flow = result[0].w_flow.split(',');
      for (let i = 0; i < w_flow.length; i++) {
        if (typeof w_flow[i] === 'string' && (w_flow[i].includes('or') == false && w_flow[i].includes('i') == false)) {
          wflowdata.push(w_flow[i]);
        }

        else if (w_flow[i].includes('or')) {
          if (w_flow[i].includes('c')) {
            nextValue = w_flow.filter(data => data.includes('c')).map(data => {
              return data.split('or').filter(data => data.includes('c')).map(data => data.replace('c', ''))[0]
            })
            wflowdata.push(nextValue);
          }
          if (w_flow[i].includes('c')) {
            nextValue = w_flow.filter(data => data.includes('e')).map(data => {
              return data.split('or').filter(data => data.includes('e')).map(data => data.replace('e', ''))[0]
            })
            wflowdata.push(nextValue);
          }
        }
        else if (w_flow[i].includes('i')) {
          w_flow[i] = w_flow[i].replace('i', '');

        }
      }
      sql = `select dataadmin.admName as adminName,linkrumpadminaccess.linkRUMPAdminAccessPK as id, linkrumpadminaccess.linkrumprolefk as role,
      COALESCE(locname,buiname,cluname,citname) as name,pickRUMPRoleDescription as role from linkrumpadminaccess 
      left join datalocation on(datalocation.locLocationPK=linkRUMPAdminAccess.linkRUMPspace)
      left join databuilding on(databuilding.buiBuildingPK=linkRUMPAdminAccess.linkRUMPspace)
      left join dataclub on(dataclub.cluclubpk=linkRUMPAdminAccess.linkRUMPspace)
      left join datacity on(datacity.citCityPK=linkRUMPAdminAccess.linkRUMPspace)
      inner join pickrumprole on(pickrumprole.pickrumprolepk=linkrumpadminaccess.linkRUMPRoleFK)
      inner join dataadmin on(dataadmin.admAdminPK=linkrumpadminaccess.linkRUMPAdminFK)
      where linkRUMPAdminAccessPK in (?) order by linkrumprolefk;`
      con.query(sql, [wflowdata], (err, result) => {
        if (err) {
          console.log(err);
        } else {

          res.send(result);
        }
      })
    }
  })
})

router.get("/getFlow", (req, res) => {
  sql = `select COALESCE(locname,buiname,cluname,citname) as name,
  COALESCE( replace(locLocationPK,locLocationPK,'Location'),replace(buiBuildingPK,buiBuildingPK,'Building'),
  replace(cluClubPK,cluClubPK,'Cluster'),replace(citCityPK,citCityPK,'City') )
  as hierarchy,linkrumprequestflow.linkrumprequestflowpk as w_id,
      linkrumprequestflow.w_flow as w_flow from linkrumprequestinitiators 
      left join datalocation on(datalocation.locLocationPK=linkrumprequestinitiators.b_id)
      left join databuilding on(databuilding.buiBuildingPK=linkrumprequestinitiators.b_id)
      left join dataclub on(dataclub.cluclubpk=linkrumprequestinitiators.b_id)
      left join datacity on(datacity.citCityPK=linkrumprequestinitiators.b_id)
      left join linkrumprequestflow on(linkrumprequestflow.linkrumprequestflowpk=linkrumprequestinitiators.work_id);`
  con.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

router.post("/getHierarchy", (req, res) => {
  let name = req.body.name;
  if (name.includes('Location')) {
    sql = `select locLocationPK as id,locName as name from datalocation;`
  }
  else if (name.includes('Building')) {
    sql = `select buiBuildingPK as id,buiName as name from databuilding;`
  }
  else if (name.includes('Cluster')) {
    sql = `select cluClubPK as id,cluName as name from dataclub;`
  }
  else if (name.includes('City')) {
    sql = `select citCityPK as id,citName as name from datacity;`
  }
  else if (name.includes('State')) {
    sql = `select staStatePK as id,staName as name from datastate;`
  }
  else if (name.includes('Country')) {
    sql = `select couCountryPK as id,couName as name from datacountry;`
  }
  else if (name.includes('Geography')) {
    sql = `select geoGeographyPK as id,geoName as name from datageography;`
  }
  con.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  })
})


router.post("/getUsersWorkflow", (req, res) => {
  let role = req.body.role;
sql='select distinct dataadmin.admName as name,linkrumpadminaccess.linkRUMPAdminFK as userId from linkrumpadminaccess inner join dataadmin on(dataadmin.admAdminPK=linkrumpadminaccess.linkRUMPAdminFK) where linkRUMPRoleFK=?;'
  con.query(sql,role, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  })
})

router.post("/getUserLocation", (req, res) => {
  let roleId = req.body.roleId;
  let userId=req.body.userId;
  if (roleId==1) {
    sql = `select linkrumpadminaccess.linkRUMPAdminAccessPK as accessId,linkrumpadminaccess.linkRUMPSpace,datalocation.locName as locName from linkrumpadminaccess inner join datalocation on(datalocation.locLocationPK=linkrumpadminaccess.linkRUMPSpace)
    where linkRUMPAdminFK=? and linkRUMPRoleFK=?;`
  }
  else if (roleId==2 || roleId==3 || roleId==4 || roleId==5) {
    sql = `select linkrumpadminaccess.linkRUMPAdminAccessPK as accessId,linkrumpadminaccess.linkRUMPSpace,dataclub.cluName as locName from linkrumpadminaccess inner join dataclub on(dataclub.cluClubPK=linkrumpadminaccess.linkRUMPSpace)
    where linkRUMPAdminFK=? and linkRUMPRoleFK=?;`
  }
  else if (roleId==6 || roleId==7 || roleId==9) {
    sql = `select linkrumpadminaccess.linkRUMPAdminAccessPK as accessId,linkrumpadminaccess.linkRUMPSpace,datacity.citName as locName from linkrumpadminaccess inner join datacity on(datacity.citCityPK=linkrumpadminaccess.linkRUMPSpace)
    where linkRUMPAdminFK=? and linkRUMPRoleFK=?;`
  }
  con.query(sql,[userId,roleId], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  })
});



router.get("/getUserRole",(req,res)=> {
  sql = `select * from pickrumprole;`
  con.query(sql,(err,result)=>{
    if(err){
      console.log(err);
    }else{
      res.send(result);
    }
  });
});


router.post("/addWorkflow",(req,res)=> {
  let w_flow=req.body.w_flow;
  let w_flowStr='';
w_flowStr=w_flow.toString();
  sql = `insert into linkrumprequestflow (w_flow) values(?);`
  con.query(sql,w_flowStr,(err,result)=>{
    if(err){
      console.log(err);
    }else{
      res.send(JSON.stringify({result:'Inserted'}));
    }
  });
});

router.post("/addLink", (req, res) => {
  work_id = req.body.work_id;
  b_id = req.body.b_id;

  sql = `select * from linkrumprequestinitiators where (b_id='${b_id}' and work_id=${work_id})`;
  con.query(sql,(err, result) => {
    if (err) {
      console.log(err);
    } else {
      if(result.length>0){
        res.end(JSON.stringify({result:1}));
      }
      else{
      sql = `insert into linkrumprequestinitiators (work_id,b_id) values (${work_id},'${b_id}')`;
      con.query(sql, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      })}
    }
  })
})

//get admin id and name for assiging the access priviledge
router.get("/adminIdAndName",(req,res)=> {
  con.query(`select admAdminPK as adminPK,concat(admAdminPK,' (',admName,')')
   as adminIdName from dataadmin;`,(err,result)=>{
    if (err) throw err;
    res.end(JSON.stringify(result))
  });
});

// check if admin has already access or not
router.post("/adminCheck",(req,res)=> {
  adminPK = req.body.id;
  con.query(`select admAccess from dataadmin where admAdminPK=?;`,
  adminPK,(err,result)=>{
    if (err) throw err;
    res.end(JSON.stringify(result))
  });
});

router.post("/addAdminId", (req, res) => {
  adminPK = req.body.id;
  con.query(`update dataadmin set admAccess=1 where admAdminPK=?;`,
  adminPK,(err, result) => {
    if (err) throw err;
    res.end(JSON.stringify({result:1})); 
  })
})
module.exports = router;
