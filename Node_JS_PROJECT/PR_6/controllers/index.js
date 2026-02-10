const Blog = require("../models/blog.model");
const User = require("../models/user.model");

const otpGenerator = require('otp-generator')
const sendMail = require("../middleware/nodemailer_sendotp");

exports.dashboard = async (req, res) => {
   try {
      if(req.cookies.admin == undefined|| req.cookies.admin._id == undefined){
         return res.redirect("/")
      }
      else{
         let user =  await User.findById(req.cookies.admin._id)
        return res.render("dashboard", {user})
      }
      
   } catch (error) {
      console.log("page not Found");
      res.redirect("/")
   }
};

exports.loginpage = (req, res) => {
   res.render("Auth/login_page"); 
};

exports.loginUser = async (req, res)  => {
   let user =  await User.findOne({email: req.body.email})
   if(user){
      if(user.password == req.body.password) {
         res.cookie("admin", user)
         return res.redirect("/dashboard")
      }
   }
}

exports.logOut = async (req, res) => {
   try {
     res.clearCookie("admin", { path: "/" }); 
     return res.redirect("/");
   } catch (error) {
     console.log("something error", error);
     res.redirect("/dashboard");
   }
 };
 

 exports.profile = async (req, res) => {
try {
   let user =  await User.findById(req.cookies.admin._id) 
   res.render('profile' ,{user})
   
} catch (error) {
   console.log("something error", error);
   res.redirect("/dashboard");
}
 }


 exports.passwordChangeForm =  async (req, res) => {
   try {
      if(req.cookies.admin == undefined|| req.cookies.admin._id == undefined){
         return res.redirect("/")
      }
      else{
         let user =  await User.findById(req.cookies.admin._id)
        return res.render("changePassword", {user})
      }
      
   } catch (error) {
      console.log("page not Found");
      res.redirect("/dashboard")
 }}

 exports.passwordChange = async (req, res) => {
   try {
     const { oldPassword, newPassword, conformPassword } = req.body;
 
     let user = await User.findById(req.cookies.admin._id);
 
     if (user) {
      if (oldPassword === newPassword) {
         console.log("oldPassword andnewPassword cannot be the same");
         return res.redirect("/dashboard");
       }
   
       if (newPassword === conformPassword) {
         await User.findByIdAndUpdate(user._id, { password: newPassword }, { new: true });
         console.log("Password changed successfully");
         return res.redirect("/dashboard");
       } else {
         console.log("newPassword and confirmPassword  Not match");
         return res.redirect("/dashboard");
       }
     }
     else{
      console.log("User not found");
      return res.redirect("/dashboard");
     }
    
   } catch (error) {
     console.log("page not Found", error);
     res.redirect("/dashboard");
   }
 };
 



 exports.myBlog = async (req, res) => {
  try {
    if (!req.cookies.admin || !req.cookies.admin._id) {
      return res.redirect("/");
    }

    const user = await User.findById(req.cookies.admin._id);
    if (!user) return res.redirect("/");

    const category = req.params.category || "all";

    const perPage = 6;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * perPage;

    let query = { authId: user._id };
    if (category !== "all") query.category = category;

    const totalBlogs = await Blog.countDocuments(query);

    const blogs = await Blog.find(query)
      .sort({ pubDate: -1 })
      .skip(skip)
      .limit(perPage);

    const totalPages = Math.ceil(totalBlogs / perPage);

    res.render("my_blog", {  user, blogs, category, currentPage: page, totalPages,
    });

  } catch (error) {
    console.log("page not Found", error);
    res.redirect("/");
  }
};



exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.redirect("back");
    }

    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("Generated OTP:", otp);

    res.cookie("otp", otp, );
    res.cookie("email", email, );

    const data = {
      from: '"Admin_Panel_08" <yogeshrd1708@gmail.com>',
      to: "yogeshrd1708@gmail.com", 
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    };

    await sendMail(data);

    console.log("OTP sent to:", email);
     return res.redirect("/OTPForm")
   
  } catch (error) {
    console.log("something error", error);
    return res.status(500).send("Failed to send OTP");
  }
};



exports.OTPForm  =  async (req, res) => {
    try {
      res.render("Auth/otppage")
      
    } catch (error) {
      console.log("Verify OTP Page Not Found ! ", error);
       return res.redirect("/") 
    }
}

exports.newPassword =  async  (req, res) => {

try {
return res.render("Auth/newPassword")

} catch (error) {
console.log("new Password Page Not Found !". error);
return res.redirect("/")

}
}
exports.verifyOTP = async(req, res) => {
try {
  let otp = req.cookies.otp;
  if(otp == req.body.otp){
    res.clearCookie("otp");
    return res.redirect("/resetPasswordForm");
  }else{
    console.log("OTP is Not Verified!!!!");
    return res.redirect("/OTPForm")
  }
} catch (error) {
  console.log("something Wrong");
  return res.redirect("/");
}
};


exports.resetPassword = async (req, res) => {
try {
  let email = req.cookies.email;
  let user = await User.findOne({email: email});
  if(user){
      if(req.body.confirmPassword == req.body.nPassword){
        await User.findByIdAndUpdate(user._id, {password: req.body.nPassword}, {new: true});
        res.clearCookie("email");
        return res.redirect("/");
      }else{
        console.log("Password is not matched");
        return res.redirect("back");
      }
  }else{
    return res.redirect("/");
  }
} catch (error) {
  console.log("something Wrong");
  return res.redirect("back");
}
}