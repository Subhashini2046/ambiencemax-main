var multer = require('multer');
const date = require('date-and-time');
const { end } = require('../mysql_config/config');

let express = require("express"),
  router = express.Router(),
  con = require("../mysql_config/config");

// var store = multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null, './uploads');
//     },
//     filename:function(req,file,cb){
//         cb(null, Date.now()+'.'+file.originalname);
//     }
// });


// var upload = multer({storage:store}).single('file');

// router.post('/upload', function(req,res,next){
//     upload(req,res,function(err){
//         if(err){
//             return res.status(501).json({error:err});
//         }
//         //do all database record saving activity
//         return res.json({originalname:req.file.originalname, uploadname:req.file.filename});
//     });
// });


router.post("/fileUpload", (req, res) => {
  reqId = req.body.req_id;
  filepath = req.body.filepath;
  console.log("\\\\\\\\\\/////", reqId, filepath);
  sql1 = `insert into datarumprequestfiles (RUMPRequestFilesPath,RUMPRequestFK,RUMPRequestFilesStage) values ('${filepath}','${reqId}',0)`
  con.query(sql1, (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(result);
      res.send(
        JSON.stringify({
          result: "passed",
          id: res.insertId
        })
      );
    }
  })
})
router.post("/ViewRequestDetail", (req, res) => {
  reqId = req.body.req_id;
  filepath = req.body.filepath;
  sql1 = `select * from datarumprequest where RUMPRequestPK=${req.body.reqId};`
  con.query(sql1, (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(result);
      res.send(JSON.stringify(result));
    }
  })
})

router.post("/newReq", (req, response) => {
  space = req.body.space;
  let spaceCollection = splitHierarchy(space);

  function splitHierarchy(space) {
    let spaceCollection = [];
    let a = space;
    while (a.length != 0) {
      spaceCollection.push(a);
      if (a.length == 13) {
        a = space.substr(0, 11);
      } else if (a.length == 11) {
        a = space.substr(0, 8)
      } else if (a.length == 8) {
        a = space.substr(0, 6)
      } else if (a.length == 6) {
        a = space.substr(0, 4)
      } else if (a.length == 4) {
        a = space.substr(0, 2)
      } else {
        a = '';
      }
    }
    return spaceCollection;
  }
  //console.log("+++",spaceCollection.join("','"));
  sql = `select work_id,b_id from linkrumprequestinitiators where b_id in('" + ${spaceCollection.join("','")} + "') order by b_id desc limit 1;`;
  con.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log(res);
      w_id = res[0].work_id;
      b_id = res[0].b_id;
      console.log('w_id.......', w_id);
      w_flow = [];
      w_flow1 = 0;
      sql = `Select w_flow from linkrumprequestflow where w_id=${w_id};`
      con.query(sql, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          w_flow = result[0].w_flow.split(',');
          w_flow1 = w_flow[0];
          req_level = w_flow1;
          //req_date = new Date().toJSON().slice(0,10).replace(/-/g,'/');
          req_date = new Date();
          console.log(req_date);
          sql = `select locShortName from datalocation where locLocationPK=${req.body.space.substr(0, 11)};`
          con.query(sql, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              locShortName = result[0].locShortName;
              const today = new Date()
              if ((today.getMonth() + 1) <= 3) {
                startYear = (today.getFullYear() - 1);
                endYear = today.getFullYear()
              } else {
                startYear = today.getFullYear();
                endYear = (today.getFullYear() + 1);
              }
              startDate = startYear;
              endDate = endYear.toString().substr(2, 4);
              startEndDate = startDate + "-" + endDate;
              space = req.body.space.substr(0, 11);

              let requestNumber = "";
              if (req.body.request.req_type == "Repair") {
                requestNumber = locShortName + "/" + startEndDate + "/" + "Form1" + "/";
              }else if (req.body.request.req_type == "Upgrade") {
                requestNumber = locShortName + "/" + startEndDate + "/" + "Form2" + "/";
              }else if (req.body.request.req_type == "Maintenance") {
                requestNumber = locShortName + "/" + startEndDate + "/" + "Form3" + "/";
              }

              sql = `select max(cast(REPLACE(rumprequestnumber, '${requestNumber}', '')+1 as decimal(10,0))) as nextval
              from datarumprequest 
              where RUMPRequestNumber like '${requestNumber}%';`
              con.query(sql, function (err, result) {
                if (err) {
                  console.log(err);
                } else {
                  nextValue = result[0].nextval;
                  if(nextValue==null){
                    nextValue=1;
                  }
                  requestNumber=requestNumber+nextValue
                  console.log("nextValue---",requestNumber)
                  let me_type=0
                  if(req.body.request.me_type=="Civil"){
                      me_type=0;
                  }else if(req.body.request.me_type=="Electrical"){
                      me_type=1;
                  }

                  let budget_type=0
                  if(req.body.request.budget_type=="Capex"){
                       budget_type=0;
                  }else if(req.body.request.budget_type=="Opex"){
                       budget_type=1;
                  }
                  const now = new Date();
                  let req_date=date.format(now, 'YYYY-MM-DD HH:mm:ss')
                  console.log('nn', req_date);
      
                  sql_nested = `insert into datarumprequest (RUMPRequestType,RUMPRequestNumber,RUMPRequestUnreadStatus,RUMPRequestCancelStatus,RUMPRequestMEType,RUMPRequestSWON,
                            RUMPRequestSWONType,RUMPRequestBudgetType,RUMPRequestAvailableBudget,RUMPRequestConsumedBudget,
                            RUMPRequestBalanceBudget,RUMPRequestSubject,RUMPRequestDescription,RUMPRequestDate,RUMPRequestFlowFK,RUMPRequestStatus,RUMPRequestStage,RUMPInitiatorId,RumprequestLevel,ispnc) 
                            values ('${req.body.request.req_type}','${requestNumber}',0,0,'${me_type}','${req.body.request.req_swon}',
                            'NA',${budget_type},
                            ${req.body.request.available_budget},${req.body.request.consumed_budget},
                            ${req.body.request.balance_budget},'${req.body.request.req_subject}',
                            '${req.body.request.req_description}','${req_date}',${w_id},'${req.body.request.req_status}',0,${req.body.request.req_initiator_id},${req_level},0)`

                  con.query(sql_nested, (err, res) => {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log(res);
                      console.log(res.insertId, "req_id");
                      response.send(JSON.stringify({
                         id: res.insertId,
                       }))
                    }
                  })
                }
              })
            }
          })
        }
      })
    }

  })
})

