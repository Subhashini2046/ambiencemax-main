const date = require('date-and-time');
const { workerData } = require('worker_threads');
let express = require("express"),
  async = require("async"),
  router = express.Router(),
  con = require("../mysql_config/config");


router.post("/getSpocs", (req, res) => {
  reqId = req.body.req_id;
  sql = `select (select rumpspoName from datarumpvendorspoc where rumpspoVendorSpocPK=rumpvenSpoc1FK) as venSpoc1,
  (select rumpspoEmailUK from datarumpvendorspoc where rumpspoVendorSpocPK=rumpvenSpoc1FK) as venSpoc1Email,
(select rumpspoPhone from datarumpvendorspoc where rumpspoVendorSpocPK=rumpvenSpoc1FK) as venSpoc1Phone,
(select rumpspoMobileUK from datarumpvendorspoc where rumpspoVendorSpocPK=rumpvenSpoc1FK) as venSpoc1Mobile,
(select rumpspoAddress from datarumpvendorspoc where rumpspoVendorSpocPK=rumpvenSpoc1FK) as venSpoc1Address,
  (select rumpspoName from datarumpvendorspoc where rumpspoVendorSpocPK=rumpvenSpoc2FK) as venSpoc2,
  (select rumpspoEmailUK from datarumpvendorspoc where rumpspoVendorSpocPK=rumpvenSpoc2FK) as venSpoc2Email,
  (select rumpspoPhone from datarumpvendorspoc where rumpspoVendorSpocPK=rumpvenSpoc2FK) as venSpoc2Phone,
  (select rumpspoMobileUK from datarumpvendorspoc where rumpspoVendorSpocPK=rumpvenSpoc2FK) as venSpoc2Mobile,
  (select rumpspoAddress from datarumpvendorspoc where rumpspoVendorSpocPK=rumpvenSpoc2FK) as venSpoc2Address,
  (select rumpspoName from datarumpvendorspoc where rumpspoVendorSpocPK=rumpvenSpoc3FK) as venSpoc3,
  (select rumpspoEmailUK from datarumpvendorspoc where rumpspoVendorSpocPK=rumpvenSpoc3FK) as venSpoc3Email,
  (select rumpspoPhone from datarumpvendorspoc where rumpspoVendorSpocPK=rumpvenSpoc3FK) as venSpoc3Phone,
  (select rumpspoMobileUK from datarumpvendorspoc where rumpspoVendorSpocPK=rumpvenSpoc3FK) as venSpoc3Mobile,
  (select rumpspoAddress from datarumpvendorspoc where rumpspoVendorSpocPK=rumpvenSpoc3FK) as venSpoc3Address,
  rumpvenVendorPK,rumpvenName as venName from datarumpvendor where rumpvenVendorPK in(
  select  RUMPRequestTaggedVendor1 as v1 from datarumprequest
  where RUMPRequestPK=${reqId} and RUMPRequestTaggedVendor1 is not null
  union 
  select  RUMPRequestTaggedVendor2 as v1 from datarumprequest 
  where RUMPRequestPK=${reqId} and RUMPRequestTaggedVendor2 is not null
  union
  select  RUMPRequestTaggedVendor3 as v1 from datarumprequest 
  where RUMPRequestPK=${reqId} and RUMPRequestTaggedVendor3 is not null
  union
  select  RUMPRequestTaggedVendor4 as v1 from datarumprequest 
  where RUMPRequestPK=${reqId} and RUMPRequestTaggedVendor4 is not null
  union
  select  RUMPRequestTaggedVendor5 as v1 from datarumprequest 
  where RUMPRequestPK=${reqId} and RUMPRequestTaggedVendor5 is not null
  union
  select  RUMPRequestTaggedVendor6 as v1 from datarumprequest 
  where RUMPRequestPK=${reqId} and RUMPRequestTaggedVendor6 is not null
  union
  select  RUMPRequestTaggedVendor7 as v1 from datarumprequest 
  where RUMPRequestPK=${reqId} and RUMPRequestTaggedVendor7 is not null);`
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  })
})

