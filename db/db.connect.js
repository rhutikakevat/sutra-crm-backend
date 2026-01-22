const mongoose = require("mongoose");
require("dotenv").config();

const mongooseUrl = process.env.MONGODB;

const initializeDatabase = async () => {
    try {
        const connection = await mongoose.connect(mongooseUrl, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        })

        if (connection) {
            console.log("Connected database successfully!")
        }
    } catch (error) {
        console.log("Error occurred while connect to the database", error)
        throw error;
    }
}

module.exports = { initializeDatabase };
