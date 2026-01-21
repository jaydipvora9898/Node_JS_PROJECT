    const mongoose =  require('mongoose')


    const movieSchema =  mongoose.Schema({

        name : String , 

        desc : {
            type : String
        },
        language : {
            type : String
        },
        ageValidation : {
            type : Number
        },
        category : {
            type : String
        },
        image : {
            type : String
        },
        status :{
            type : String
        },
        duration : {
            type : Number
        },
        rating :{
            type : Number
        }
    })

    const  Movie =  mongoose.model("movies", movieSchema)

    module.exports = Movie