router.post("/getVendor", (req, res) => {
  reqId = req.body.req_id;
  con.query(`select COALESCE(RUMPRequestTaggedVendor1) as vendorId from datarumprequest where RUMPRequestPK=${reqId} and RUMPRequestTaggedVendor1 is not null
  union  
  select COALESCE(RUMPRequestTaggedVendor2) as vendorId from datarumprequest  where RUMPRequestPK=${reqId} and RUMPRequestTaggedVendor2 is not null
  union  
  select COALESCE(RUMPRequestTaggedVendor3) as vendorId from datarumprequest  where RUMPRequestPK=${reqId} and RUMPRequestTaggedVendor3 is not null
  union
  select COALESCE(RUMPRequestTaggedVendor4) as vendorId from datarumprequest  where RUMPRequestPK=${reqId} and RUMPRequestTaggedVendor4 is not null
  union
  select COALESCE(RUMPRequestTaggedVendor5) as vendorId from datarumprequest  where RUMPRequestPK=${reqId} and RUMPRequestTaggedVendor5 is not null
  union
  select COALESCE(RUMPRequestTaggedVendor6) as vendorId from datarumprequest  where RUMPRequestPK=${reqId} and RUMPRequestTaggedVendor6 is not null
  union
  select COALESCE(RUMPRequestTaggedVendor7) as vendorId from datarumprequest  where RUMPRequestPK=${reqId} and RUMPRequestTaggedVendor7 is not null;`,
    (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        let vendorsId = result;
        let vendorId = result[0].vendorId;
        con.query(`select pickrumpvendorcategories.* from 
        linkrumpvendorcategorymap inner join pickrumpvendorcategories 
        on(pickrumpvendorcategories.pickRumpVendorCategoriesPK=linkrumpvendorcategorymap.linkRumpVendorCategoryFK) 
        where linkrumpvendorcategorymap.linkRumpVendorFK=${vendorId};`,
          [vendorId], (err, result) => {
            if (err) throw err;
            res.end(JSON.stringify({
              result: result,
              vendorsId: vendorsId
            }))
          })
      }
      // res.end(JSON.stringify(result))
    });
});
// select list of vendorcategories //
router.get("/vendorcategories", (req, res) => {
  role = req.body.userRole;
  reqId = req.body.req_id;
  sql = `select * from pickrumpvendorcategories;`
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(JSON.stringify(result));
    }
  })
})
// select ventor details //
router.post("/vendorDetail", (req, res) => {
  sql = `select  datarumpvendor.rumpvenVendorPK as vendorId,datarumpvendor.rumpvenName as vendorName, if(count is null,0,count) as taggedCount,if(acount is null,0,acount) as alloccatedCount from datarumpvendor 
  left join (select vendpk,count(*) as count from (select  rumprequestpk,rumprequesttaggedvendor1 as vendpk from datarumprequest 
  where RUMPRequestAllocatedVendor is null
  and RUMPRequesttaggedvendor1 is not null 
  union
  select  rumprequestpk,rumprequesttaggedvendor2 as vendpk from datarumprequest 
  where RUMPRequestAllocatedVendor is null
  and RUMPRequesttaggedvendor2 is not null
  union
  select  rumprequestpk,rumprequesttaggedvendor3 as vendpk from datarumprequest 
  where RUMPRequestAllocatedVendor is null
  and RUMPRequesttaggedvendor3 is not null 
  union
  select  rumprequestpk,rumprequesttaggedvendor4 as vendpk from datarumprequest 
  where RUMPRequestAllocatedVendor is null
  and RUMPRequesttaggedvendor4 is not null
  union
  select  rumprequestpk,rumprequesttaggedvendor5 as vendpk from datarumprequest 
  where RUMPRequestAllocatedVendor is null
  and RUMPRequesttaggedvendor5 is not null
  union
  select  rumprequestpk,rumprequesttaggedvendor6 as vendpk from datarumprequest 
  where RUMPRequestAllocatedVendor is null
  and RUMPRequesttaggedvendor6 is not null
  union
  select  rumprequestpk,rumprequesttaggedvendor7 as vendpk from datarumprequest 
  where RUMPRequestAllocatedVendor is null
  and RUMPRequesttaggedvendor7 is not null)  t1 group by vendpk order by vendpk ) as t2
  on(t2.vendpk=rumpvenvendorpk)
  left join (select rumprequestallocatedvendor as vend,count(*) as acount from datarumprequest where rumprequestallocatedvendor is not null
  and RUMPRequestStatus !='completed'  group by rumprequestallocatedvendor) as t3
  on(t3.vend=rumpvenvendorpk)
  where rumpvenvendorpk in(select linkRumpVendorFK from linkrumpvendorcategorymap 
  where linkRumpVendorCategoryFK=${req.body.vendCategoryId});`
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(JSON.stringify(result));
    }
  })
})

