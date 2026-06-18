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

exportExcel,

exportPDF

}
=
require(
"../controllers/reportController"
);

router.get(

"/excel",

auth,

role("admin","hod"),

exportExcel

);

router.get(

"/pdf",

auth,

role("admin","hod"),

exportPDF

);

module.exports = router;
