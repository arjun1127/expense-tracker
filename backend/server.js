require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDb= require("./config/db");
const app = express();
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoute = require("./routes/expenseRoute");
const dashboardRoute = require("./routes/dashboardRoute");

app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

connectDb();
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense",expenseRoute);
app.use("/api/v1/dashboard", dashboardRoute);



//server uploads folder as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

