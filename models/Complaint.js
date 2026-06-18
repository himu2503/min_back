const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    isAnonymous:{
    type:Boolean,
    default:false
    },
    complaintId: {
      type: String,
      unique: true
    },

    studentName: String,

    rollNumber: String,

    email: String,

    phone: String,

    category: {
      type: String,
      required: true
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },

    description: {
      type: String,
      required: true
    },

    attachmentUrl: {
      type: String
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Assigned",
        "In Progress",
        "Resolved",
        "Closed",
        "Escalated"
      ],
      default: "Pending"
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    remarks: [
      {
        message: String,
        addedBy: String,

        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Complaint",
  complaintSchema
);