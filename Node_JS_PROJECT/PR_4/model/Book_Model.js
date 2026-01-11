const mongoose =  require('mongoose')

const bookSchema =  mongoose.Schema( {
    name : String, 
    author : {
        type : String
    }, 
    desc : {
        type : String
    }, 
    price : {
        type : Number
    }, 
    image : {
        type : String
    }, 
    genre : {
        type : String
    }, 
    publishDate : {
        type : Date
    }, 
   

}

)

const Book =  mongoose.model('Books ' , bookSchema)

module.exports =  Book;