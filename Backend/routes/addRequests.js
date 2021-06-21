var multer = require('multer');
const date = require('date-and-time');
const { end } = require('../mysql_config/config');

let express = require("express"),
  router = express.Router(),
  con = require("../mysql_config/config");


router.post("/fileUpload", (req, res) => {
  reqId = req.body.req_id;
  filepath = req.body.filepath;
  const fileAddress = 'C:\\CommonFolderMirror\\RUMP_Req_RUMP_Supporting_Docs\\' + filepath;

  sql1 = `insert into datarumprequestfiles (RUMPRequestFilesPath,RUMPRequestFK,RUMPRequestFilesStage) 
  values (?,'${reqId}',1)`
  con.query(sql1, fileAddress, (err, result) => {
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

router.post("/fileBoqUpload", (req, res) => {
  reqId = req.body.req_id;
  filepath = req.body.filepath;
  const fileAddress = 'C:\\CommonFolderMirror\\RUMP_Req_RUMP_Supporting_Docs\\' + filepath;

  sql1 = `insert into datarumprequestfiles (RUMPRequestFilesPath,RUMPRequestFK,RUMPRequestFilesStage) 
  values (?,'${reqId}',2)`
  con.query(sql1, fileAddress, (err, result) => {
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

router.post("/pncSupportingDoc", (req, res) => {
  reqId = req.body.req_id;
  filepath = req.body.filepath;
  const fileAddress = 'C:\\CommonFolderMirror\\RUMP_Req_RUMP_Supporting_Docs\\' + filepath;

  sql1 = `insert into datarumprequestfiles (RUMPRequestFilesPath,RUMPRequestFK,RUMPRequestFilesStage) 
  values (?,'${reqId}',3)`
  con.query(sql1, fileAddress, (err, result) => {
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
  console.log(req.body);
  let space = req.body.space;
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
  console.log("spaceCollection:",spaceCollection);
  sql = `select work_id,b_id from linkrumprequestinitiators where b_id in(?) order by b_id desc limit 1;`;
  con.query(sql, [spaceCollection], (err, res) => {
    if (err) {
      console.log(err);
      response.send(JSON.stringify({ result: "failed" }));
    } else {
      console.log(res);
      w_id = res[0].work_id;
      b_id = res[0].b_id;
      w_flow = [];
      w_flow1 = 0;
      sql = `Select w_flow from linkrumprequestflow where linkrumprequestflowpk=${w_id};`
      con.query(sql, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          w_flow = result[0].w_flow.split(',');
          w_flow1 = w_flow[0];
          req_level = w_flow1;
          req_date = new Date();
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
                requestNumber = locShortName + "/" + startEndDate + "/" + "NewForm1" + "/";
              } else if (req.body.request.req_type == "Upgrade") {
                requestNumber = locShortName + "/" + startEndDate + "/" + "NewForm2" + "/";
              } else if (req.body.request.req_type == "Maintenance") {
                requestNumber = locShortName + "/" + startEndDate + "/" + "NewForm3" + "/";
              }

              sql = `select max(cast(REPLACE(rumprequestnumber, '${requestNumber}', '')+1 as decimal(10,0))) as nextval
              from datarumprequest 
              where RUMPRequestNumber like '${requestNumber}%';`
              con.query(sql, function (err, result) {
                if (err) {
                  console.log(err);
                } else {
                  nextValue = result[0].nextval;
                  if (nextValue == null) {
                    nextValue = 1;
                  }
                  requestNumber = requestNumber + nextValue
                  let me_type = 0
                  if (req.body.request.me_type == "Civil") {
                    me_type = 0;
                  } else if (req.body.request.me_type == "Electrical") {
                    me_type = 1;
                  }

                  let budget_type = 0
                  if (req.body.request.budget_type == "Capex") {
                    budget_type = 0;
                  } else if (req.body.request.budget_type == "Opex") {
                    budget_type = 1;
                  }
                  const now = new Date();
                  let req_date = date.format(now, 'YYYY-MM-DD HH:mm:ss')

                  sql_nested = `insert into datarumprequest (RUMPRequestType,RUMPRequestNumber,RUMPRequestUnreadStatus,RUMPRequestCancelStatus,RUMPRequestMEType,RUMPRequestSWON,
                            RUMPRequestSWONType,RUMPRequestBudgetType,RUMPRequestAvailableBudget,RUMPRequestConsumedBudget,
                            RUMPRequestBalanceBudget,RUMPRequestSubject,RUMPRequestDescription,RUMPRequestDate,RUMPRequestFlowFK,RUMPRequestStatus,RUMPRequestStage,RUMPInitiatorId,RumprequestLevel,ispnc,RUMPRequestApprovalLevel) 
                            values ('${req.body.request.req_type}','${requestNumber}',1,0,'${me_type}','${req.body.request.req_swon}',
                            'NA',${budget_type},
                            ${req.body.request.available_budget},${req.body.request.consumed_budget},
                            ${req.body.request.balance_budget},'${req.body.request.req_subject}',
                            '${req.body.request.req_description}','${req_date}',${w_id},'${req.body.request.req_status}',0,${req.body.request.req_initiator_id},${req_level},0,${req.body.accessID})`

                  con.query(sql_nested, (err, res) => {
                    if (err) {
                      console.log(err);
                    } else {
                      sql = `delete from datarumpdraftrequest where RUMPRequestPK=?;`
                      con.query(sql,[req.body.request.draftReqId] ,(err, result) => {
                        if (err) {
                          console.log(err);
                        } else {
                      sql = `select RUMPRequestNumber from datarumprequest where RUMPRequestPK=${res.insertId};`
                      con.query(sql, (err, result) => {
                        if (err) {
                          console.log(err);
                        } else {
                          reqNumber = result[0].RUMPRequestNumber
                          response.send(JSON.stringify({
                            id: res.insertId,
                            reqNumber: reqNumber
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
        }
      })
    }

  })
})


router.post("/updateRequests", (req, res) => {

  let accessID = req.body.accessID;
  pnc = req.body.is_pnc;
  var sql = `select linkrumprequestflowpk as wid,w_flow as wflow from linkrumprequestflow inner join datarumprequest 
  on datarumprequest.RUMPRequestFlowFK=linkrumprequestflow.linkrumprequestflowpk where RUMPRequestPK=${req.body.req_id};`
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      let wflowdata = result[0].wflow.split(',');
      let nextValue = 0;
      if (pnc == 0) {
        nextValue = wflowdata[0];
      }
      if (pnc == 1) {
        wflowdata = wflowdata.filter(data => data.includes('i')).map(data => {
          let index = wflowdata.indexOf(data);
          index = index + 1;
          nextValue = wflowdata[index];
        })
      }
      let me_type = 0
      if (req.body.request.me_type == "Civil") {
        me_type = 0;
      } else if (req.body.request.me_type == "Electrical") {
        me_type = 1;
      }

      let budget_type = 0
      if (req.body.request.budget_type == "Capex") {
        budget_type = 0;
      } else if (req.body.request.budget_type == "Opex") {
        budget_type = 1;
      }
      sql = `update datarumprequest set RUMPRequestUnreadStatus=1,RUMPRequestMEType='${me_type}',RUMPRequestSWON='${req.body.request.req_swon}',
      RUMPRequestBudgetType=${budget_type},RUMPRequestAvailableBudget=${req.body.request.available_budget},
      RUMPRequestConsumedBudget=${req.body.request.consumed_budget},RUMPRequestBalanceBudget=${req.body.request.balance_budget},RUMPRequestSubject='${req.body.request.req_subject}',
      RUMPRequestDescription='${req.body.request.req_description}',RumprequestLevel=${nextValue},RUMPRequestApprovalLevel=${accessID} where rumprequestpk=${req.body.req_id};`

      con.query(sql, (err, ressult) => {
        if (err) {
          console.log(err);
        } else {
          console.log(ressult);
          const now = new Date();
          let actionTime = date.format(now, 'YYYY-MM-DD HH:mm:ss')
          sql = `insert into datarumprequestaction (RUMPRequestFK,RUMPRequestRole,RUMPRequestAction,RUMPRequestActionTiming,RUMPRequestComments,RUMPRequestRoleName,RUMPRequestStage) values(${req.body.req_id},${req.body.accessID},'Submitted','${actionTime}','Submitted','${req.body.role_name}',1);`
          con.query(sql, (err, result) => {
            if (err) {
              console.log(err);
            } else {
              console.log(result);
              res.send(JSON.stringify({ result: "Updated" }));
            }
          });
        }
      });
    }
  });
});

// Add BOQ Details //
router.post("/BOQRequests", (req, res) => {
  let myrole = req.body.role;
  let accessID = req.body.accessID;
  var sql = `select datarumprequest.RUMPRequestApprovalLevel as approvalLevel ,linkrumprequestflowpk as wid,w_flow as wflow from linkrumprequestflow inner join datarumprequest 
  on datarumprequest.RUMPRequestFlowFK=linkrumprequestflow.linkrumprequestflowpk where RUMPRequestPK=${req.body.reqId};`
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.send(JSON.stringify({ result: "failed1" }));
    } else {
      let approvalLevel = result[0].approvalLevel;
      let wflowdata = result[0].wflow.split(',');
      let nextValue = 0;
      if (myrole == 3) {
        wflowdata = wflowdata.filter(data => data.includes('c')).map(data => {
          // console.log("index",wflowdata.indexOf(data))
          let index = wflowdata.indexOf(data);
          index = index + 1;
          nextValue = wflowdata[index];
        })
      }
      else if (myrole == 4) {
        wflowdata = wflowdata.filter(data => data.includes('e')).map(data => {
          let index = wflowdata.indexOf(data);
          index = index + 1;
          nextValue = wflowdata[index];
        })
      }
      sql = `select distinct RUMPRequestRole from datarumprequestaction 
      where RUMPRequestRole=? and RUMPRequestFK=?;`
      con.query(sql, [accessID, req.body.reqId], function (err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result.length > 0) {

            sql1 = `update datarumprequest set RUMPRequestUnreadStatus=1,RUMPRequestBOQDescription='${req.body.boqDescription}',
          RUMPRequestBOQEstimatedCost='${req.body.boqEstimatedCost}',RUMPRequestBOQEstimatedTime='${req.body.boqEstimatedTime}',
          RumprequestLevel=${nextValue},RUMPRequestApprovalLevel=${accessID} where RUMPRequestPK=${req.body.reqId};`
          }
          else {
            sql1 = `update datarumprequest set RUMPRequestUnreadStatus=1,RUMPRequestBOQDescription='${req.body.boqDescription}',
      RUMPRequestBOQEstimatedCost='${req.body.boqEstimatedCost}',RUMPRequestBOQEstimatedTime='${req.body.boqEstimatedTime}',
      RumprequestLevel=${nextValue},RUMPRequestApprovalLevel=${accessID} where RUMPRequestPK=${req.body.reqId};`
          }
          con.query(sql1, (err, result) => {
            if (err) {
              console.log(err);
            } else {
              console.log(result);
              //res.send(JSON.stringify({ result: "passed" }));
              const now = new Date();
              let actionTime = date.format(now, 'YYYY-MM-DD HH:mm:ss')
              sql = `insert into datarumprequestaction (RUMPRequestFK,RUMPRequestRole,RUMPRequestAction,RUMPRequestActionTiming,RUMPRequestComments,RUMPRequestRoleName,RUMPRequestStage) values(${req.body.reqId},${req.body.accessID},'Submitted','${actionTime}','BOQ Submitted','${req.body.role_name}',1);`
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
    }
  });
});

router.post("/requestDetail", (req, res) => {
  sql = `select datarumprequestaction.RUMPRequestComments as requestComments ,RUMPRequestPNCUrl as PNCUrl, RUMPRequestAllocatedVendor as RequestAllocatedVendor,RUMPInitiatorId as initiatorId,RumprequestLevel as requestLevel,ispnc,RUMPRequestBOQDescription as BOQDescription,RUMPRequestBOQEstimatedCost as BOQEstimatedCost,
  RUMPRequestBOQEstimatedTime as BOQEstimatedTime,RUMPRequestVendorAllocatedDays as AllocatedDays,
  RUMPRequestVendorAllocationStartDate as AllocationStartDate,RUMPRequestActualCost as ActualCost,RUMPRequestStatus as RequestStatus,RUMPRequestNumber as RequestNumber, RUMPRequestPK,if(RUMPRequestMEType=0,"Civil","Electrical") as METype,RUMPRequestSWON as RequestSWON,RUMPRequestAvailableBudget as RequestAvailableBudget,
  RUMPRequestConsumedBudget as RequestConsumedBudget,RUMPRequestBalanceBudget as RequestBalanceBudget,
  RUMPRequestType as RequestType,RUMPRequestSubject as RequestSubject, RUMPRequestDescription as RequestDescription,
  if(RUMPRequestBudgetType=0,"Capex","Opex") as BudgetType from datarumprequest left join datarumprequestaction
  on (datarumprequestaction.RUMPRequestFK=datarumprequest.RUMPRequestPK ) where RUMPRequestPK=${req.body.req_id} 
  order by datarumprequestaction.RUMPRequestActionTiming desc limit 1;`
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  })
});

router.post("/getfiles", (req, res) => {
  sql = `select RUMPRequestFilesPK,RUMPRequestFilesStage,RUMPRequestFilesPath from datarumprequestfiles where RUMPRequestFK=${req.body.req_id};`
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
  let resendToId = req.body.resendToId;
  let accessID = req.body.accessID;
  let w_flow = [];
  let wflowdata = [];
  let wflowdata1 = [];
  let addIntoApprovalLevel = 0;
  sql = `Select w_flow,RUMPRequestMEType,RUMPInitiatorId,RUMPRequestApprovalLevel from datarumprequest inner join linkrumprequestflow on (datarumprequest.RUMPRequestFlowFK = linkrumprequestflow.linkrumprequestflowpk) where RUMPRequestPK =${req.body.req_id};`
  con.query(sql, function (err, result) {
    if (err) { console.log(err); }
    else {
      w_flow = result[0].w_flow.split(',');
      let intiator_id = result[0].RUMPInitiatorId;
      let me_type = result[0].RUMPRequestMEType;
      let ApprovalLevel = result[0].RUMPRequestApprovalLevel;
      for (let i = 0; i < w_flow.length; i++) {

        if (typeof w_flow[i] === 'string' && (w_flow[i].includes('or') == false && w_flow[i].includes('i') == false)) {
          wflowdata.push(w_flow[i]);
        }

        else if (me_type == 0 && w_flow[i].includes('or')) {

          w_flow[i] = w_flow[i].replace("c", "");
          w_flow[i] = w_flow[i].replace('e', '');
          w_flow[i] = w_flow[i].substring(0, w_flow[i].indexOf('or') + 'or'.length);
          w_flow[i] = w_flow[i].replace('or', '');
          wflowdata.push(w_flow[i]);

        }
        else if (me_type == 1 && w_flow[i].includes('or')) {

          w_flow[i] = w_flow[i].replace("c", "");
          w_flow[i] = w_flow[i].replace('e', '');
          w_flow[i] = w_flow[i].substring(w_flow[i].indexOf('r') + 1);
          w_flow[i] = w_flow[i].replace('or', '');
          wflowdata.push(w_flow[i]);

        }
        else if (w_flow[i].includes('i')) {
          wflowdata.push(intiator_id);
        }

      }
      let accessIDIndex = wflowdata.indexOf(accessID.toString());
      let ApprovalLevelIndex = wflowdata.indexOf(ApprovalLevel.toString())
      if (accessIDIndex == intiator_id) {
        addIntoApprovalLevel = ApprovalLevel
      } else {
        if (accessIDIndex >= ApprovalLevelIndex) {
          addIntoApprovalLevel = accessID;
        }
        else { addIntoApprovalLevel = ApprovalLevel }
      }
      var sql = `select pickrumprole.pickRUMPRoleDescription as role from pickrumprole inner join linkrumpadminaccess 
  on pickRUMPRolePK=linkRUMPRoleFK where linkRUMPAdminAccessPK=${req.body.resendToId} and linkRUMPActiveFlag=1;`
      con.query(sql, function (err, result) {
        if (err) {
          console.log(err);
          res.send(JSON.stringify({ result: "failed1" }));
        } else {
          let role = result[0].role;
          let request_action = "Resent to " + role;
          sql = `update datarumprequest set RUMPRequestUnreadStatus=1,ispnc=${req.body.pnc},RumprequestLevel=${req.body.resendToId},RUMPRequestApprovalLevel=${addIntoApprovalLevel}
  where rumprequestpk=${req.body.req_id};`
          con.query(sql, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log(result);
              // res.send(result);
              const now = new Date();
              let actionTime = date.format(now, 'YYYY-MM-DD HH:mm:ss')
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
      })
    }
  });
});
router.post("/addPnc", (req, res) => {
  var sql = `select linkrumprequestflowpk as wid,w_flow as wflow from linkrumprequestflow inner join datarumprequest 
  on datarumprequest.RUMPRequestFlowFK=linkrumprequestflow.linkrumprequestflowpk where RUMPRequestPK=${req.body.req_id};`
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.send(JSON.stringify({ result: "failed1" }));
    } else {
      let wflowdata = result[0].wflow.split(',');
      let nextValue = 0;
      let VendorPk = req.body.VendorPk;
      let allocatedDays = req.body.allocatedDays;
      let allocationStartDate = req.body.allocationStartDate;

      if (VendorPk == null) {
        VendorPk = null;
      }
      wflowdata = wflowdata.filter(data => data.includes('i')).map(data => {
        let index = wflowdata.indexOf(data);
        index = index + 1;
        nextValue = wflowdata[index];
      })
      if (allocationStartDate == null) {
        sql = `update datarumprequest set RUMPRequestUnreadStatus=1,RUMPRequestAllocatedVendor=${VendorPk},
  RUMPRequestVendorAllocatedDays=${allocatedDays},
  RUMPRequestVendorAllocationStartDate=null,RumprequestLevel=${nextValue},
  RUMPRequestActualCost=${req.body.actualCost} where rumprequestpk=${req.body.req_id};`
      }
      else {
        allocationStartDate = req.body.allocationStartDate.toString().substr(0, 10);
        sql = `update datarumprequest set RUMPRequestUnreadStatus=1,RUMPRequestAllocatedVendor=${VendorPk},
  RUMPRequestVendorAllocatedDays=${allocatedDays},
  RUMPRequestVendorAllocationStartDate='${allocationStartDate}',RumprequestLevel=${nextValue},
  RUMPRequestActualCost=${req.body.actualCost} where rumprequestpk=${req.body.req_id};`
      }
      con.query(sql, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          // res.send(result);
          const now = new Date();
          let actionTime = date.format(now, 'YYYY-MM-DD HH:mm:ss')
          sql = `insert into datarumprequestaction (RUMPRequestFK,RUMPRequestRole,RUMPRequestAction,RUMPRequestActionTiming,RUMPRequestComments,RUMPRequestRoleName,RUMPRequestStage) values(${req.body.req_id},${req.body.accessID},'Initiated Phase 2','${actionTime}','','${req.body.role_name}',1);`
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
router.post("/updatePnc", (req, res) => {
  var sql = `select linkrumprequestflowpk as wid,w_flow as wflow from linkrumprequestflow inner join datarumprequest 
  on datarumprequest.RUMPRequestFlowFK=linkrumprequestflow.linkrumprequestflowpk where RUMPRequestPK=${req.body.req_id};`
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.send(JSON.stringify({ result: "failed1" }));
    } else {
      let wflowdata = result[0].wflow.split(',');
      let nextValue = 0;
      let VendorPk = req.body.VendorPk;
      let allocatedDays = req.body.allocatedDays;
      let allocationStartDate = req.body.allocationStartDate;

      if (VendorPk == null) {
        VendorPk = null;
      }
      wflowdata = wflowdata.filter(data => data.includes('i')).map(data => {
        let index = wflowdata.indexOf(data);
        index = index + 1;
        nextValue = wflowdata[index];
      })
      if (allocationStartDate == null) {
        sql = `update datarumprequest set RUMPRequestUnreadStatus=1,RUMPRequestAllocatedVendor=${VendorPk},
  RUMPRequestVendorAllocatedDays=${allocatedDays},
  RUMPRequestVendorAllocationStartDate=null,RumprequestLevel=${nextValue},
  RUMPRequestActualCost=${req.body.actualCost} where rumprequestpk=${req.body.req_id};`
      }
      else {
        allocationStartDate = req.body.allocationStartDate.toString().substr(0, 10);
        sql = `update datarumprequest set RUMPRequestUnreadStatus=1,RUMPRequestAllocatedVendor=${VendorPk},
  RUMPRequestVendorAllocatedDays=${allocatedDays},
  RUMPRequestVendorAllocationStartDate='${allocationStartDate}',RumprequestLevel=${nextValue},
  RUMPRequestActualCost=${req.body.actualCost} where rumprequestpk=${req.body.req_id};`
      }
      con.query(sql, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          // res.send(result);
          const now = new Date();
          let actionTime = date.format(now, 'YYYY-MM-DD HH:mm:ss')
          sql = `insert into datarumprequestaction (RUMPRequestFK,RUMPRequestRole,RUMPRequestAction,RUMPRequestActionTiming,RUMPRequestComments,RUMPRequestRoleName,RUMPRequestStage) values(${req.body.req_id},${req.body.accessID},'Submitted','${actionTime}','','${req.body.role_name}',1);`
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
router.post("/pncfileUpload", (req, res) => {
  filepath = req.body.filepath;
  const fileAddress = 'C:\\CommonFolderMirror\\RUMP_Req_PNC_Docs\\' + filepath;
  sql = `update datarumprequest set RUMPRequestPNCUrl =? where rumprequestpk=${req.body.req_id};`
  con.query(sql, fileAddress, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  })
});
router.post("/check_asRead", (req, res) => {
  accessID = req.body.access_id;
  reqId = req.body.req_id;
  sql = `update datarumprequest set RUMPRequestUnreadStatus = 0 where RUMPRequestPK = ${reqId};`
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
});



router.post("/check_asUnRead", (req, res) => {
  accessID = req.body.access_id;
  reqId = req.body.req_id;
  sql = `update datarumprequest set RUMPRequestUnreadStatus = 1 where RUMPRequestPK = '${reqId}';`
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
});

router.post("/saveDraftRequest", (req, res) => {
  console.log("saveDraftRequest",req.body);
  let me_type = 0
  if(req.body.request.me_type != ''){
  if (req.body.request.me_type == "Civil") {
    me_type = 0;
  } else if (req.body.request.me_type == "Electrical") {
    me_type = 1;
  }}
  else{
    me_type=null;
  }
  let budget_type = 0
  if(req.body.request.budget_type != ''){
    if (req.body.request.budget_type == "Capex") {
      budget_type = 0;
    } else if (req.body.request.budget_type == "Opex") {
      budget_type = 1;
    }}
    else{
      budget_type=null;
    }
  const now = new Date();
  let req_date = date.format(now, 'YYYY-MM-DD HH:mm:ss')
  sql = `insert into datarumpdraftrequest (RUMPRequestType,RUMPRequestMEType,RUMPRequestSWON,RUMPRequestBudgetType,RUMPRequestAvailableBudget,RUMPRequestConsumedBudget,
    RUMPRequestBalanceBudget,RUMPRequestSubject,RUMPRequestDescription,RUMPRequestDate,space,role_id) values(?,?,?,?,?,?,?,?,?,?,?,?)`
  con.query(sql, [req.body.request.req_type, me_type, req.body.request.req_swon, budget_type,
  req.body.request.available_budget, req.body.request.consumed_budget,
  req.body.request.balance_budget, req.body.request.req_subject,
  req.body.request.req_description, req_date,req.body.space,req.body.role_id], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.end(JSON.stringify({
        result: "passed",
        id: result.insertId
      }));
    }
  })
});


router.post("/updateDraftRequest", (req, res) => {
  console.log(req.body);
  let me_type = 0
  if(req.body.request.me_type != ''){
  if (req.body.request.me_type == "Civil") {
    me_type = 0;
  } else if (req.body.request.me_type == "Electrical") {
    me_type = 1;
  }}
  else{
    me_type=null;
  }
  let budget_type = 0
  if(req.body.request.budget_type != ''){
    if (req.body.request.budget_type == "Capex") {
      budget_type = 0;
    } else if (req.body.request.budget_type == "Opex") {
      budget_type = 1;
    }}
    else{
      budget_type=null;
    }
  sql = `update datarumpdraftrequest set RUMPRequestType=?,RUMPRequestMEType=?,RUMPRequestSWON=?,RUMPRequestBudgetType=?,
  RUMPRequestAvailableBudget=?,RUMPRequestConsumedBudget=?,RUMPRequestBalanceBudget=?,
  RUMPRequestSubject=?,RUMPRequestDescription=? where RUMPRequestPK=?`
  con.query(sql, [req.body.request.req_type, me_type, req.body.request.req_swon, budget_type,
  req.body.request.available_budget, req.body.request.consumed_budget,
  req.body.request.balance_budget, req.body.request.req_subject,
  req.body.request.req_description,req.body.raiseRequestId], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.end(JSON.stringify({
        result: "Updated",
      }));
    }
  })
});

router.post("/fetchAllDraftRequest", (req, res) => {
  console.log(req.body.space);
  sql = `select RUMPRequestPK,if(RUMPRequestType="","No Request Type",RUMPRequestType) as RUMPRequestType,RUMPRequestMEType,RUMPRequestSWON,RUMPRequestBudgetType,
  RUMPRequestAvailableBudget,RUMPRequestConsumedBudget,RUMPRequestBalanceBudget,
  if(RUMPRequestSubject="","(No Subject)",RUMPRequestSubject) as RUMPRequestSubject,
  if(RUMPRequestDescription="","No Description Available",RUMPRequestDescription) as RUMPRequestDescription,RUMPRequestDate from datarumpdraftrequest where space='${req.body.space}' and role_id=${req.body.role_id} order by RUMPRequestDate desc;`
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.end(JSON.stringify(result));
    }
  })
});

router.post("/fetchDraftRequest", (req, res) => {
  sql = `select RUMPRequestPK,RUMPRequestType,RUMPRequestMEType,RUMPRequestSWON,RUMPRequestBudgetType,
  RUMPRequestAvailableBudget,RUMPRequestConsumedBudget,RUMPRequestBalanceBudget,RUMPRequestSubject,
  RUMPRequestDescription,RUMPRequestDate from datarumpdraftrequest where RUMPRequestPK=?;`
  con.query(sql,[req.body.draftReqId], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.end(JSON.stringify(result));
    }
  })
});

router.post("/deleteDraftRequest", (req, res) => {
  con.query(`delete from datarumpdraftrequest where RUMPRequestPK=?;`
  ,[req.body.draftReqId], function (err, result) {
    if (err) throw err;
    res.end(JSON.stringify({result:"deleted Successfully"}))
  })
});

module.exports = router;
