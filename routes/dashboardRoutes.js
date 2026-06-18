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

const {

getDashboardSummary,

categoryAnalytics,

priorityAnalytics,

statusAnalytics,

monthlyTrends,

recentComplaints,

facultyPerformance

} = require(
"../controllers/dashboardController"
);

router.get(

"/summary",

auth,

role("admin","hod"),

getDashboardSummary

);

router.get(

"/categories",

auth,

role("admin","hod"),

categoryAnalytics

);

router.get(

"/priorities",

auth,

role("admin","hod"),

priorityAnalytics

);

router.get(

"/statuses",

auth,

role("admin","hod"),

statusAnalytics

);

router.get(

"/monthly",

auth,

role("admin","hod"),

monthlyTrends

);

router.get(

"/recent",

auth,

role("admin","hod"),

recentComplaints

);

router.get(

"/faculty",

auth,

role("admin","hod"),

facultyPerformance

);

module.exports = router;