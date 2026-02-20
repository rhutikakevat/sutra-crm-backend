const express = require("express");
const { initializeDatabase } = require("./db/db.connect");
const leadsRoutes = require("./routes/leadsRoutes")
const app = express();
const cors = require("cors")

const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
}

initializeDatabase()

app.use(cors(corsOptions))
app.use(express.json());

app.use("/leads", leadsRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log("Server is running on a port", PORT)
})