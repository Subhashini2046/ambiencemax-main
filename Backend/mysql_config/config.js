var moment = require('moment');
var multer=require('multer');
var mysql = require('mysql');
const date = require('date-and-time');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "ambience_max",
    insecureAuth : true,
    multipleStatements: true
});
module.exports = con;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 5600;
const app = express();
app.use(cors());
app.use(bodyParser.json());

let mysqlConnection2 = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'ambience_max',
    multipleStatements: true
})

//var DIR = './uploads/';
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
      callBack(null, 'C:\\CommonFolderMirror\\RUMP_Req_RUMP_Supporting_Docs\\')
  },
  filename: (req, file, callBack) => {
      callBack(null, `${file.originalname}`)
  }
})

const upload = multer({ storage: storage })
app.post('/multipleFiles', upload.array('files'), (req, res, next) => {
  const files = req.files;
  console.log(files);
  if (!files) {
    const error = new Error('No File')
    error.httpStatusCode = 400
    return next(error)
  }
    res.send({sttus:  'ok',
    files:files
  });
})

const storagepnc = multer.diskStorage({
  destination: (req, file, callBack) => {
    console.log(req.body.id+"///")
      callBack(null, 'C:\\CommonFolderMirror\\RUMP_Req_PNC_Docs\\')
  },
  filename: (req, file, callBack) => {

      callBack(null, `${req.body.id}-${file.originalname}`)
  }
})
const uploadpnc = multer({ storage: storagepnc })
app.post('/pncFiles', uploadpnc.array('files'), (req, res, next) => {
  const files = req.files;
  if (!files) {
    const error = new Error('No File')
    error.httpStatusCode = 400
    return next(error)
  }
    res.send({sttus:  'ok',
    files:files
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
app.post('/BoqFiles', uploadboq.array('files'), (req, res, next) => {
  const files = req.files;
  if (!files) {
    const error = new Error('No File')
    error.httpStatusCode = 400
    return next(error)
  }
    res.send({sttus:  'ok',
    files:files
  });
})

//app.use(cors({credentials: true, origin: 'http://localhost:5600/api'}));
mysqlConnection2.connect((err) => {
    if (!err) {
        console.log('DB connection successful!');
    }
    else {
        console.log('Db Connection Failed : ' + JSON.stringify(err, undefined, 2));
    }
})

 
app.post("/resendReq",(req,res)=>{
    role = req.body.userRole;
    reqId = req.body.req_id;
    sql = `update requests set req_level = '${role}' where req_id = '${reqId}';`
    con.query(sql,function(err,result){
      if(err){
        console.log(err);
      }else{
        console.log(result);
        res.send(JSON.stringify({
          result:"passed"
        }));
      }
    })
  })
  app.post("/addLog",(req,res)=>{
    role = req.body.userRole;
    reqId = req.body.req_id;
    action_by=req.body.action_taken_by;
    console.log("........role",role,reqId,action_by);
    sql = `insert into request_actionnnn (req_id,acc_id,areq_action,aaction_taken_by,acomment) values(${reqId},${role},"Approved",'${action_by}',"Approved")`
    con.query(sql,function(err,result){
      if(err){
        console.log(err);
      }else{
        console.log(result);
        res.send(JSON.stringify({
          result:"passed",
          id:res.insertId
        }));
      }
    })
  })
  app.post("/addResendReqLog",(req,res)=>{
    role = req.body.userRole;
    reqId = req.body.req_id;
    action_by=req.body.action_taken_by;
    sql = `insert into request_actionnnn (req_id,acc_id,areq_action,aaction_taken_by,acomment) values(${reqId},${role},"Resent",'${action_by}',"Resent")`
    con.query(sql,function(err,result){
      if(err){
        console.log(err);
      }else{
        console.log(result);
        res.send(JSON.stringify({
          result:"passed",
          id:res.insertId
        }));
      }
    })
  })
  app.post("/addLogNewReq",(req,res)=>{
    const now = new Date();
    let req_date=date.format(now, 'YYYY-MM-DD HH:mm:ss')
    sql = `insert into datarumprequestaction (RUMPRequestFK,RUMPRequestRole,RUMPRequestAction,RUMPRequestActionTiming,RUMPRequestRoleName,RUMPRequestStage) values(${req.body.req_id},(SELECT  RUMPInitiatorId FROM datarumprequest WHERE RUMPRequestPK = ${req.body.req_id}),'Initiated Phase 1','${req_date}','${req.body.user_name}',1);`
    con.query(sql,function(err,result){
      if(err){
        console.log(err);
      }else{
          
        console.log(result);
        res.send(JSON.stringify({
          result:"passed",
          id:res.insertId,
        }));
      }
    })
  })
  app.get('/download', (req, res) => {
    const file='C:/CommonFolderMirrorRUMP_Req_PNC_Docs/'+req.query.filename;
    console.log(req.query.filename,file);
    res.download(file);
});
app.post("/users", (req, res) => {
    let req_id = req.body.req_id;
    let accessId=req.body.accessId;
    console.log(req_id);
    mysqlConnection2.query(`select distinct linkRUMPAdminAccessPK as accessId,
    pickRUMPRoleDescription as role from linkrumpadminaccess inner join datarumprequestaction 
    on(datarumprequestaction.RUMPRequestRole=linkrumpadminaccess.linkRUMPAdminAccessPK) 
    inner join pickrumprole on(linkrumpadminaccess.linkRUMPRoleFK = pickrumprole.pickRUMPRolePK) 
    where RUMPRequestFK = ${req_id} and RUMPRequestRole!=${accessId};`, (err, rows, fields) => {
      if (!err) {
          console.log("..........//");
            console.log(rows);
            res.send(rows);

        }
        else {
            console.log(err);
        }
    })
});

app.get("/addLink",(req,res)=>{

  
});

app.listen(port, () => {
    console.log(`Server Started at Port number ${port}`);
});