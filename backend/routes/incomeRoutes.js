const express = require("express");
const {
  addIncome,
  getAllIncome,
  deleteIncome,
  downloadIncomeExel,
  getIncomeSummary,
  filterIncome,
  getTopIncomeSources,
  getIncomeGrowth,
} = require("../controllers/incomeController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// CRUD Routes
router.post("/add-income", protect, addIncome);
router.get("/get-income", protect, getAllIncome);
router.delete("/delete-income/:id", protect, deleteIncome);
router.get("/download-income-excel", protect, downloadIncomeExel);

// Analytics Routes
router.get("/summary", protect, getIncomeSummary);
router.get("/filter", protect, filterIncome);
router.get("/top-sources", protect, getTopIncomeSources);
router.get("/growth", protect, getIncomeGrowth);

module.exports = router;
