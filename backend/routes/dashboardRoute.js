const express=require("express");
const {protect}=require("../middlewares/authMiddleware");
const {getDashboardStats}=require("../controllers/dashboardController.js");
const router=express.Router();

router.get("/",protect,getDashboardStats);

module.exports=router;