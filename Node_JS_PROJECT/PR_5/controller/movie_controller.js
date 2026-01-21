const Movie = require("../model/Movie_model");
const path = require("path");
const fs = require("fs");


const homepage = async (req, res) => {
    try {
        const movies = await Movie.find();
        res.render("index", { movies });
    } catch (error) {
        res.status(500).send("Error fetching products");
    }
}

const addForm = async (req, res) => {
    res.render('add_movie')
}

const addMovie = async (req, res) => {
    const image = req.file ? '/uploads/' + req.file.filename : "";
    await Movie.create({ ...req.body, image });
    res.redirect("/");
}

const editForm = async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    res.render("edit_movie", { movies: movie });
}

const editmovie = async (req, res) => {
    const id = req.params.id;
    let movie = await Movie.findById(id);
    if (!movie) {
        return res.redirect("back");
    }
    let imagePath = movie.image;
    if (req.file) {
        const oldImagePath = path.join(__dirname, "..", movie.image);
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }
        imagePath = `/uploads/${req.file.filename}`;
    }
    await Movie.findByIdAndUpdate(id, { ...req.body, image: imagePath }, { new: true });
    res.redirect("/");
};

 const deletemovie = async (req, res) => {
    const id = req.params.id;
    const record = await Movie.findById(id);
    if (record?.image) {
        const imagePath = path.join(__dirname, "..", record.image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }
    await Movie.findByIdAndDelete(id);
    res.redirect("/");
};



const viewSingleMovie = async (req, res) => {
  try {
    const id = req.params.id; 
    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).send("Movie not found");
    }

    res.render("view_movie", { movie }); 
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};




module.exports = { homepage, addForm, addMovie, editForm, editmovie, deletemovie, viewSingleMovie }

