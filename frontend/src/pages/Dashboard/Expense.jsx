import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import TranscationInfoCard from "../../components/cards/TranscationInfoCard";
import {
  LuCirclePlus,
  LuDownload,
  LuCalendar,
  LuChartBar,
} from "react-icons/lu";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useUserAuth from "../../hooks/useUserAuth";
import ExpenseMonthlyChart from "../../components/charts/ExpenseMonthlyChart";
import ExpenseCategoryPieChart from "../../components/charts/ExpenseCategoryPieChart.jsx";

const fadeUp = { hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } };

const Expense = () => {
  useUserAuth();

  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    icon: "",
    category: "",
    amount: "",
    date: null,
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Analytics states
  const [summary, setSummary] = useState(null);
  const [topCategories, setTopCategories] = useState([]);
  const [growth, setGrowth] = useState(null);
  const [budgetStatus, setBudgetStatus] = useState(null);
  const [ratio, setRatio] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Fetch all expenses
  const fetchExpenses = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
      setExpenses(response.data.expenses || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  // Fetch analytics
  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const [
        summaryRes,
        topRes,
        growthRes,
        budgetRes,
        ratioRes,
      ] = await Promise.all([
        axiosInstance.get(API_PATHS.EXPENSE.GET_SUMMARY),
        axiosInstance.get(API_PATHS.EXPENSE.GET_TOP_CATEGORIES),
        axiosInstance.get(API_PATHS.EXPENSE.GET_GROWTH),
        axiosInstance.get(API_PATHS.EXPENSE.GET_BUDGET_STATUS),
        axiosInstance.get(API_PATHS.EXPENSE.GET_EXPENSE_INCOME_RATIO),
      ]);

      setSummary(summaryRes.data || null);
      setTopCategories(topRes.data?.topCategories || []);
      setGrowth(growthRes.data || null);
      setBudgetStatus(budgetRes.data || null);
      setRatio(ratioRes.data || null);
    } catch (error) {
      console.error("Error fetching expense analytics:", error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add Expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    const { icon, category, amount, date } = formData;

    if (!category || !amount || !date) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        icon: icon || "",
        category: category.trim(),
        amount: parseFloat(amount),
        date: new Date(date).toISOString(),
      });

      setFormData({ icon: "", category: "", amount: "", date: null });
      setShowForm(false);

      await fetchExpenses();
      if (showAnalytics) await fetchAnalytics();
    } catch (error) {
      console.error("Error adding expense:", error);
      if (error.response?.data?.message) alert(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete Expense
  const handleDeleteExpense = async (id) => {
    if (!confirm("Delete this expense record?")) return;
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      await fetchExpenses();
      if (showAnalytics) await fetchAnalytics();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  // Download Excel
  const handleDownloadExcel = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE_EXCEL, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expenses.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading Excel:", error);
    }
  };

  // Toggle Analytics
  const toggleAnalytics = async () => {
    const willShow = !showAnalytics;
    setShowAnalytics(willShow);
    if (willShow) await fetchAnalytics();
  };

  const fmt = (v) => `₹${(v || 0).toLocaleString()}`;

  return (
    <DashboardLayout activeMenu="Expense">
      <div
        className="relative flex flex-col min-h-screen bg-gradient-to-b 
                   from-dark-300/80 via-dark-400/80 to-dark-600/90 
                   backdrop-blur-md p-4 sm:p-6 md:p-8 lg:p-10 
                   transition-all duration-500 ease-in-out md:ml-0"
      >
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.35 }}
          className="flex flex-wrap items-center justify-between gap-3 mb-6"
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 via-pink-400 to-orange-400 bg-clip-text text-transparent drop-shadow-md">
            Expense Records
          </h2>

          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowForm((s) => !s)}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg 
                         bg-gradient-to-r from-pink-500/20 to-orange-500/20 
                         border border-pink-600/30 text-pink-200 font-medium 
                         hover:scale-105 hover:border-pink-400 transition-all duration-200"
            >
              <LuCirclePlus /> {showForm ? "Cancel" : "Add Expense"}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={toggleAnalytics}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg 
                         bg-gradient-to-r from-indigo-500/20 to-purple-500/20 
                         border border-purple-600/30 text-purple-200 font-medium 
                         hover:scale-105 hover:border-purple-400 transition-all duration-200"
            >
              <LuChartBar /> {showAnalytics ? "Hide Analytics" : "View Analytics"}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleDownloadExcel}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg 
                         bg-gradient-to-r from-cyan-600/20 to-blue-600/20 
                         border border-blue-600/30 text-blue-200 font-medium 
                         hover:scale-105 hover:border-blue-400 transition-all duration-200"
            >
              <LuDownload /> Download Excel
            </motion.button>
          </div>
        </motion.div>

        {/* Analytics Summary Cards */}
        <AnimatePresence>
          {summary && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3 }}
              className="flex flex-wrap gap-4 mb-6"
            >
              <div className="p-4 bg-dark-500/40 border border-pink-700/30 rounded-lg shadow-md shadow-pink-800/10 min-w-[180px]">
                <p className="text-gray-400 text-sm">Total Expense</p>
                <h3 className="text-xl font-semibold text-pink-300">
                  {fmt(summary.totalExpense)}
                </h3>
              </div>

              <div className="p-4 bg-dark-500/40 border border-pink-700/30 rounded-lg shadow-md shadow-pink-800/10 min-w-[160px]">
                <p className="text-gray-400 text-sm">Growth</p>
                <h3
                  className={`text-xl font-semibold ${
                    parseFloat(growth?.growth) >= 0 ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {growth?.growth ?? "0"}%
                </h3>
              </div>

              <div className="p-4 bg-dark-500/40 border border-pink-700/30 rounded-lg shadow-md shadow-pink-800/10 min-w-[200px]">
                <p className="text-gray-400 text-sm">Top Category</p>
                <h3 className="text-xl font-semibold text-pink-300">
                  {topCategories[0]?.category || "N/A"}
                </h3>
                <p className="text-gray-400 text-sm">{fmt(topCategories[0]?.total)}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Expense Form */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              onSubmit={handleAddExpense}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl 
                         bg-dark-500/40 border border-pink-800/30 
                         shadow-md shadow-pink-800/10 mb-6"
            >
              <div className="flex flex-col">
                <label className="text-sm text-gray-400 mb-1">Icon (optional)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="bg-dark-400/40 border border-pink-700/30 rounded-lg px-3 py-2 text-light-100 placeholder-gray-500 focus:outline-none focus:border-pink-400 transition-all"
                  placeholder="🛍️ / 🍔 / 🧾 etc."
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-400 mb-1">Category *</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="bg-dark-400/40 border border-pink-700/30 rounded-lg px-3 py-2 text-light-100 placeholder-gray-500 focus:outline-none focus:border-pink-400 transition-all"
                  placeholder="Food, Rent, Travel..."
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-400 mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="bg-dark-400/40 border border-pink-700/30 rounded-lg px-3 py-2 text-light-100 placeholder-gray-500 focus:outline-none focus:border-pink-400 transition-all"
                  placeholder="e.g. 1500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-400 mb-1">Date *</label>
                <div className="relative flex items-center">
                  <LuCalendar className="absolute left-3 text-pink-400" size={16} />
                  <DatePicker
                    selected={formData.date}
                    onChange={(date) => setFormData({ ...formData, date })}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select date"
                    className="w-full bg-dark-400/40 border border-pink-700/30 rounded-lg px-10 py-2 text-light-100 placeholder-gray-500 focus:outline-none focus:border-pink-400 transition-all cursor-pointer"
                  />
                </div>
              </div>

              <div className="md:col-span-4 flex justify-end mt-3">
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.99 }}
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold hover:opacity-90 shadow-md shadow-pink-500/20 transition-all disabled:opacity-60"
                >
                  {loading ? "Adding..." : "Add Expense"}
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Analytics (charts) */}
        <AnimatePresence>
          {showAnalytics && summary && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
            >
              <ExpenseMonthlyChart data={summary} />
              <ExpenseCategoryPieChart data={topCategories} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expense list */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-10">
          {expenses.length > 0 ? (
            expenses.map((exp) => (
              <motion.div key={exp._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
                <TranscationInfoCard
                  icon={exp.icon}
                  title={exp.category}
                  date={new Date(exp.date).toLocaleDateString()}
                  amount={exp.amount}
                  type="expense"
                  onDelete={() => handleDeleteExpense(exp._id)}
                />
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No expense records found.</p>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
