var multer = require('multer');
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
      callBack(null, `${file.originalname}`)
    }
  })
  
  const upload = multer({ storage: storage })
  router.post('/multipleFiles', upload.array('files'), (req, res, next) => {
    const files = req.files;
    console.log(files);
    if (!files) {
      const error = new Error('No File')
      error.httpStatusCode = 400
      return next(error)
    }
    res.send({
      sttus: 'ok',
      files: files
    });
  })
  
  const storagepnc = multer.diskStorage({
    destination: (req, file, callBack) => {
      console.log(req.body.id + "///")
      callBack(null, 'C:\\CommonFolderMirror\\RUMP_Req_PNC_Docs\\')
    },
    filename: (req, file, callBack) => {
  
      callBack(null, `${req.body.id}-${file.originalname}`)
    }
  })
  const uploadpnc = multer({ storage: storagepnc })
  router.post('/pncFiles', uploadpnc.array('files'), (req, res, next) => {
    const files = req.files;
    if (!files) {
      const error = new Error('No File')
      error.httpStatusCode = 400
      return next(error)
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
    filename: (req, file, callBack) => {
  
      callBack(null, `${req.body.id}-${file.originalname}`)
    }
  })
  const uploadboq = multer({ storage: storageboq })
  router.post('/BoqFiles', uploadboq.array('files'), (req, res, next) => {
    const files = req.files;
    if (!files) {
      const error = new Error('No File')
      error.httpStatusCode = 400
      return next(error)
    }
    res.send({
      sttus: 'ok',
      files: files
    });
  })
  
  
  
  router.post("/resendReq", (req, res) => {
    role = req.body.userRole;
    reqId = req.body.req_id;
    sql = `update requests set req_level = '${role}' where req_id = '${reqId}';`
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
    role = req.body.userRole;
    reqId = req.body.req_id;
    action_by = req.body.action_taken_by;
    console.log("........role", role, reqId, action_by);
    sql = `insert into request_actionnnn (req_id,acc_id,areq_action,aaction_taken_by,acomment) values(${reqId},${role},"routerroved",'${action_by}',"routerroved")`
    con.query(sql, function (err, result) {
      if (err) {
        console.log(err);
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
    role = req.body.userRole;
    reqId = req.body.req_id;
    action_by = req.body.action_taken_by;
    sql = `insert into request_actionnnn (req_id,acc_id,areq_action,aaction_taken_by,acomment) values(${reqId},${role},"Resent",'${action_by}',"Resent")`
    con.query(sql, function (err, result) {
      if (err) {
        console.log(err);
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
    let accessId = req.body.accessId;
    const now = new Date();
    let req_date = date.format(now, 'YYYY-MM-DD HH:mm:ss')
    sql = `insert into datarumprequestaction (RUMPRequestFK,RUMPRequestRole,RUMPRequestAction,RUMPRequestActionTiming,RUMPRequestRoleName,RUMPRequestStage) values(${req.body.req_id},(SELECT  RUMPInitiatorId FROM datarumprequest WHERE RUMPRequestPK = ${req.body.req_id}),'Initiated Phase 1','${req_date}','${req.body.user_name}',1);`
    con.query(sql, function (err, result) {
      if (err) {
        console.log(err);
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
    console.log(req.query.filename, file);
    res.download(file);
  });
  
  router.get('/RequestFle', (req, res) => {
    const file = 'C:/CommonFolderMirror/RUMP_Req_RUMP_Supporting_Docs/' + req.query.filename;
    console.log(req.query.filename, file);
    res.download(file);
  });
  
  router.post("/users1", (req, res) => {
    let req_id = req.body.req_id;
    let w_flow = [];
    let wflowdata = [];
    let wflowdata1 = []
    let intiator_id = '';
    let accessId = req.body.accessId;
    let routerrovalLevel = 0;
    let role_id = req.body.role_id;
    let space = req.body.space;
    sql = `Select w_flow,RUMPRequestMEType,RUMPRequestrouterrovalLevel,RUMPInitiatorId from datarumprequest inner join linkrumprequestflow on datarumprequest.RUMPRequestFlowFK = linkrumprequestflow.linkrumprequestflowpk where RUMPRequestPK =?;`
    con.query(sql, req_id, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        routerrovalLevel = result[0].RUMPRequestrouterrovalLevel;
        intiator_id = result[0].RUMPInitiatorId;
        let me_type = result[0].RUMPRequestMEType;
        w_flow = result[0].w_flow.split(',');
        for (let i = 0; i < w_flow.length; i++) {
  
          if (typeof w_flow[i] === 'string' && (w_flow[i].includes('or') == false && w_flow[i].includes('i') == false)) {
            wflowdata.push(w_flow[i]);
          }
  
          else if (me_type == 0 && w_flow[i].includes('or')) {
  
            w_flow[i] = w_flow[i].replace("c", "");
            w_flow[i] = w_flow[i].replace('e', '');
            w_flow[i] = w_flow[i].substring(0, w_flow[i].indexOf('or') + 'or'.length);
            w_flow[i] = w_flow[i].replace('or', '');
            console.log(w_flow[i]);
            wflowdata.push(w_flow[i]);
  
          }
          else if (me_type == 1 && w_flow[i].includes('or')) {
  
            w_flow[i] = w_flow[i].replace("c", "");
            w_flow[i] = w_flow[i].replace('e', '');
            w_flow[i] = w_flow[i].substring(w_flow[i].indexOf('r') + 1);
            w_flow[i] = w_flow[i].replace('or', '');
            console.log(w_flow[i]);
            wflowdata.push(w_flow[i]);
  
          }
          else if (w_flow[i].includes('i')) {
            wflowdata.push(intiator_id);
          }
  
        }
        let routerrovalLevelIndex = wflowdata.indexOf(routerrovalLevel.toString())
        for (let i = 0; i <= routerrovalLevelIndex; i++) {
          wflowdata1.push(wflowdata[i]);
        }
        if (!wflowdata1.includes(intiator_id.toString())) {
          wflowdata1.push(intiator_id.toString())
        }
        console.log(wflowdata1, 'w');
        sql = `select RUMPRequestActionTiming from datarumprequestaction inner join linkrumpadminaccess 
        on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole)
        where rumprequestfk=${req_id} and linkRUMProleFK=${role_id} and linkRUMPSpace=${space} limit 1;`
        con.query(sql, function (err, result) {
          if (err) {
            console.log(err);
          } else {
            if (result.length > 0) {
              sql = `select distinct linkRUMPAdminAccessPK as accessId,linkRUMPRoleFK as roleId,pickRUMPRoleDescription 
              from datarumprequestaction datarumprequestaction inner join linkrumpadminaccess 
              on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole)
              inner join pickrumprole on(pickrumprole.pickRUMPRolePK=linkrumpadminaccess.linkrumprolefk)
              where RUMPRequestFK=? and RUMPRequestRole in(?) and RUMPRequestRole!=(select RUMPRequestRole from datarumprequestaction inner join linkrumpadminaccess 
              on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole)
              where rumprequestfk=? and linkRUMProleFK=? and linkRUMPSpace=? limit 1);`
              con.query(sql, [req_id, wflowdata1, req_id, role_id, space], function (err, result) {
                if (err) {
                  console.log(err);
                } else {
  
                  console.log(result);
                  res.send(result);
                }
              })
            }
            else {
              sql = `select distinct linkRUMPAdminAccessPK as accessId,linkRUMPRoleFK as roleId,pickRUMPRoleDescription 
              from datarumprequestaction datarumprequestaction inner join linkrumpadminaccess 
              on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole)
              inner join pickrumprole on(pickrumprole.pickRUMPRolePK=linkrumpadminaccess.linkrumprolefk)
              where RUMPRequestFK=? and RUMPRequestRole in(?);`
              con.query(sql, [req_id, wflowdata1, req_id, role_id, space], function (err, result) {
                if (err) {
                  console.log(err);
                } else {
  
                  console.log(result);
                  res.send(result);
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
    sql = `select RUMPRequestActionTiming from datarumprequestaction inner join linkrumpadminaccess 
      on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole)
      where rumprequestfk=${req_id} and linkRUMProleFK=${role_id} and linkRUMPSpace=${space} limit 1;`
    con.query(sql, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        if (result.length > 0) {
          sql1 = `select linkRUMPAdminAccessPK as accessId,
              linkRUMPRoleFK as roleId,pickRUMPRoleDescription from datarumprequestaction 
              inner join linkrumpadminaccess 
              on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole)
              inner join pickrumprole on(pickrumprole.pickRUMPRolePK=linkrumpadminaccess.linkrumprolefk)
              where rumprequestfk=${req_id} and (RUMPRequestActionTiming <(select RUMPRequestActionTiming from datarumprequestaction inner join linkrumpadminaccess 
              on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole)
              where rumprequestfk=${req_id} and linkRUMProleFK=${role_id} and linkRUMPSpace=${space} limit 1) or (RUMPRequestAction like 'Resent%' and RUMPRequestRole!=${accessId})) 
              group by linkRUMPRoleFK,linkRUMPSpace;`
          con.query(sql1, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log(result);
              res.send(result);
            }
          })
        }
        else {
          sql2 = `select linkRUMPAdminAccessPK as accessId,
              linkRUMPRoleFK as roleId,pickRUMPRoleDescription from datarumprequestaction 
              inner join linkrumpadminaccess 
              on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole)
              inner join pickrumprole on(pickrumprole.pickRUMPRolePK=linkrumpadminaccess.linkrumprolefk)
              where rumprequestfk=${req_id} and RUMPRequestActionTiming group by linkRUMPRoleFK,linkRUMPSpace;`
          con.query(sql2, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log(result);
              res.send(result);
            }
          })
        }
      }
    })
  
  });
  
  router.get("/addLink", (req, res) => {
  
  
  });

  module.exports = router;