// Add BOQ Details //
router.post("/BOQRequests", (req, res) => {
  let myrole = req.body.role;
  var sql = `select w_id as wid,w_flow as wflow from linkrumprequestflow inner join datarumprequest 
  on datarumprequest.RUMPRequestFlowFK=linkrumprequestflow.w_id where RUMPRequestPK=${req.body.reqId};`
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.send(JSON.stringify({ result: "failed1" }));
    } else {
      let wflowdata = result[0].wflow.split(',');
      let nextValue=0;
          if (myrole == 3) {
            console.log("bbb",wflowdata)
            wflowdata = wflowdata.filter(data => data.includes('c')).map(data => {
             // console.log("index",wflowdata.indexOf(data))
              let index=wflowdata.indexOf(data);
              index=index+1;
              nextValue=wflowdata[index];
            })
          }
          else if (myrole == 4) {
            wflowdata = wflowdata.filter(data => data.includes('e')).map(data => {
              let index=wflowdata.indexOf(data);
              index=index+1;
              nextValue=wflowdata[index];
            })
          }
          //console.log("workFlow data--",nextValue);
  sql1 = `update datarumprequest set RUMPRequestBOQDescription='${req.body.boqDescription}',
          RUMPRequestBOQEstimatedCost='${req.body.boqEstimatedCost}',RUMPRequestBOQEstimatedTime='${req.body.boqEstimatedTime}',
          RumprequestLevel=${nextValue} where RUMPRequestPK=${req.body.reqId};`
  con.query(sql1, (err, result) => {
    if (err) {
      console.log(err);
    }else {
      console.log(result);
      res.send(JSON.stringify({result: "passed" }));
    }
  });
}
});
});

