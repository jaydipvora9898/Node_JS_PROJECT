const mongoose =  require('mongoose')

const mongoose_connect = () => {
    mongoose.connect("mongodb://localhost:27017/BooksInfo")
    .then(() => console.log("DataBase Connect Succesfully"))
    .catch((err) => console.log(err))
}

module.exports =  mongoose_connect;