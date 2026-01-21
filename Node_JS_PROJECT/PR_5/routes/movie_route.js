const express = require("express")
const router = express.Router();

const { addForm, addMovie, editmovie, homepage, editForm, deletemovie, viewSingleMovie } = require("../controller/movie_controller");
const upload = require("../middleware/upload_img");

router.get("/", homepage)
router.get("/add_movie", addForm)
router.post("/add-movie", upload.single("image"), addMovie)
router.get("/edit-movie/:id", editForm)
router.post("/edit-movie/:id", upload.single("image"), editmovie)
router.get("/delete-movie/:id", deletemovie)
router.get("/view-movie/:id", viewSingleMovie)


module.exports = router