require("dotenv")
.config();

const mongoose =
require("mongoose");

const bcrypt =
require("bcryptjs");

const User =
require("./models/User");

mongoose.connect(
process.env.MONGO_URI
);

const seed =
async()=>{

await User.deleteMany();

const password =
await bcrypt.hash(
"123456",
10
);

await User.create([

{
name:"Admin",
email:"admin@gmail.com",
password,
role:"admin",
phone:"9999999999"
},

{
name:"HOD",
email:"hod@gmail.com",
password,
role:"hod",
phone:"9999999998"
},

{
name:"Faculty",
email:"faculty@gmail.com",
password,
role:"faculty",
phone:"9999999997"
}

]);

console.log(
"Users Created"
);

process.exit();

};

seed();
