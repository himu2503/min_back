const cron =
require("node-cron");

const Complaint =
require("../models/Complaint");

cron.schedule(

"0 0 * * *",

async()=>{

try{

const sevenDaysAgo =
new Date();

sevenDaysAgo.setDate(

sevenDaysAgo.getDate()-7

);

await Complaint.updateMany(

{

status:"Pending",

createdAt:{
$lte:sevenDaysAgo
}

},

{

status:"Escalated"

}

);

console.log(
"Escalation Job Ran"
);

}catch(error){

console.log(error);

}

});
