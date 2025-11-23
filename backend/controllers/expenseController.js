const Expense = require("../models/Expense");
const Income = require("../models/Income");
const User = require("../models/User");
const xlsx = require("xlsx");
const { Types } = require("mongoose");

exports.addExpense = async (req, res) => {
  const userId = req.user.id;
  try {
    const { icon, category, amount, date } = req.body;
    if (!category || !amount || !date) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date),
    });

    await newExpense.save();
    res
      .status(201)
      .json({ message: "Expense added successfully", expense: newExpense });
  } catch (error) {
    console.error("Error adding Expense:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllExpense = async (req, res) => {
  const userId = req.user.id;
  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    res.status(200).json({ expenses });
  } catch (error) {
    console.error("Error fetching Expense:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting Expense:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.downloadExpenseExel = async (req, res) => {
  const userId = req.user.id;
  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    const data = expenses.map((expense) => ({
      Category: expense.category,
      Amount: expense.amount,
      Date: expense.date.toISOString().split("T")[0],
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expenses");
    const filePath = "Expense.xlsx";
    xlsx.writeFile(wb, filePath);
    res.download(filePath);
  } catch (error) {
    console.error("Error downloading Expense excel:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getExpenseSummary = async (req, res) => {
  const userId = req.user.id;
  try {
    // aggregate by month-year to be robust and sorted
    const userObjectId = new Types.ObjectId(userId);

    const summary = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]);

    // transform into months & values arrays (human-readable month names)
    const months = [];
    const values = [];
    let totalExpense = 0;

    summary.forEach((item) => {
      const monthIndex = item._id.month - 1;
      const year = item._id.year;
      const monthLabel = new Date(year, monthIndex).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      months.push(monthLabel);
      values.push(item.totalAmount);
      totalExpense += item.totalAmount;
    });

    res.status(200).json({
      totalExpense,
      months,
      values,
    });
  } catch (error) {
    console.error("Error fetching expense summary:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getTopCategories = async (req, res) => {
  const userId = req.user.id;
  try {
    const userObjectId = new Types.ObjectId(userId);

    const topCategories = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      topCategories: topCategories.map((c) => ({
        category: c._id,
        total: c.total,
      })),
    });
  } catch (error) {
    console.error("Error fetching top categories:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getExpenseGrowth = async (req, res) => {
  const userId = req.user.id;
  try {
    const userObjectId = new Types.ObjectId(userId);
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-11
    const currentYear = now.getFullYear();

    const getTotalForMonth = async (monthIndex, year) => {
      // monthIndex expected 0-11
      const start = new Date(year, monthIndex, 1);
      const end = new Date(year, monthIndex + 1, 1); // exclusive
      const result = await Expense.aggregate([
        {
          $match: {
            userId: userObjectId,
            date: { $gte: start, $lt: end },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);
      return result[0]?.total || 0;
    };

    // compute previous month with rollover
    let prevMonth = currentMonth - 1;
    let prevYear = currentYear;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear = currentYear - 1;
    }

    const current = await getTotalForMonth(currentMonth, currentYear);
    const previous = await getTotalForMonth(prevMonth, prevYear);

    let growth = "0.00";
    if (previous === 0) {
      // if previous is 0 and current > 0 show 100%, else 0
      growth = current > 0 ? "100.00" : "0.00";
    } else {
      growth = (((current - previous) / previous) * 100).toFixed(2);
    }

    res.status(200).json({
      currentMonthExpense: current,
      previousMonthExpense: previous,
      growth,
    });
  } catch (error) {
    console.error("Error calculating expense growth:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.filterExpenses = async (req, res) => {
  const userId = req.user.id;
  const { startDate, endDate } = req.query;
  try {
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "startDate and endDate are required" });
    }

    const start = new Date(startDate);
    // include entire end day
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const userObjectId = new Types.ObjectId(userId);

    const expenses = await Expense.find({
      userId: userObjectId,
      date: {
        $gte: start,
        $lte: end,
      },
    }).sort({ date: -1 });

    res.status(200).json({
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    console.error("Error filtering expenses:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getBudgetStatus = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    const budget = Number(user?.monthlyBudget || 0);

    if (!budget || budget === 0) {
      // no budget set yet
      return res.status(200).json({
        budget: 0,
        spent: 0,
        remaining: 0,
        status: "no_budget",
      });
    }

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const userObjectId = new Types.ObjectId(userId);

    const thisMonthExpenses = await Expense.aggregate([
      {
        $match: {
          userId: userObjectId,
          date: { $gte: monthStart, $lte: monthEnd },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const spent = thisMonthExpenses[0]?.total || 0;
    const remaining = budget - spent;
    let status = "under";

    if (remaining <= 0) status = "over";
    else if (remaining <= budget * 0.1) status = "warning";

    res.status(200).json({
      budget,
      spent,
      remaining,
      status,
    });
  } catch (error) {
    console.error("Error fetching budget status:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getExpenseIncomeRatio = async (req, res) => {
  const userId = req.user.id;
  try {
    const userObjectId = new Types.ObjectId(userId);
    const now = new Date();
    const monthIndex = now.getMonth();
    const year = now.getFullYear();

    const start = new Date(year, monthIndex, 1);
    const end = new Date(year, monthIndex + 1, 1); // exclusive end

    const getSum = async (Model) => {
      const result = await Model.aggregate([
        {
          $match: {
            userId: userObjectId,
            date: { $gte: start, $lt: end },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);
      return result[0]?.total || 0;
    };

    const income = await getSum(Income);
    const expense = await getSum(Expense);
    const savings = income - expense;
    const savingRate =
      income === 0 ? "0.00%" : `${(((income - expense) / income) * 100).toFixed(2)}%`;

    res.status(200).json({
      month: now.toLocaleString("default", { month: "long", year: "numeric" }),
      income,
      expense,
      savings,
      savingRate,
    });
  } catch (error) {
    console.error("Error calculating expense-income ratio:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
