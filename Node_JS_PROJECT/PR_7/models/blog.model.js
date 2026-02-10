const mongoose = require("mongoose");


const commentSchema = new mongoose.Schema({
  name: { 
    type: String,
     required: true 
    },         
  email: {
     type: String 
    },                       
  text: {
     type: String, 
     required: true
     },          
  createdAt: {
     type: Date, 
     default: Date.now },    
});


const blogSchema = new mongoose.Schema({
  title: {
     type: String, 
    },      
  desc: { 
    type: String,
    },         
  pubDate: {
     type: Date, 
     default: Date.now 
    },     
  category: { 
    type: String 
  },                     
  image: { 
    type: String 
  },                        
  authName: { 
    type: String 
  },                     
  authImage: 
  { type: String 
  },                    
  authId: {
     type: String 
    },                        
  comments: [commentSchema],                      
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
