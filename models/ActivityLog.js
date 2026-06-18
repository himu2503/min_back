const mongoose = require("mongoose");

const activityLogSchema =
new mongoose.Schema(
{
  complaintId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Complaint",
    required:true
  },

  action:{
    type:String,
    required:true
  },

  performedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  remarks:String

},
{
  timestamps:true
}
);

module.exports =
mongoose.model(
  "ActivityLog",
  activityLogSchema
);