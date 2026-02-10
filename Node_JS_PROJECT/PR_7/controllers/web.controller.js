const Blog = require("../models/blog.model");
const BlogUser = require("../models/blogUser.model");


exports.webPage = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = 6; 
    const skip = (page - 1) * limit;

    const totalBlogs = await Blog.countDocuments();
    const blogs = await Blog.find()
      .sort({ pubDate: -1 }) 
      .skip(skip)
      .limit(limit);

    return res.render("Web/webpage", { 
      blogs,
      session: req.session,
      currentPage: page,
      totalPages: Math.ceil(totalBlogs / limit)
    });
  } catch (error) {
    console.error("Error in webPage:", error);
    res.redirect("/");
  }
};


exports.singleBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) return res.status(404).send("Blog not found");

    res.render("Web/singleBlog", { 
      blog,
      session: req.session
    });
  } catch (error) {
    console.error("Error in singleBlog:", error);
    res.redirect("/WebPage/home")
  }
};


exports.userLoginPage = (req, res) => {
  res.render("Web/userLogin");
};

exports.userLogin = async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;

    const user = await BlogUser.findOne({ userEmail, userPassword });
    if (!user) {
       return res.render("Web/userLogin");
    }

    req.session.user = {
      id: user._id,
      firstName: user.userFirstName,
      lastName: user.userLastName,
      email: user.userEmail
    };

    res.redirect("/webPage/home");
  } catch (err) {
    console.error("Error in userLogin:", err);
    res.status(500).send("Server Error");
  }
};

exports.addComment = async (req, res) => {
  try {
    const blogId = req.params.id;

    if (!req.session.user) {
      return res.render("Web/userLogin");
    }

    const { text } = req.body;
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).send("Blog not found");

    blog.comments.push({
      name: req.session.user.firstName + " " + req.session.user.lastName,
      email: req.session.user.email,
      text,
      createdAt: new Date()
    });

    await blog.save();
    res.redirect(`/webPage/home/single-blog/${blogId}`);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).send("Server Error");
  }
};


exports.registerPage = (req, res) => {
  res.render("Web/signUp");
};


exports.registerUser = async (req, res) => {
  try {
    const { userFirstName, userLastName, userEmail, userPassword, userGender, userContact } = req.body;

    const existingUser = await BlogUser.findOne({ userEmail: userEmail });
    if (existingUser) {
        req,flash("error" , "User Already Exist !!!")
      res.render("Web/signUp");
    }

    const newUser = new BlogUser({
      userFirstName,
      userLastName,
      userEmail,
      userPassword, 
      userGender,
      userContact,
    });

    await newUser.save();
    res.render("Web/userLogin");
  } catch (err) {
    console.error("Error in registerUser:", err);
    res.status(500).send("Server Error");
  }
};

