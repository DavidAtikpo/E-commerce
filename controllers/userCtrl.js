import generateToken from "../config/jwtToken.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler"
import validateMongoDbId from "../utils/validateMongodbid.js"
import generateRefreshToken from "../config/refreshToken.js";
import jwt  from "jsonwebtoken";

//register User
const createUser =asyncHandler(async(req,res)=>{
  

    const email = req.body.email;
    const existingUser = await User.findOne({email:email});

    if(!existingUser){
      const newUser = await User.create(req.body);
      return res.status(200).json({message:"User is create successfully",newUser})
    }else{
     throw new Error("User already exist")
    }
  } 

)
// login User
const loginUserCtrl = asyncHandler(async(req,res)=>{
  const {email,password}= req.body;
  const findUser = await User.findOne({email});
  if(findUser && await findUser.isPasswordMatched(password)){
    const refreshToken = await generateRefreshToken(findUser?.id)
    const updateuser = await User.findByIdAndUpdate(findUser?.id, {refreshToken:refreshToken},{new:true})
    res.cookie('refreshToken',refreshToken,{
      httpOnly:true,
      maxAge:72*60*60*1000,
    })
  res.json({
    _id:findUser?._id,
    firstname:findUser?.firstname,
    lastname:findUser?.lastname,
    mobile:findUser?.mobile,
    token:generateToken(findUser?._id)

  })
  }else{
    throw new Error("Invalid credentials")
  }
});

// get all Users

const getAllUser = asyncHandler(async(req,res)=>{
  try {
    const getUsers = await User.find()
    res.json(getUsers)
  } catch (error) {
    throw new Error(error)
  }
});

// get User by id
const getUserById = asyncHandler(async(req,res)=>{
  const {id}= req.params; 
  validateMongoDbId(id);
try {
const getUser = await User.findById(id)
if(getUser){
res.json(getUser)
}else{
  res.json({message:"User not found"})
}
} catch (error) {
  throw new Error("User not fuond")
}
})

// delete User
const deleteUserById = asyncHandler(async(req,res)=>{
  const {id}= req.params;
  validateMongoDbId(id);
  try {
  const getUser = await User.findByIdAndDelete(id)
  if(getUser){
  res.json({message:"delete successfully"})
  }else{
    res.json({message:"User not found"})
  }
  } catch (error) {
    throw new Error(error)
  }
  });

  //handle refresh token
  const handleRefreshToken = asyncHandler(async(req,res)=>{
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("no Refresh Token in cookies")
    const refreshToken= cookie.refreshToken;
  const user = await User.findOne({refreshToken});
  if(!user)throw new Error("no Refresh Token present in the db or not match")
  jwt.verify(refreshToken,process.env.JWT_SECRET,(err, decoded)=>{
    if(err || user.id !== decoded.id){
      throw new Error("there is somethig wrong with refresh token")
    };
    const accessToken = generateToken(user?.id);
    res.json({accessToken});
});

  });

  //updateUser

  const updateUser= asyncHandler(async(req,res)=>{
    const {id}= req.user;
    validateMongoDbId(id);
    try {
      
      const updatUser = await User.findByIdAndUpdate(id,{
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        email:req.body.email,
        mobile:req.body.mobile
      },{new:true,});
      
      if(updatUser){
        res.json({message:"update successfully",updatUser})
      }else{
        res.json({message:"User not found"})
      }
    } catch (error) {
      throw new Error(error)
    }
  })

  // Blocked the user by id
  const blockUser = asyncHandler(async(req,res)=>{
    const {id}= req.params;
    validateMongoDbId(id);
    try {
      const block= await User.findByIdAndUpdate(id,
        {
        isBlocked:true,
      },
      {
        new:true,
      });
      res.json({message:"user Blocked"})
    } catch (error) {
      throw new Error(error)
    }
    })

// unblock user
  const unblockUser = asyncHandler(async(req,res)=>{
    const {id}= req.params;
    validateMongoDbId(id);
    try {
      const unblock= await User.findByIdAndUpdate(id,
        {
        isBlocked:false,
      },
      {
        new:true,
      })
      res.json({message:"user Unblocked"});
    } catch (error) {
      throw new Error(error)
    }
  });

  // logout functionality

  const logout = asyncHandler(async(req,res)=>{
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("no Refresh Token in cookies")
    const refreshToken= cookie.refreshToken;
  const user = await User.findOne({refreshToken});
  if(!user){
  res.clearCookie("refreshToken",{
    httpOnly:true,
    secure:true,
  })
  res.sendStatus(204); // forbidden
}
await User.findOneAndUpdate({refreshToken},{
  refreshToken:"",
});
res.clearCookie("refreshToken",{
  httpOnly:true,
  secure:true,
});
res.json("logout successfully")// forbidden
  });


export default {createUser,loginUserCtrl,getAllUser,getUserById,deleteUserById,updateUser,blockUser,unblockUser,handleRefreshToken,logout};