router.post("/addVendors", (req, res) => {
  let vendorList = req.body.vendorList;
  let accessID = req.body.accessID;
  if (vendorList[0] != null) {
    venderTagged_1 = vendorList[0];
  } else
    venderTagged_1 = null;

  if (vendorList[1] != null) {
    venderTagged_2 = vendorList[1];
  } else
    venderTagged_2 = null;

  if (vendorList[2] != null) {
    venderTagged_3 = vendorList[2];
  } else
    venderTagged_3 = null;

  if (vendorList[3] != null) {
    venderTagged_4 = vendorList[3];
  } else
    venderTagged_4 = null;

  if (vendorList[4] != null) {
    venderTagged_5 = vendorList[4];
  } else
    venderTagged_5 = null;

  if (vendorList[5] != null) {
    venderTagged_6 = vendorList[5];
  } else
    venderTagged_6 = null;

  if (vendorList[6] != null) {
    venderTagged_7 = vendorList[6];
  } else
    venderTagged_7 = null;

  sql = `select RUMPInitiatorId as initiatorId,RUMPRequestApprovalLevel from datarumprequest where RUMPRequestPK = ${req.body.req_id};`

  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      let approvalLevel = result[0].RUMPRequestApprovalLevel;
      let initiatorId = result[0].initiatorId;
      console.log(result);
      sql = `select distinct RUMPRequestRole from datarumprequestaction 
      where RUMPRequestRole=? and RUMPRequestFK=?;`
      con.query(sql, [accessID, req.body.req_id], function (err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result.length > 0) {
            sql = `update datarumprequest set RUMPRequestUnreadStatus=1,RUMPRequestTaggedVendor1 = ${venderTagged_1}, 
      RUMPRequestTaggedVendor2 = ${venderTagged_2}, RUMPRequestTaggedVendor3 = ${venderTagged_3}, 
      RUMPRequestTaggedVendor4 = ${venderTagged_4}, RUMPRequestTaggedVendor5 = ${venderTagged_5}, RUMPRequestTaggedVendor6 = ${venderTagged_6}, 
      RUMPRequestTaggedVendor7 = ${venderTagged_7}, RumprequestLevel=${initiatorId},ispnc=1,
      RUMPRequestApprovalLevel=${accessID} where RUMPRequestPK = '${req.body.req_id}';`
          }
          else {
            sql = `update datarumprequest set RUMPRequestUnreadStatus=1,RUMPRequestTaggedVendor1 = ${venderTagged_1}, 
        RUMPRequestTaggedVendor2 = ${venderTagged_2}, RUMPRequestTaggedVendor3 = ${venderTagged_3}, 
        RUMPRequestTaggedVendor4 = ${venderTagged_4}, RUMPRequestTaggedVendor5 = ${venderTagged_5}, RUMPRequestTaggedVendor6 = ${venderTagged_6}, 
        RUMPRequestTaggedVendor7 = ${venderTagged_7}, RumprequestLevel=${initiatorId},ispnc=1,
        RUMPRequestApprovalLevel=${accessID} where RUMPRequestPK = '${req.body.req_id}';`
          }
          con.query(sql, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log(result);
              const now = new Date();
              let actionTime = date.format(now, 'YYYY-MM-DD HH:mm:ss')
              sql = `insert into datarumprequestaction (RUMPRequestFK,RUMPRequestRole,RUMPRequestAction,RUMPRequestActionTiming,RUMPRequestComments,RUMPRequestRoleName,RUMPRequestStage) values(${req.body.req_id},${req.body.accessID},'Approved','${actionTime}','${req.body.reqComment}','${req.body.role_name}',1);`

              con.query(sql, function (err, result) {
                if (err) {
                  console.log(err);
                } else {
                  console.log(result);
                  res.send(JSON.stringify({
                    result: "passed"
                  }));
                }
              })
            }
          })
        }
      })
    }
  })

  // if(vendorList[0]!=null){
  //   console.log("fff");
  //   sql1 = `update datarumprequest set RUMPRequestTaggedVendor1=${vendorList[0]},ispnc=1 where rumprequestpk=${req_id};`
  //    con.query(sql1, (err, result) => {
  //     if (err) throw err;
  //     console.log("fff--");
  //   });
  // }
  // if(vendorList[1]!=null){
  //   console.log("fff");
  //     sql1 = `update datarumprequest set RUMPRequestTaggedVendor2=${vendorList[1]},ispnc=1 where rumprequestpk=${req_id};`
  //      con.query(sql1, (err, result) => {
  //       if (err) throw err;
  //     });}
  // if(vendorList[3]!=null){
  //     sql1 = `update datarumprequest set RUMPRequestTaggedVendor3=${vendorList[2]},ispnc=1 where rumprequestpk=${req_id};`
  //      con.query(sql1, (err, result) => {
  //       if (err) throw err;
  //     });}
  // if(vendorList[4]!=null){
  //    sql1 = `update datarumprequest set RUMPRequestTaggedVendor4=${vendorList[3]},ispnc=1 where rumprequestpk=${req_id};`
  //        con.query(sql1, (err, result) => {
  //         if (err) throw err;
  //       });}
  // if(vendorList[5]!=null){
  //     sql1 = `update datarumprequest set RUMPRequestTaggedVendor5=${vendorList[4]},ispnc=1 where rumprequestpk=${req_id};`
  //     con.query(sql1, (err, result) => {
  //     if (err) throw err;
  //         });}
  //  if(vendorList[6]!=null){
  //     sql1 = `update datarumprequest set RUMPRequestTaggedVendor6=${vendorList[5]},ispnc=1 where rumprequestpk=${req_id};`
  //     con.query(sql1, (err, result) => {
  //     if (err) throw err;
  //         });}
  //  if(vendorList[7]!=null){
  //     sql1 = `update datarumprequest set RUMPRequestTaggedVendor7=${vendorList[6]},ispnc=1 where rumprequestpk=${req_id};`
  //     con.query(sql1, (err, result) => {
  //     if (err) throw err;
  //         });}              


});


