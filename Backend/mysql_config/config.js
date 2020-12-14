var moment = require('moment');
var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "ambi1",
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
    database: 'ambi1',
    multipleStatements: true
})

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
      }
    })
  })
  app.post("/addLog",(req,res)=>{
    role = req.body.userRole;
    reqId = req.body.req_id;
    action_by=req.body.action_taken_by;
    sql = `insert into request_actionnnn (req_id,acc_id,areq_action,aaction_taken_by,acomment) values(${reqId},${role},"Approved",'${action_by}',"Approved")`
    con.query(sql,function(err,result){
      if(err){
        console.log(err);
      }else{
        console.log(result);
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
      }
    })
  })
  app.post("/addLogNewReq",(req,res)=>{
    role = req.body.userRole;
    reqId = req.body.req_id;
    //aprocessingTime=moment(Date.now()).format('HH:mm:ss');;
    sql = `insert into request_actionnnn (req_id,acc_id,areq_action,aaction_taken_by,acomment) values(${reqId},${role},"Request Initiate","Initiator","Request Initiated")`
    con.query(sql,function(err,result){
      if(err){
        console.log(err);
      }else{
          
        console.log(result);
      }
    })
  })
  // app.get("/selectNewReqId",(req,res)=>{
  //   sql = `SELECT req_id FROM requests ORDER BY req_id DESC LIMIT 1`;
  //   con.query(sql,function(err,result){
  //     if(err){
  //       console.log(err);
  //     }else{
  //       console.log(result,"req_id in Select");
  //        return result;
  //     }
  //   })
  // })
app.get('/api/users/:id', (req, res) => {
    let req_id = req.params.id;
    console.log(req_id);
    mysqlConnection2.query(`select distinct aaction_taken_by from request_actionnnn where req_id=${req_id} ;`, (err, rows, fields) => {
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

app.listen(port, () => {
    console.log(`Server Started at Port number ${port}`);
});