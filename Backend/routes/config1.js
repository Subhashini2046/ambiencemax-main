var multer = require('multer');
var fs = require('fs');
const date = require('date-and-time');

let express = require("express"),
  async = require("async"),
  router = express.Router(),
  con = require("../mysql_config/config");

  const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
      callBack(null, 'C:\\CommonFolderMirror\\RUMP_Req_RUMP_Supporting_Docs\\')
    },
    filename: (req, file, callBack) => {
      const now = new Date();
      let timestemp = date.format(now, 'YYYY-MM-DD HH-mm-ss');
      callBack(null, `${timestemp}_${file.originalname}`)
    }
  })
  
  const upload = multer({ storage: storage ,limits: {fileSize: 10000000}})
  router.post('/multipleFiles', upload.array('files'), (req, res, next) => {
    const files = req.files;
    if (!files) {
      const error = new Error('No File')
      error.httpStatusCode = 400
      return next(error)
    }
    res.send({
      status: 'ok',
      files: files
    });
  })
  
  const storagepnc = multer.diskStorage({
    destination: (req, file, callBack) => {
      console.log(req.body.id + "///")
      callBack(null, 'C:\\CommonFolderMirror\\RUMP_Req_PNC_Docs\\')
    },
    filename: (req1, pncFile, callBack) => {
      const now = new Date();
      let timestemp = date.format(now, 'YYYY-MM-DD HH-mm-ss');
      callBack(null, `${timestemp}_${pncFile.originalname}`)
    }
  })
  const uploadpnc = multer({ storage: storagepnc,limits: {fileSize: 10000000} })
  router.post('/pncFiles', uploadpnc.array('files'), (req, res, next1) => {
    const files = req.files;
    if (!files) {
      const error = new Error('No File')
      error.httpStatusCode = 400
      return next1(error)
    }
    res.send({
      sttus: 'ok',
      files: files
    });
  })
  
  const storageboq = multer.diskStorage({
    destination: (req, file, callBack) => {
      callBack(null, 'C:\\CommonFolderMirror\\RUMP_Req_RUMP_Supporting_Docs\\')
    },
    filename: (req, boqFile, callBack) => {
      const now = new Date();
      let timestemp = date.format(now, 'YYYY-MM-DD HH-mm-ss');
      callBack(null, `${timestemp}_${boqFile.originalname}`)
    }
  })
  const uploadboq = multer({ storage: storageboq,limits: {fileSize:10000000}})
  router.post('/BoqFiles', uploadboq.array('files'), (req, res, boqNext) => {
    const files = req.files;
    if (!files) {
      const error = new Error('No File')
      error.httpStatusCode = 400
      return boqNext(error)
    }
    res.send({
      sttus: 'ok',
      files: files
    });
  })
  
  router.post("/resendReq", (req, res) => {
   let role = req.body.userRole;
   let reqId = req.body.req_id;
   let sql = `update requests set req_level = '${role}' where req_id = '${reqId}';`
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
  })

  router.post("/addLog", (req, res) => {
   let role = req.body.userRole;
   let reqId = req.body.req_id;
   let action_by = req.body.action_taken_by;
   let sql = `insert into request_actionnnn (req_id,acc_id,areq_action,aaction_taken_by,acomment) values(${reqId},${role},"routerroved",'${action_by}',"routerroved")`
    con.query(sql, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        console.log(result);
        res.send(JSON.stringify({
          result: "passed",
          id: res.insertId
        }));
      }
    })
  })

  router.post("/addResendReqLog", (req, res) => {
   let role = req.body.userRole;
   let reqId = req.body.req_id;
   let action_by = req.body.action_taken_by;
   let sql = `insert into request_actionnnn (req_id,acc_id,areq_action,aaction_taken_by,acomment) values(${reqId},${role},"Resent",'${action_by}',"Resent")`
    con.query(sql, function (err1, result) {
      if (err1) {
        console.log(err1);
      } else {
        console.log(result);
        res.send(JSON.stringify({
          result: "passed",
          id: res.insertId
        }));
      }
    })
  })

  router.post("/addLogNewReq", (req, res) => {
    const now = new Date();
    let req_date = date.format(now, 'YYYY-MM-DD HH:mm:ss')
    let sql = `insert into datarumprequestaction (RUMPRequestFK,RUMPRequestRole,RUMPRequestAction,RUMPRequestActionTiming,RUMPRequestRoleName,RUMPRequestStage) values(${req.body.req_id},(SELECT  RUMPInitiatorId FROM datarumprequest WHERE RUMPRequestPK = ${req.body.req_id}),'Initiated Phase 1','${req_date}','${req.body.user_name}',1);`
    con.query(sql, function (err2, result) {
      if (err2) {
        console.log(err2);
      } else {
        console.log(result);
        res.send(JSON.stringify({
          result: "passed",
          id: res.insertId,
        }));
      }
    })
  })
  router.get('/download', (req, res) => {
    const file = 'C:/CommonFolderMirror/RUMP_Req_PNC_Docs/' + req.query.filename;
    res.download(file);
  });
  
  router.get('/RequestFle', (req, res) => {
    const file = 'C:/CommonFolderMirror/RUMP_Req_RUMP_Supporting_Docs/' + req.query.filename;
    res.download(file);
  });
  
  router.post("/users1", (req, res) => {
    let req_id = req.body.req_id;
    let w_flow = [];
    let wflowdata = [];
    let wflowdata1 = []
    let intiator_id = '';
    let ApprovalLevel = 0;
    let role_id = req.body.role_id;
    let space = req.body.space;
    let sql = `Select w_flow,RUMPRequestMEType,RUMPRequestApprovalLevel,RUMPInitiatorId from datarumprequest inner join linkrumprequestflow on (datarumprequest.RUMPRequestFlowFK = linkrumprequestflow.linkrumprequestflowpk) where RUMPRequestPK =?;`
    con.query(sql, req_id, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        ApprovalLevel = result[0].RUMPRequestApprovalLevel;
        intiator_id = result[0].RUMPInitiatorId;
        let me_type = result[0].RUMPRequestMEType;
        w_flow = result[0].w_flow.split(',');
        for (let i = 0; i < w_flow.length; i++) {
  
          if (typeof w_flow[i] === 'string' && (!w_flow[i].includes('or') && !w_flow[i].includes('i'))) {
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
        let ApprovalLevelIndex = wflowdata.indexOf(ApprovalLevel.toString())
        for (let i = 0; i <= ApprovalLevelIndex; i++) {
          wflowdata1.push(wflowdata[i]);
        }
        if (!wflowdata1.includes(intiator_id.toString())) {
          wflowdata1.push(intiator_id.toString())
        }
       let sqlQuery = `select RUMPRequestActionTiming from datarumprequestaction inner join linkrumpadminaccess 
        on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole)
        where rumprequestfk=${req_id} and linkRUMProleFK=${role_id} and linkRUMPSpace=${space} limit 1;`
        con.query(sqlQuery, function (error, result1) {
          if (error) {
            console.log(error);
          } else {
            if (result1.length > 0) {
            let  sql1 = `select distinct linkRUMPAdminAccessPK as accessId,linkRUMPRoleFK as roleId,pickRUMPRoleDescription 
              from datarumprequestaction datarumprequestaction inner join linkrumpadminaccess 
              on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole)
              inner join pickrumprole on(pickrumprole.pickRUMPRolePK=linkrumpadminaccess.linkrumprolefk)
              where RUMPRequestFK=? and RUMPRequestRole in(?) and RUMPRequestRole!=(select RUMPRequestRole from datarumprequestaction inner join linkrumpadminaccess 
              on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole)
              where rumprequestfk=? and linkRUMProleFK=? and linkRUMPSpace=? limit 1);`
              con.query(sql1, [req_id, wflowdata1, req_id, role_id, space], function (err1, result2) {
                if (err1) {
                  console.log(err1);
                } else {
                  res.send(result2);
                }
              })
            }
            else {
              sql = `select distinct linkRUMPAdminAccessPK as accessId,linkRUMPRoleFK as roleId,pickRUMPRoleDescription 
              from datarumprequestaction datarumprequestaction inner join linkrumpadminaccess 
              on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole)
              inner join pickrumprole on(pickrumprole.pickRUMPRolePK=linkrumpadminaccess.linkrumprolefk)
              where RUMPRequestFK=? and RUMPRequestRole in(?);`
              con.query(sql, [req_id, wflowdata1, req_id, role_id, space], function (err, result3) {
                if (err) {
                  console.log(err);
                } else {
                  res.send(JSON.stringify(result3));
                }
              })
            }
          }
        })
      }
    })
  })
  router.post("/users", (req, res) => {
    let req_id = req.body.req_id;
    let role_id = req.body.role_id;
    let space = req.body.space;
    let accessId = req.body.accessId;
    let sql = `select RUMPRequestActionTiming from datarumprequestaction inner join linkrumpadminaccess 
      on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole)
      where rumprequestfk=${req_id} and linkRUMProleFK=${role_id} and linkRUMPSpace=${space} limit 1;`
    con.query(sql, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        if (result.length > 0) {
         let sql1 = `select linkRUMPAdminAccessPK as accessId,
              linkRUMPRoleFK as roleId,pickRUMPRoleDescription from datarumprequestaction 
              inner join linkrumpadminaccess 
              on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole)
              inner join pickrumprole on(pickrumprole.pickRUMPRolePK=linkrumpadminaccess.linkrumprolefk)
              where rumprequestfk=${req_id} and (RUMPRequestActionTiming <(select RUMPRequestActionTiming from datarumprequestaction inner join linkrumpadminaccess 
              on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole)
              where rumprequestfk=${req_id} and linkRUMProleFK=${role_id} and linkRUMPSpace=${space} limit 1) or (RUMPRequestAction like 'Resent%' and RUMPRequestRole!=${accessId})) 
              group by linkRUMPRoleFK,linkRUMPSpace;`
          con.query(sql1, function (error, result1) {
            if (error) {
              console.log(error);
            } else {
              console.log(result1);
              res.send(result1);
            }
          })
        }
        else {
         let sql2 = `select linkRUMPAdminAccessPK as accessId,
              linkRUMPRoleFK as roleId,pickRUMPRoleDescription from datarumprequestaction 
              inner join linkrumpadminaccess 
              on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole)
              inner join pickrumprole on(pickrumprole.pickRUMPRolePK=linkrumpadminaccess.linkrumprolefk)
              where rumprequestfk=${req_id} and RUMPRequestActionTiming group by linkRUMPRoleFK,linkRUMPSpace;`
          con.query(sql2, function (err1, result2) {
            if (err1) {
              console.log(err1);
            } else {
              console.log(result2);
              res.send(result2);
            }
          })
        }
      }
    })
  
  });
  
  router.post("/deleteBOQFile", (req, res) => {
    var file_Name=req.body.file_Name;
    console.log(file_Name);
    con.query('delete from datarumprequestfiles where RUMPRequestFilesPK=?',
    [req.body.file_pk],(err,result)=>{
      if (err) throw err;
      var filePath = 'C:\\CommonFolderMirror\\RUMP_Req_RUMP_Supporting_Docs\\'+file_Name; 
      console.log("filePath",filePath);
      fs.unlinkSync(filePath);
      res.end(JSON.stringify({result:"file deleted"}));
    })
  });

  router.post("/deletePncFile", (req, res) => {
    var file_Name=req.body.Pnc_File;
    console.log(req.body);
    let pncUrl=req.body.replacePncfile;
    var filePath = 'C:\\CommonFolderMirror\\RUMP_Req_PNC_Docs\\'+file_Name; 
    con.query('update datarumprequest set RUMPRequestPNCUrl=? where RUMPRequestPK=? ',
    [pncUrl,req.body.req_id],(err,result)=>{
      if (err) throw err;
      console.log("filePath",filePath);
      fs.unlinkSync(filePath);
      res.end(JSON.stringify({result:"file Replaced"}));
    })
  });

  module.exports = router;