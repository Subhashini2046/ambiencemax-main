var multer=require('multer');
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


router.post("/fileUpload",(req,res) =>{
  reqId = req.body.req_id;
  filepath=req.body.filepath;
  console.log("\\\\\\\\\\/////",reqId,filepath);
  sql1 = `insert into uploadfile (files,req_id) values ('${filepath}','${reqId}')`
    con.query(sql1, (err, result) => {
  if (err) {
    console.log(err);
  }
  else {
    console.log(result);
    res.send(
      JSON.stringify({
        result: "passed",
        id:res.insertId
      })
    );
  }
})
})

  router.post("/newReq" , (req,response) =>{
    request = req.body.request;
    req_title = request.req_title;
    req_type = request.req_type;
    req_status = request.req_status;
    //req_level = request.req_level;
    req_description = request.req_description;
    req_initiator_id = request.req_initiator_id;
    req_budget = request.req_budget;
    sql = `select work_id from link inner join access on link.b_id = access.h_id where user_id = '${request.req_initiator_id}';`;
    con.query(sql,(err,res)=>{
      if(err){
        console.log(err);
      }else{
        console.log(res);
        w_id = res[0].work_id;
        console.log('w_id.......',w_id);
        w_flow=[];
        w_flow1=0;
        sql = `Select w_flow from workflow where w_id='${w_id}';`
        con.query(sql,function(err,result){
          if(err){
            console.log(err);
          }else{
            w_flow=result[0].w_flow.split(',');
            w_flow1=w_flow[0];
            console.log('w_flow......1',w_flow);
            console.log('w_flow......1',w_flow1);
            console.log("............");
            console.log(w_flow);
          req_level=w_flow1;
        console.log('w_flow......2',w_flow1);
        req_date = new Date().toJSON().slice(0,10).replace(/-/g,'/');
        console.log(req_date);
        sql_nested = `insert into requests (req_title,req_type,req_status,req_level,req_description,req_date,w_id,req_initiator_id,req_budget) values ('${req_title}','${req_type}','${req_status}','${req_level}','${req_description}','${req_date}',${w_id},'${req_initiator_id}','${req_budget}')`
    
      con.query(sql_nested,(err,res) => {
        if(err){
          console.log(err);
        }else{
          console.log(res);
          console.log(res.insertId,"req_id");
          // userDataService.addReqToLog(res.insertId);
          response.send(JSON.stringify({id:res.insertId}))
        }
      })
    }
  })
    }
      
    })
  })

  module.exports = router;
