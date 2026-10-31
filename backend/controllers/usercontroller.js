const user = require("../models/userschema")
const bcrypt = require("bcrypt")
const {generateToken, verifyJWT}  = require("../utils/jwt.token")
async function createuser(req,res) {
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

    const newuser = await user.create({
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
        user : {
            email : req.body.email,
            token
        }
    })      
};
async function login(req, res) {
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

  const emailver= await user.findOne({email})
  if(!emailver){
    return res.status(400).json({
      success:false,
      message:"user not exist"
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
    user : {
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
    const user = await User.findByIdAndUpdate(
      id,
      { isVerify: true },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not exist",
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

async function searchLocation(req, res) {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    console.log("🔍 Searching for location:", query);

    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=10&lang=en`;
    
    console.log("📍 Fetching from:", url);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ProjectRider/1.0'
      }
    });

    console.log("✅ Geocoder response status:", response.status);

    if (!response.ok) {
      console.error("❌ Geocoder error response:", response.status, response.statusText);
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    const data = await response.json();

    const results = Array.isArray(data?.features)
      ? data.features.map((feature) => {
          const properties = feature.properties || {};
          const coordinates = feature.geometry?.coordinates || [];
          const nameParts = [
            properties.name,
            properties.city,
            properties.state,
            properties.country,
          ].filter(Boolean);

          return {
            display_name: nameParts.join(", "),
            lat: coordinates[1],
            lon: coordinates[0],
          };
        })
      : [];

    console.log("📦 Results count:", results.length);

    return res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error("❌ Location search error:", error.message);
    return res.status(200).json({
      success: true,
      data: []
    });
  }
}

console.log("contro clear");
module.exports = {createuser , login , verifyEmail, searchLocation}