const express = require('express');
const bodyParser = require('body-parser');
const loginRoutes = require('./routes/login');
const approveRoutes = require('./routes/approve');
const addRequests = require('./routes/addRequests');
const addWorkFlow = require('./routes/addWorkFlow');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req,res,next)=>{
  console.log('First Middleware');
  next();
});

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*')
  res.setHeader(
  'Access-Control-Allow-Headers',
  'Origin,X-Request-With,Content-Type,Accept'
  )
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET , POST , PATCH , DELETE , PUT , OPTIONS"
  )
  next();
});

app.get("/" , (req,res,next)=>{
  const REQ_DATA= [
    {
      RequestNo: 1,
      Requesttitle: 'Test1',
      RequestType: 'Request for new assets',
      RequestBudget: 1700,
      RequesterId: 'vagrawal645@gmail.com',
      RequestDes: 'This is it!',
      RequestCity: 'ITARSI',
      RequestZip: '461111',
      ReqApprovers: [{status: 'pending', name: 'DCH'}],
      RequestAddress: '9TH LANE',
      status: 'Pending',
      requestinitdate: new Date('2019-01-16'),
      underNegotiation: false,
      comment: []
    },
    {
      RequestNo: 2,
      Requesttitle: 'Test2',
      RequestType: 'Request for new assets',
      RequestBudget: 1700,
      RequesterId: 'vagrawal645@gmail.com',
      RequestDes: 'This is it!',
      RequestCity: 'ITARSI',
      RequestZip: '461111',
      ReqApprovers: [{status: 'pending', name: 'DCH'}],
      RequestAddress: '9TH LANE',
      status: 'Pending',
      requestinitdate: new Date('2019-01-16'),
      underNegotiation: false,
      comment: []
    },
    {
      RequestNo: 3,
      Requesttitle: 'Test3',
      RequestType: 'Request for new assets',
      RequestBudget: 1700,
      RequesterId: 'vagrawal645@gmail.com',
      RequestDes: 'This is it!',
      RequestCity: 'ITARSI',
      RequestZip: '461111',
      ReqApprovers: [{status: 'pending', name: 'Branch Head'} , {status: 'pending', name: 'DCH'}],
      RequestAddress: '9TH LANE',
      status: 'Pending',
      requestinitdate: new Date('2020-01-16'),
      underNegotiation: false,
      comment: []
    },
    {
      RequestNo: 4,
      Requesttitle: 'Test4',
      RequestType: 'Request for new assets',
      RequestBudget: 1000,
      RequesterId: 'vagrawal645@gmail.com',
      RequestDes: 'This is it!',
      RequestCity: 'ITARSI',
      RequestZip: '461111',
      ReqApprovers: [{status: 'pending', name: 'Branch PMO'}],
      RequestAddress: '9TH LANE',
      status: 'Pending',
      requestinitdate: new Date('2020-01-16'),
      underNegotiation: false,
      comment: []
    },
    {
      RequestNo: 5,
      Requesttitle: 'Test5',
      RequestType: 'Request for new assets',
      RequestBudget: 1400,
      RequesterId: 'vagrawal645@gmail.com',
      RequestDes: 'This is it!',
      RequestCity: 'ITARSI',
      RequestZip: '461111',
      ReqApprovers: [{status: 'pending', name: 'Branch PMO'}],
      RequestAddress: '9TH LANE',
      status: 'saved',
      requestinitdate: new Date('2020-01-16'),
      underNegotiation: false,
      comment: []
    },
    {
      RequestNo: 6,
      Requesttitle: 'Test6',
      RequestType: 'Request for new assets',
      RequestBudget: 1000,
      RequesterId: 'vagrawal645@gmail.com',
      RequestDes: 'This is it!',
      RequestCity: 'ITARSI',
      RequestZip: '461111',
      ReqApprovers: [{status: 'pending' , name: 'Head Of Mnt'}],
      RequestAddress: '9TH LANE',
      status: 'saved',
      requestinitdate: new Date('2020-01-16'),
      underNegotiation: false,
      comment: []
    },
    {
      RequestNo: 7,
      Requesttitle: 'Test7',
      RequestType: 'Request for new assets',
      RequestBudget: 39000,
      RequesterId: 'vagrawal645@gmail.com',
      RequestDes: 'This is it!',
      RequestCity: 'ITARSI',
      RequestZip: '461111',
      ReqApprovers: [{status: 'pending' , name: 'Head Of Mnt'}],
      RequestAddress: '9TH LANE',
      status: 'cancelled',
      requestinitdate: new Date('2020-01-16'),
      underNegotiation: false,
      comment: []
    },
    {
      RequestNo: 8,
      Requesttitle: 'Test8',
      RequestType: 'Request for new assets',
      RequestBudget: 79000,
      RequesterId: 'vagrawal645@gmail.com',
      RequestDes: 'This is it!',
      RequestCity: 'ITARSI',
      RequestZip: '461111',
      ReqApprovers: [{status: 'pending' , name: 'Mnt Engg'}],
      RequestAddress: '9TH LANE',
      status: 'cancelled',
      requestinitdate: new Date('2020-01-16'),
      underNegotiation: false,
      comment: []
    },
    {
      RequestNo: 9,
      Requesttitle: 'Test9',
      RequestType: 'Request for new assets',
      RequestBudget: 1000,
      RequesterId: 'vagrawal645@gmail.com',
      RequestDes: 'This is it!',
      RequestCity: 'ITARSI',
      RequestZip: '461111',
      ReqApprovers: [{status: 'pending' , name: 'Mnt Engg'}],
      RequestAddress: '9TH LANE',
      status: 'cancelled',
      requestinitdate: new Date('2020-01-16'),
      underNegotiation: false,
      comment: []
    },
    {
      RequestNo: 10,
      Requesttitle: 'Test10',
      RequestType: 'Request for new assets',
      RequestBudget: 69000,
      RequesterId: 'vagrawal645@gmail.com',
      RequestDes: 'This is it!',
      RequestCity: 'ITARSI',
      RequestZip: '461111',
      ReqApprovers: [{status: 'pending' , name: 'Clstr Head'}],
      RequestAddress: '9TH LANE',
      status: 'cancelled',
      requestinitdate: new Date('2020-01-16'),
      underNegotiation: false,
      comment: []
    },
    {
      RequestNo: 11,
      Requesttitle: 'Test11',
      RequestType: 'Request for new assets',
      RequestBudget: 59000,
      RequesterId: 'vagrawal645@gmail.com',
      RequestDes: 'This is it!',
      RequestCity: 'ITARSI',
      RequestZip: '461111',
      ReqApprovers: [{status: 'closed' , name: 'Clstr Head'}],
      RequestAddress: '9TH LANE',
      status: 'closed',
      requestinitdate: new Date('2020-01-16'),
      underNegotiation: false,
      comment: []
    },
    {
      RequestNo: 12,
      Requesttitle: 'Test12',
      RequestType: 'Request for new assets',
      RequestBudget: 59000,
      RequesterId: 'vagrawal645@gmail.com',
      RequestDes: 'This is it!',
      RequestCity: 'ITARSI',
      RequestZip: '461111',
      ReqApprovers: [{status: 'closed' , name: 'LC Head'}],
      RequestAddress: '9TH LANE',
      status: 'closed',
      requestinitdate: new Date('2020-01-16'),
      underNegotiation: false,
      comment: []
    },
    {
      RequestNo: 13,
      Requesttitle: 'Test13',
      RequestType: 'Request for new assets',
      RequestBudget: 59000,
      RequesterId: 'vagrawal645@gmail.com',
      RequestDes: 'This is it!',
      RequestCity: 'ITARSI',
      RequestZip: '461111',
      ReqApprovers: [{status: 'closed' , name: 'LC Head'}],
      RequestAddress: '9TH LANE',
      status: 'closed',
      requestinitdate: new Date('2020-01-16'),
      underNegotiation: false,
      comment: []
    },
    {
      RequestNo: 14,
      Requesttitle: 'Final Test',
      RequestType: 'Request for new assets',
      RequestBudget: 59000,
      RequesterId: 'vagrawal645@gmail.com',
      RequestDes: 'This is it!',
      RequestCity: 'ITARSI',
      RequestZip: '461111',
      ReqApprovers: [],
      RequestAddress: '9TH LANE',
      status: 'closed',
      requestinitdate: new Date('2020-01-16'),
      underNegotiation: false,
      comment: []
    }
  ]
  console.log('Hiii')
  res.status(200).json({
    message: "Fecthed All Requests Data",
    requests : REQ_DATA
  })
})

// app.use((req,res,next)=>{
//   res.send('Hello from express!')
//   next();
// })

app.use(loginRoutes);
app.use(approveRoutes);
app.use(addRequests);
app.use(addWorkFlow);
module.exports = app;
