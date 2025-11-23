const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { isValidObjectId, Types } = require("mongoose");

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const userObjectId = new Types.ObjectId(userId);

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }


    const totalIncome = await Income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    const totalExpense = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    const totalIncomeAmount = totalIncome[0]?.totalAmount || 0;
    const totalExpenseAmount = totalExpense[0]?.totalAmount || 0;
    const totalBalance = totalIncomeAmount - totalExpenseAmount;

   
    const expenseByCategory = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } },
      { $sort: { totalAmount: -1 } },
    ]);

    const incomeBySource = await Income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: "$source", totalAmount: { $sum: "$amount" } } },
      { $sort: { totalAmount: -1 } },
    ]);

    
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyIncomeTrend = await Income.aggregate([
      { $match: { userId: userObjectId, date: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: "$date" }, year: { $year: "$date" } },
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthlyExpenseTrend = await Expense.aggregate([
      { $match: { userId: userObjectId, date: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: "$date" }, year: { $year: "$date" } },
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const last60DaysIncomeTransactions = await Income.find({
      userId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    const expense30DaysTransactions = await Expense.find({
      userId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    const totalExpenseLast30Days = expense30DaysTransactions.reduce(
      (acc, expense) => acc + expense.amount,
      0
    );


    const lastTransaction = [
      ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map((t) => ({
        ...t.toObject(),
        type: "income",
      })),
      ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map((t) => ({
        ...t.toObject(),
        type: "expense",
      })),
    ]
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);

   
    const totalSavingsRate =
      totalIncomeAmount > 0 ? ((totalBalance / totalIncomeAmount) * 100).toFixed(2) : 0;

    const topExpenseCategories = expenseByCategory.slice(0, 5);

    const dailyExpenseAvg =
      expense30DaysTransactions.length > 0
        ? (totalExpenseLast30Days / 30).toFixed(2)
        : 0;

  
    res.json({
      success: true,
      totalBalance,
      totalIncome: totalIncomeAmount,
      totalExpense: totalExpenseAmount,
      totalSavingsRate,
      totalExpenseLast30Days,
      dailyExpenseAvg,
      lastTransaction,
      last60DaysIncomeTransactions,
      expense30DaysTransactions,
      expenseByCategory,
      incomeBySource,
      monthlyIncomeTrend,
      monthlyExpenseTrend,
      topExpenseCategories,
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
