const Complaint =
require("../models/Complaint");

const User =
require("../models/User");

exports.getDashboardSummary =
async(req,res)=>{

try{

const total =
await Complaint.countDocuments();

const pending =
await Complaint.countDocuments({
status:"Pending"
});

const assigned =
await Complaint.countDocuments({
status:"Assigned"
});

const inProgress =
await Complaint.countDocuments({
status:"In Progress"
});

const resolved =
await Complaint.countDocuments({
status:"Resolved"
});

const escalated =
await Complaint.countDocuments({
status:"Escalated"
});

const closed =
await Complaint.countDocuments({
status:"Closed"
});

res.status(200).json({
success:true,

summary:{
total,
pending,
assigned,
inProgress,
resolved,
escalated,
closed
}
});

}catch(error){

res.status(500).json({
success:false,
message:error.message
});
}
};

[
 {
   "_id":"Hostel",
   "count":25
 },
 {
   "_id":"Laboratory",
   "count":12
 }
]

exports.categoryAnalytics =
async(req,res)=>{

try{

const data =
await Complaint.aggregate([
{
$group:{
_id:"$category",
count:{
$sum:1
}
}
},
{
$sort:{
count:-1
}
}
]);

res.status(200).json({
success:true,
data
});

}catch(error){

res.status(500).json({
success:false,
message:error.message
});
}
};

exports.priorityAnalytics =
async(req,res)=>{

try{

const data =
await Complaint.aggregate([
{
$group:{
_id:"$priority",
count:{
$sum:1
}
}
}
]);

res.status(200).json({
success:true,
data
});

}catch(error){

res.status(500).json({
success:false,
message:error.message
});
}
};

exports.statusAnalytics =
async(req,res)=>{

try{

const data =
await Complaint.aggregate([
{
$group:{
_id:"$status",
count:{
$sum:1
}
}
}
]);

res.status(200).json({
success:true,
data
});

}catch(error){

res.status(500).json({
success:false,
message:error.message
});
}
};

exports.monthlyTrends =
async(req,res)=>{

try{

const data =
await Complaint.aggregate([

{
$group:{

_id:{
year:{
$year:"$createdAt"
},

month:{
$month:"$createdAt"
}
},

count:{
$sum:1
}
}
},

{
$sort:{
"_id.year":1,
"_id.month":1
}
}
]);

res.status(200).json({
success:true,
data
});

}catch(error){

res.status(500).json({
success:false,
message:error.message
});
}
};

exports.recentComplaints =
async(req,res)=>{

try{

const complaints =
await Complaint.find()

.populate(
"assignedTo",
"name email role"
)

.sort({
createdAt:-1
})

.limit(10);

res.status(200).json({
success:true,
complaints
});

}catch(error){

res.status(500).json({
success:false,
message:error.message
});
}
};

exports.facultyPerformance =
async(req,res)=>{

try{

const faculty =
await User.find({
role:"faculty"
});

const result = [];

for(const user of faculty){

const assigned =
await Complaint.countDocuments({
assignedTo:user._id
});

const resolved =
await Complaint.countDocuments({
assignedTo:user._id,
status:"Resolved"
});

result.push({

facultyId:user._id,

name:user.name,

email:user.email,

assigned,

resolved
});
}

res.status(200).json({
success:true,
result
});

}catch(error){

res.status(500).json({
success:false,
message:error.message
});
}
};