router.post("/requestDetail", (req, res) => {
  sql = `select RUMPRequestPNCUrl as PNCUrl, RUMPRequestAllocatedVendor as RequestAllocatedVendor,RUMPInitiatorId as initiatorId,RumprequestLevel as requestLevel,ispnc,RUMPRequestBOQDescription as BOQDescription,RUMPRequestBOQEstimatedCost as BOQEstimatedCost,
  RUMPRequestBOQEstimatedTime as BOQEstimatedTime,RUMPRequestVendorAllocatedDays as AllocatedDays,
  RUMPRequestVendorAllocationStartDate as AllocationStartDate,RUMPRequestActualCost as ActualCost,RUMPRequestStatus as RequestStatus,RUMPRequestNumber as RequestNumber, RUMPRequestPK,if(RUMPRequestMEType=0,"Civil","Electrical") as METype,RUMPRequestSWON as RequestSWON,RUMPRequestAvailableBudget as RequestAvailableBudget,
  RUMPRequestConsumedBudget as RequestConsumedBudget,RUMPRequestBalanceBudget as RequestBalanceBudget,
  RUMPRequestType as RequestType,RUMPRequestSubject as RequestSubject, RUMPRequestDescription as RequestDescription,
  if(RUMPRequestBudgetType=0,"Capex","Opex") as BudgetType from datarumprequest where RUMPRequestPK=${req.body.req_id};`
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  })
});



router.post("/resendRequest", (req, res) => {
  var sql = `select pickrumprole.pickRUMPRoleDescription as role from pickrumprole inner join linkrumpadminaccess 
  on pickRUMPRolePK=linkRUMPRoleFK where linkRUMPAdminAccessPK=${req.body.resendToId};`
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.send(JSON.stringify({ result: "failed1" }));
    } else {
  let role = result[0].role;
  let request_action = "Resend to"+role;
  sql = `update datarumprequest set ispnc=0,RumprequestLevel=${req.body.resendToId} 
  where rumprequestpk=${req.body.req_id};`
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
      const now = new Date();
      let actionTime=date.format(now, 'YYYY-MM-DD HH:mm:ss')
      sql = `insert into datarumprequestaction (RUMPRequestFK,RUMPRequestRole,RUMPRequestAction,RUMPRequestActionTiming,RUMPRequestComments,RUMPRequestRoleName,RUMPRequestStage) values(${req.body.req_id},${req.body.accessID},'${request_action}','${actionTime}','${req.body.reqComment}','${req.body.role_name}',1);`
      con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  })
    }
  })
}
  });
});
router.post("/addPnc", (req, res) => {
  var sql = `select w_id as wid,w_flow as wflow from linkrumprequestflow inner join datarumprequest 
  on datarumprequest.RUMPRequestFlowFK=linkrumprequestflow.w_id where RUMPRequestPK=${req.body.req_id};`
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.send(JSON.stringify({ result: "failed1" }));
    } else {
  let wflowdata = result[0].wflow.split(',');
  let nextValue=0;
  let VendorPk =req.body.VendorPk;
  let allocatedDays=req.body.allocatedDays;
  let allocationStartDate=req.body.allocationStartDate;
  
  if(VendorPk==null){
    VendorPk=null;
  }
            console.log("bbb",wflowdata)
            wflowdata = wflowdata.filter(data => data.includes('i')).map(data => {
              let index=wflowdata.indexOf(data);
              index=index+1;
              nextValue=wflowdata[index];
              console.log("next----",nextValue);
            })
    if(allocationStartDate==null){
      sql = `update datarumprequest set RUMPRequestAllocatedVendor=${VendorPk},
  RUMPRequestVendorAllocatedDays=${allocatedDays},
  RUMPRequestVendorAllocationStartDate=null,RumprequestLevel=${nextValue},
  RUMPRequestActualCost=${req.body.actualCost} where rumprequestpk=${req.body.req_id};`
    }
  else{  
    allocationStartDate=req.body.allocationStartDate.toString().substr(0, 10);
  sql = `update datarumprequest set RUMPRequestAllocatedVendor=${VendorPk},
  RUMPRequestVendorAllocatedDays=${allocatedDays},
  RUMPRequestVendorAllocationStartDate='${allocationStartDate}',RumprequestLevel=${nextValue},
  RUMPRequestActualCost=${req.body.actualCost} where rumprequestpk=${req.body.req_id};`
  }
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  })
}
  });
});
router.post("/pncfileUpload", (req, res) => {
  console.log("filepath-----",req.body.filepath);
  sql = `update datarumprequest set RUMPRequestPNCUrl ='${req.body.filepath}' where rumprequestpk=${req.body.req_id};`
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  })
});

module.exports = router;
