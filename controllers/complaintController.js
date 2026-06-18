const Complaint =
require("../models/Complaint");

const ActivityLog =
require("../models/ActivityLog");

const User =
require("../models/User");

const sendEmail =
require("../utils/sendEmail");

const cloudinary =
require("../config/cloudinary");
const generateComplaintId =
async () => {

  const count =
  await Complaint.countDocuments();

  return `GRV-${
    new Date().getFullYear()
  }-${
    String(count + 1)
      .padStart(4,"0")
  }`;
};
//trackComplient
exports.trackComplaint =
async(req,res)=>{

try{

const complaint =
await Complaint.findOne({

complaintId:req.params.id

});

if(!complaint){

return res.status(404).json({

success:false,

message:"Complaint not found"

});
}

res.status(200).json({

success:true,

complaint

});

}catch(error){

res.status(500).json({

success:false,

message:error.message

});
}
};

//submit complaint
exports.createComplaint =
async (req,res)=>{

try{

const {
  studentName,
  rollNumber,
  email,
  phone,
  isAnonymous,
  category,
  priority,
  description
} = req.body;

const complaintId =
await generateComplaintId();

let attachmentUrl = "";

if (req.file) {

  const base64 =
    `data:${req.file.mimetype};base64,${
      req.file.buffer.toString("base64")
    }`;

  const result =
    await cloudinary.uploader.upload(
      base64,
      {
        folder:
          "grievance-system"
      }
    );

  attachmentUrl =
    result.secure_url;
}

const complaint =
await Complaint.create({

  complaintId,

  studentName:
    isAnonymous
      ? ""
      : studentName,

  rollNumber:
    isAnonymous
      ? ""
      : rollNumber,

  email:
    isAnonymous
      ? ""
      : email,

  phone:
    isAnonymous
      ? ""
      : phone,

  isAnonymous,

  category,

  priority,

  description,

  attachmentUrl

});

if(email){

await sendEmail(

email,

"Complaint Registered",

`Your Complaint ID is: ${complaintId}\nCurrent Status: Pending`

);
}

res.status(201).json({
success:true,
complaint
});

}catch(error){

res.status(500).json({
success:false,
message:error.message
});
}
};
//get all complaints
exports.getAllComplaints =
async(req,res)=>{

try{

const page =
Number(req.query.page) || 1;

const limit =
Number(req.query.limit) || 10;

const skip =
(page-1)*limit;

const search =
req.query.search || "";

const filter = {

$or:[

{
complaintId:{
$regex:search,
$options:"i"
}
},

{
category:{
$regex:search,
$options:"i"
}
},

{
status:{
$regex:search,
$options:"i"
}
}

]
};

const complaints =
await Complaint.find(filter)
.skip(skip)
.limit(limit)
.populate(
"assignedTo",
"name email role"
)
.sort({
createdAt:-1
});

const total =
await Complaint.countDocuments(filter);

res.status(200).json({
success:true,
count:complaints.length,
total,
page,
pages:Math.ceil(total/limit),
complaints
});

}catch(error){

res.status(500).json({
success:false,
message:error.message
});
}
};
//single complaint details
exports.getComplaintById =
async(req,res)=>{

try{

const complaint =
await Complaint.findById(
req.params.id
)
.populate(
"assignedTo",
"name email role"
);

if(!complaint){

return res.status(404).json({
success:false,
message:"Complaint not found"
});
}

res.status(200).json({
success:true,
complaint
});

}catch(error){

res.status(500).json({
success:false,
message:error.message
});
}
};
//assign complaint to staff
exports.assignComplaint =
async(req,res)=>{

try{

const {
facultyId
} = req.body;

const faculty =
await User.findById(
facultyId
);

if(!faculty){

return res.status(404).json({
success:false,
message:"Faculty not found"
});
}

const complaint =
await Complaint.findByIdAndUpdate(

req.params.id,

{
assignedTo:facultyId,
status:"Assigned"
},

{
new:true
}

);

if(!complaint){
  return res.status(404).json({
    success:false,
    message:"Complaint not found"
  });
}

await createLog(

complaint._id,

"Complaint Assigned",

req.user.id,

"Assigned to faculty"

);

res.status(200).json({
success:true,
complaint
});

}catch(error){

res.status(500).json({
success:false,
message:error.message
});
}
};
//update complaint status
exports.updateStatus =
async(req,res)=>{

try{

const {status}
=
req.body;

const complaint =
await Complaint.findByIdAndUpdate(

req.params.id,

{
status
},

{
new:true
}

);

if(!complaint){
  return res.status(404).json({
    success:false,
    message:"Complaint not found"
  });
}

await createLog(

complaint._id,

`Status Changed To ${status}`,

req.user.id

);

if(complaint.email){

await sendEmail(

complaint.email,

"Complaint Status Updated",

`Your complaint ${complaint.complaintId} is now ${status}`

);
}

res.status(200).json({
success:true,
complaint
});

}catch(error){

res.status(500).json({
success:false,
message:error.message
});
}
};
//add remarks to complaint
exports.addRemark =
async(req,res)=>{

try{

const {
message
} = req.body;

const complaint =
await Complaint.findById(
req.params.id
);

if(!complaint){

return res.status(404).json({
success:false,
message:"Complaint not found"
});
}

complaint.remarks.push({

message,

addedBy:req.user.id

});

await complaint.save();

await createLog(

complaint._id,

"Remark Added",

req.user.id,

message

);

res.status(200).json({
success:true,
complaint
});

}catch(error){

res.status(500).json({
success:false,
message:error.message
});
}
};
exports.getAssignedComplaints =
async(req,res)=>{

try{

const complaints =
await Complaint.find({

assignedTo:
req.user.id

})
.sort({
createdAt:-1
});

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

//delete complaint
exports.deleteComplaint =
async(req,res)=>{

try{

await Complaint.findByIdAndDelete(
req.params.id
);

res.status(200).json({
success:true,
message:
"Complaint Deleted"
});

}catch(error){

res.status(500).json({
success:false,
message:error.message
});
}
};
//log helper
const createLog =
async(

complaintId,

action,

performedBy,

remarks=""

)=>{

await ActivityLog.create({

complaintId,

action,

performedBy,

remarks

});
};

//get complaint history
exports.getComplaintHistory =
async(req,res)=>{

try{

const logs =
await ActivityLog.find({

complaintId:req.params.id

})

.populate(
"performedBy",
"name email"
)

.sort({
createdAt:-1
});

res.status(200).json({

success:true,

logs

});

}catch(error){

res.status(500).json({

success:false,

message:error.message

});
}
};