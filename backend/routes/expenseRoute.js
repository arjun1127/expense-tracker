const express = require("express");
const {
  addExpense,
  getAllExpense,
  deleteExpense,
  downloadExpenseExel,
  getExpenseSummary,
  getTopCategories,
  getExpenseGrowth,
  filterExpenses,
  getBudgetStatus,
  getExpenseIncomeRatio,
} = require("../controllers/expenseController.js");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Core expense operations
router.post("/add-expense", protect, addExpense);
router.get("/get-expense", protect, getAllExpense);
router.delete("/delete-expense/:id", protect, deleteExpense);
router.get("/download-expense-excel", protect, downloadExpenseExel);

// Advanced analytics & insights
router.get("/summary", protect, getExpenseSummary);            // Monthly summary chart
router.get("/top-categories", protect, getTopCategories);      // Top spending categories
router.get("/growth", protect, getExpenseGrowth);              // Month-over-month growth
router.get("/filter", protect, filterExpenses);                // Filter by date range
router.get("/budget-status", protect, getBudgetStatus);        // Budget remaining/over
router.get("/expense-income-ratio", protect, getExpenseIncomeRatio); // Expense-to-income ratio

module.exports = router;
