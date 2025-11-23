const User = require("../models/User");
const xlsx = require("xlsx");
const Income = require("../models/Income");


exports.addIncome = async (req, res) => {
  const userId = req.user.id;
  try {
    const { icon, source, amount, date, category } = req.body;

    if (!source || !amount || !date || !category) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date),
      category,
    });

    await newIncome.save();
    res
      .status(201)
      .json({ message: "Income added successfully", income: newIncome });
  } catch (error) {
    console.error("Error adding income:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.getAllIncome = async (req, res) => {
  const userId = req.user.id;
  try {
    const incomes = await Income.find({ userId }).sort({ date: -1 });
    res.status(200).json({ incomes });
  } catch (error) {
    console.error("Error fetching incomes:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.deleteIncome = async (req, res) => {
  const userId = req.user.id;
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    console.error("Error deleting income:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.downloadIncomeExel = async (req, res) => {
  const userId = req.user.id;
  try {
    const incomes = await Income.find({ userId }).sort({ date: -1 });

    const data = incomes.map((income) => ({
      Source: income.source,
      Amount: income.amount,
      Category: income.category || "N/A",
      Date: income.date.toISOString().split("T")[0],
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Incomes");

    const filePath = "incomes.xlsx";
    xlsx.writeFile(wb, filePath);
    res.download(filePath);
  } catch (error) {
    console.error("Error downloading income excel:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.getIncomeSummary = async (req, res) => {
  const userId = req.user.id;
  try {
    const incomes = await Income.find({ userId });

    const monthlySummary = {};
    incomes.forEach((income) => {
      const monthYear = new Date(income.date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      if (!monthlySummary[monthYear]) monthlySummary[monthYear] = 0;
      monthlySummary[monthYear] += income.amount;
    });

    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);

    res.status(200).json({
      totalIncome,
      monthlySummary,
      months: Object.keys(monthlySummary),
      values: Object.values(monthlySummary),
    });
  } catch (error) {
    console.error("Error generating summary:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.filterIncome = async (req, res) => {
  const userId = req.user.id;
  const { startDate, endDate, category, search } = req.query;

  try {
    const query = { userId };

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    if (category) query.category = category;
    if (search) query.source = { $regex: search, $options: "i" };

    const incomes = await Income.find(query).sort({ date: -1 });

    res.status(200).json({ count: incomes.length, incomes });
  } catch (error) {
    console.error("Error filtering incomes:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.getTopIncomeSources = async (req, res) => {
  const userId = req.user.id;
  try {
    const incomes = await Income.find({ userId });
    const sourceMap = {};

    incomes.forEach((i) => {
      if (!sourceMap[i.source]) sourceMap[i.source] = 0;
      sourceMap[i.source] += i.amount;
    });

    const topSources = Object.entries(sourceMap)
      .map(([source, total]) => ({ source, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);

    res.status(200).json({ topSources });
  } catch (error) {
    console.error("Error fetching top sources:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getIncomeGrowth = async (req, res) => {
  const userId = req.user.id;
  try {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthIncome = await Income.aggregate([
      {
        $match: {
          userId,
          date: {
            $gte: new Date(currentYear, currentMonth, 1),
            $lte: new Date(currentYear, currentMonth + 1, 0),
          },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const previousMonthIncome = await Income.aggregate([
      {
        $match: {
          userId,
          date: {
            $gte: new Date(lastMonthYear, lastMonth, 1),
            $lte: new Date(lastMonthYear, lastMonth + 1, 0),
          },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const current = currentMonthIncome[0]?.total || 0;
    const previous = previousMonthIncome[0]?.total || 0;

    const growth = previous === 0 ? 100 : ((current - previous) / previous) * 100;

    res.status(200).json({
      currentMonthIncome: current,
      previousMonthIncome: previous,
      growth: growth.toFixed(2),
    });
  } catch (error) {
    console.error("Error calculating growth:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
