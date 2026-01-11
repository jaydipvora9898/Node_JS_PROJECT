const express =  require("express")
const Book = require('./model/Book_Model')
const mongoose_connect  = require('./config/Mongoose_connection')


const server  = express();

server.use(express.urlencoded())
server.set("view engine" , "ejs")
server.use(express.static ("public"))

server.get("/", async (req, res) => {
    let Books =  await Book.find() 
    res.render("index" , {Books})
})

server.get("/add-book", (req, res) => {
    res.render("add-book")

})
server.get("/edit-book/:id",  async (req, res) => {
    let id  =  req.params.id ;
    let Books =  await Book.findById(id) 
    res.render("edit-book", {Books})
})

server.post("/edit-book/:id",  async (req, res) => {
    let id  =  req.params.id ;
    let Books =  await Book.findByIdAndUpdate(id, req.body) 
    res.redirect('/')
})

server.post('/add-Book', async (req, res) => {
    await Book.create(req.body)
    console.log("Create Book  Succesfully");
    res.redirect("/")
})


server.get('/delete-book/:id', async (req, res) => {
     let id =  req.params.id
     let book = await Book.findByIdAndDelete(id)
     res.redirect("/")
})



server.listen(8000, () => {
    mongoose_connect()
    console.log("Server Running on http://localhost:8000");
})