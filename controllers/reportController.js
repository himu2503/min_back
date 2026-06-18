const ExcelJS =
require("exceljs");

const PDFDocument =
require("pdfkit");

const Complaint =
require("../models/Complaint");

exports.exportExcel =
async(req,res)=>{

const complaints =
await Complaint.find();

const workbook =
new ExcelJS.Workbook();

const sheet =
workbook.addWorksheet(
"Complaints"
);

sheet.columns = [

{
header:"Complaint ID",
key:"complaintId",
width:20
},

{
header:"Category",
key:"category",
width:20
},

{
header:"Priority",
key:"priority",
width:15
},

{
header:"Status",
key:"status",
width:20
}

];

complaints.forEach(c=>{

sheet.addRow({

complaintId:
c.complaintId,

category:
c.category,

priority:
c.priority,

status:
c.status

});

});

res.setHeader(

"Content-Type",

"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

);

res.setHeader(

"Content-Disposition",

"attachment; filename=complaints.xlsx"

);

await workbook.xlsx.write(res);

res.end();

};

exports.exportPDF =
async(req,res)=>{

const complaints =
await Complaint.find();

const doc =
new PDFDocument();

res.setHeader(
"Content-Type",
"application/pdf"
);

res.setHeader(
"Content-Disposition",
"attachment; filename=report.pdf"
);

doc.pipe(res);

doc.fontSize(20);

doc.text(
"Grievance Report"
);

doc.moveDown();

complaints.forEach(c=>{

doc.text(
`${c.complaintId} | ${c.category} | ${c.status}`
);

});

doc.end();

};
