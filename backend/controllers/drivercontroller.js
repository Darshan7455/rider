const driver = require("../models/driverschema")
const bcrypt = require("bcrypt")
const {generateToken, verifyJWT}  = require("../utils/jwt.token")
async function createdriver(req,res) {
     const {name , email , password} = req.body;

    if(!name){
         return res.status(400).json({
             success : false,
             message : "enter the name"
         })
    }
    if(!email){
        return res.status(400).json({
            success : false,
            message : "enter the email"
        })
    }
    if(!password){
        return res.status(400).json({
            success : false,
            message : "enter the password"
        })
    }
    const hashpass = await bcrypt.hash(req.body.password, 10)

    const newdriver = await driver.create({
        name  : req.body.name,
        email : req.body.email,
        password : hashpass,
    })

     const payload = ({
        email : req.body.email,
        password : req.body.password
    })
    let token = await generateToken(payload);

    return res.status(200).json({
        success : true,
        message : "signed in sucessfully",
        driver : {
            email : req.body.email,
            token
        }
    })      
};
async function driverlogin(req, res) {
  const { password, email } = req.body;
  if(!password){
    return res.status(400).json({
      success:false,
      message:"enter password"
    });
  }
  if(!email){
    return res.status(400).json({
      success:false,
      message:"enter email"
    });
  }

  const emailver= await driver.findOne({email})
  if(!emailver){
    return res.status(400).json({
      success:false,
      message:"driver not exist"
    });
  }
  let checkForPass = await bcrypt.compare(
      password,
      emailver.password
    );

    if (!checkForPass) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }
  const payload = ({
        email : req.body.email,
        password : req.body.password
    })
    let token = await generateToken(payload);
  return res.status(200).json({
    success:true,
    message: "logged in sucessfull",
    driver : {
      email,
      token
    }
  })
};
async function verifyEmail(req, res) {
  try {
    const { verificationToken } = req.params;

    const verifyToken = await verifyJWT(verificationToken);

    if (!verifyToken) {
      return res.status(404).json({
        success: false,
        message: "Invalid Token/Email expired",
      });
    }
    const { id } = verifyToken;
    const driver = await driver.findByIdAndUpdate(
      id,
      { isVerify: true },
      { new: true }
    );

    if (!driver) {
      return res.status(400).json({
        success: false,
        message: "driver not exist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
      error: error.message,
    });
  }
};

console.log("contro clear");
module.exports = {createdriver , driverlogin , verifyEmail}