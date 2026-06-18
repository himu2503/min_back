const {
 body,
 validationResult
}
=
require(
"express-validator"
);

exports.validateComplaint = [

body("category")
.notEmpty()
.withMessage(
"Category required"
),

body("description")
.notEmpty()
.withMessage(
"Description required"
),

(req,res,next)=>{

const errors =
validationResult(req);

if(!errors.isEmpty()){

return res.status(400).json({

success:false,

errors:errors.array()

});
}

next();

}

];