router.post("/getComment", (req, res) => {
  reqId = req.body.req_id;
  sql = `select RUMPRequestComments from datarumprequestaction where RUMPRequestFK=${reqId} order by RUMPRequestActionTiming desc limit 1;`
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(JSON.stringify(result));
    }
  })
})
router.post("/approveRequest", (req, res) => {
  let accessID = req.body.accessID;
  var sql = `select linkrumprequestflowpk as wid,w_flow as wflow,datarumprequest.RumprequestLevel as requestLevel,
  datarumprequest.RUMPInitiatorId as initiatorId from linkrumprequestflow inner join datarumprequest 
  on datarumprequest.RUMPRequestFlowFK=linkrumprequestflow.linkrumprequestflowpk where RUMPRequestPK=${req.body.req_id};`
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.send(JSON.stringify({ result: "failed1" }));
    } else {
      let wflowdata = result[0].wflow.split(',');
      let requestLevel = result[0].requestLevel;
      let initiatorId = result[0].initiatorId;
      let nextValue = '';
      let meType = req.body.meType;

      if (requestLevel != 3) {
        for (let i = 0; i < wflowdata.length; i++) {
          if (requestLevel == wflowdata[i]) {
            nextValue = wflowdata[i + 1];
            if (meType.toString().trim() === "Civil") {
              if (nextValue.includes('c')) {
                nextValue = wflowdata.filter(data => data.includes('c')).map(data => {
                  return data.split('or').filter(data => data.includes('c')).map(data => data.replace('c', ''))[0]
                })
              }
              else { nextValue = nextValue; }
            }
            else if (meType.toString().trim() === "Electrical") {
              if (nextValue.includes('e')) {
                nextValue = wflowdata.filter(data => data.includes('e')).map(data => {
                  return data.split('or').filter(data => data.includes('e')).map(data => data.replace('e', ''))
                })
              }
              else { nextValue = nextValue; }
            }
          }
        }
      } else {
        nextValue = initiatorId;
      }
      sql = `update datarumprequest set RUMPRequestStatus=if(RumprequestLevel=3,'Closed','Pending'),RUMPRequestUnreadStatus=1,
             RumprequestLevel=${nextValue},RUMPRequestApprovalLevel=${accessID} where rumprequestpk=${req.body.req_id};`
      con.query(sql, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          //res.send(result);
          const now = new Date();
          let actionTime = date.format(now, 'YYYY-MM-DD HH:mm:ss')
          sql = `insert into datarumprequestaction (RUMPRequestFK,RUMPRequestRole,RUMPRequestAction,RUMPRequestActionTiming,RUMPRequestComments,RUMPRequestRoleName,RUMPRequestStage) values(${req.body.req_id},${req.body.accessID},'Approved','${actionTime}','${req.body.reqComment}','${req.body.role_name}',1);`
          con.query(sql, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log(result);
              res.send(JSON.stringify({
                result: "passed",
              }));
            }
          })
        }
      })
    }
  });
});

router.post("/cancelRequest", (req, res) => {
  sql = `update datarumprequest set RUMPRequestCancelStatus=1 where RUMPRequestPK=?;`
  con.query(sql, [req.body.req_id], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.send(JSON.stringify({ result: "cancelled" }));
    }
  })
})
module.exports = router;
