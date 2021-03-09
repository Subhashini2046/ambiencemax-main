let express = require("express"),
  async = require("async"),
  router = express.Router(),
  con = require("../mysql_config/config");

router.post("/viewRequestData", (req, res) => {
  data = req.body;
  req_id = data.reqId;
  sql1 = `select * from requests where req_id='${req_id}';`
  con.query(sql1, (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      req_data = result;
      console.log("rrrr", req_id);
      
      sql = `select aaction_taken_by,areq_action as req_action, atime_stamp as req_date,time(atime_stamp) as req_time from request_actionnnn where req_id='${req_id}' order by atime_stamp desc limit 1;`
      con.query(sql, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log("////", result);
          role_name = result[0].aaction_taken_by;
          req_action = result[0].req_action;
          res.send(
            JSON.stringify({
              req_data: req_data,
              role_name: role_name,
              req_action: req_action
            })
          );
        }
      })
    }
  })
})

router.post("/viewStatuss",(req,res)=>{
  reqId = req.body.req_id;
  console.log(reqId);
  let wflowdata=[];
  let me_type = null;
  let intiator_id = '';
  w_flow=[];
  role=[];
  role1=[];
  sql = `select RUMPRequestRoleName as RequestRoleName,RUMPRequestAction as RequestAction,RUMPRequestActionTiming as RequestActionDate,time(RUMPRequestActionTiming) RequestActionTiming from datarumprequestaction where RUMPRequestFK= ${reqId};`
  con.query(sql,function(err,result){
    if(err){
      console.log(err);
    }else{
      reqLog=result;
  sql = `Select ispnc,RUMPRequestStatus,RumprequestLevel,RUMPInitiatorId,w_flow,RUMPRequestMEType from datarumprequest inner join linkrumprequestflow on datarumprequest.RUMPRequestFlowFK = linkrumprequestflow.linkrumprequestflowpk where RUMPRequestPK = ${reqId};`
  con.query(sql,function(err,result){
    if(err){
      console.log(err);
    }else{
      w_flow=result[0].w_flow.split(',');
      me_type = result[0].RUMPRequestMEType;
      requestLevel=result[0].RumprequestLevel;
      reqStatus=result[0].RUMPRequestStatus;
      console.log("dd",requestLevel);
      intiator_id = result[0].RUMPInitiatorId;
      ispnc=result[0].ispnc;
      console.log("............");
      console.log("wflow",w_flow);

      for (let i = 0; i < w_flow.length; i++) {

        if(typeof w_flow[i] === 'string' && (w_flow[i].includes('or') == false && w_flow[i].includes('i') == false)){
          wflowdata.push(w_flow[i]);
        }
       
        else if(me_type == 0 && w_flow[i].includes('or')){

        w_flow[i] = w_flow[i].replace("c","");
        w_flow[i] = w_flow[i].replace('e','');
        w_flow[i] = w_flow[i].substring(0,w_flow[i].indexOf('or')+'or'.length);
        w_flow[i] = w_flow[i].replace('or','');
        console.log(w_flow[i]);
        wflowdata.push(w_flow[i]);

        }
        else if(me_type == 1 && w_flow[i].includes('or')){

          w_flow[i] = w_flow[i].replace("c","");
          w_flow[i] = w_flow[i].replace('e','');
          w_flow[i] = w_flow[i].substring(w_flow[i].indexOf('r')+1);
          w_flow[i] = w_flow[i].replace('or','');
          console.log(w_flow[i]);
          wflowdata.push(w_flow[i]);
      
        }
        else if(w_flow[i].includes('i')){
          wflowdata.push(intiator_id);
        }

      }


      const loop = new Promise((resolve,reject) => {  wflowdata.forEach((element,i) => {

        tval = element;

        sql1= `select pickRUMPRoleDescription from linkrumpadminaccess inner join pickrumprole on linkrumpadminaccess.linkRUMPRoleFK = pickrumprole.pickRUMPRolePK where linkRUMPAdminAccessPK = ${tval};`

        let fetch = new Promise((resolve,reject)=>{

          con.query(sql1,function(err,result){
            if(err){
              console.log(err);         
            }
            else{
    
              role1.push(result);
              resolve();
            }
          })

        })

        fetch.then(()=>{
          if(i === wflowdata.length -1){
            resolve();
          }
        })

        })
      })

      loop.then(()=>{
        res.send(
          JSON.stringify({
              result:"passed",
              w_flow:wflowdata,
              role:role1,
              requestLevel:requestLevel,
              intiator_id:intiator_id,
              reqStatus:reqStatus,
              reqLog:reqLog,
              ispnc:ispnc
          })
         );
      })
    
      
      }
  })
}
});
});
module.exports = router;