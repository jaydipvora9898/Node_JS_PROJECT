const mongoose =   require("mongoose")

const DB_connection = async (req, res) => {
    await mongoose.connect("mongodb+srv://JaydipVora:J_1302@cluster0.mla04j8.mongodb.net/Meesho_App")
    .then(console.log("connection successfully "))
    .catch((err) =>  console.log(err))
}

module.exports = DB_connection;
