const express =
require("express");

const router =
express.Router();

const auth =
require("../middleware/auth");

const role =
require(
"../middleware/roleMiddleware"
);

const upload =
require("../middleware/upload");

const {
validateComplaint
}
=
require(
"../middleware/validateComplaint"
);

const {

createComplaint,

getAllComplaints,

getComplaintById,

assignComplaint,

updateStatus,

addRemark,

getAssignedComplaints,

deleteComplaint,

getComplaintHistory,

trackComplaint

} = require(
"../controllers/complaintController"
);

//student routes
router.post(

"/",

upload.single("file"),

validateComplaint,

createComplaint

);

//admin and hod routes
router.get(

"/",

auth,

getAllComplaints

);

router.get(

"/faculty",

auth,

role("faculty"),

getAssignedComplaints

);

router.get(

"/:id",

auth,

getComplaintById

);

//assign complaint to staff
router.put(

"/assign/:id",

auth,

role("admin","hod"),

assignComplaint

);
//update status of complaint
router.put(

"/status/:id",

auth,

updateStatus

);
//add remark
router.post(

"/remark/:id",

auth,

addRemark

);
//delete complaint
router.delete(

"/:id",

auth,

role("admin"),

deleteComplaint

);

//get complaint history
router.get(

"/history/:id",

auth,

getComplaintHistory

);

//track complaint
router.get(
"/track/:id",
trackComplaint
);
module.exports = router;