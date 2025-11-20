// src/pages/income/Income.jsx
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
import IncomeMonthlyChart from "../../components/charts/IncomeMonthlyChart";
import IncomeSourcePieChart from "../../components/charts/IncomeSourcePieChart";

const fadeUp = { hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } };

const Income = () => {
   useUserAuth();
  const [incomes, setIncomes] = useState([]);
  const [formData, setFormData] = useState({
    icon: "",
    source: "",
    amount: "",
    date: null,
    category: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Analytics states
  const [summary, setSummary] = useState(null);
  const [topSources, setTopSources] = useState([]);
  const [growth, setGrowth] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Fetch all incomes
  const fetchIncomes = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);
      setIncomes(response.data.incomes || []);
    } catch (error) {
      console.error("Error fetching incomes:", error);
    }
  };

  // Fetch analytics (summary, top sources, growth)
  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const [summaryRes, sourcesRes, growthRes] = await Promise.all([
        axiosInstance.get(API_PATHS.INCOME.SUMMARY),
        axiosInstance.get(API_PATHS.INCOME.TOP_SOURCES),
        axiosInstance.get(API_PATHS.INCOME.GROWTH),
      ]);
      setSummary(summaryRes.data || null);
      setTopSources(sourcesRes.data?.topSources || []);
      setGrowth(growthRes.data || null);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
    // optionally prefetch analytics lightly:
    // fetchAnalytics();
  }, []);

  // Add income
  const handleAddIncome = async (e) => {
    e.preventDefault();
    const { icon, source, amount, date, category } = formData;

    if (!source || !amount || !date || !category) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        icon: icon || "",
        source: source.trim(),
        amount: parseFloat(amount),
        date: new Date(date).toISOString(),
        category: category.trim(),
      });

      // reset
      setFormData({ icon: "", source: "", amount: "", date: null, category: "" });
      setShowForm(false);

      // refresh
      await fetchIncomes();
      if (showAnalytics) await fetchAnalytics();
    } catch (error) {
      console.error("Error adding income:", error);
      // show a nicer user message if backend responded with validation error
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete income
  const handleDeleteIncome = async (id) => {
    if (!confirm("Delete this income record?")) return;
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      await fetchIncomes();
      if (showAnalytics) await fetchAnalytics();
    } catch (error) {
      console.error("Error deleting income:", error);
    }
  };

  // Download Excel
  const handleDownloadExcel = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME_EXCEL, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "incomes.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading Excel:", error);
    }
  };

  // Filter incomes by date range (uses backend FILTER endpoint)
  const handleFilterByDate = async (start, end) => {
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.FILTER, {
        params: {
          startDate: new Date(start).toISOString(),
          endDate: new Date(end).toISOString(),
        },
      });
      setIncomes(response.data.incomes || []);
    } catch (error) {
      console.error("Error filtering incomes:", error);
    }
  };

  // toggle analytics: fetch when opening
  const toggleAnalytics = async () => {
    const willShow = !showAnalytics;
    setShowAnalytics(willShow);
    if (willShow) await fetchAnalytics();
  };

  // small helper to format currency
  const fmt = (v) => `₹${(v || 0).toLocaleString()}`;

  return (
    <DashboardLayout activeMenu="Income">
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
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent drop-shadow-md">
            Income Records
          </h2>

          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowForm((s) => !s)}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg 
                         bg-gradient-to-r from-green-500/20 to-cyan-500/20 
                         border border-cyan-600/30 text-cyan-200 font-medium 
                         hover:scale-105 hover:border-cyan-400 transition-all duration-200"
            >
              <LuCirclePlus /> {showForm ? "Cancel" : "Add Income"}
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

        {/* Analytics summary small cards */}
        <AnimatePresence>
          {summary && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3 }}
              className="flex flex-wrap gap-4 mb-6"
            >
              <div className="p-4 bg-dark-500/40 border border-cyan-700/30 rounded-lg shadow-md shadow-cyan-800/10 min-w-[180px]">
                <p className="text-gray-400 text-sm">Total Income</p>
                <h3 className="text-xl font-semibold text-cyan-300">
                  {fmt(summary.totalIncome)}
                </h3>
              </div>

              <div className="p-4 bg-dark-500/40 border border-cyan-700/30 rounded-lg shadow-md shadow-cyan-800/10 min-w-[160px]">
                <p className="text-gray-400 text-sm">Growth</p>
                <h3
                  className={`text-xl font-semibold ${
                    parseFloat(growth?.growth) >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {growth?.growth ?? "0"}%
                </h3>
              </div>

              <div className="p-4 bg-dark-500/40 border border-cyan-700/30 rounded-lg shadow-md shadow-cyan-800/10 min-w-[200px]">
                <p className="text-gray-400 text-sm">Top Source</p>
                <h3 className="text-xl font-semibold text-cyan-300">
                  {topSources[0]?.source || "N/A"}
                </h3>
                <p className="text-gray-400 text-sm">{fmt(topSources[0]?.total)}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Income Form */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              onSubmit={handleAddIncome}
              className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 rounded-xl 
                         bg-dark-500/40 border border-cyan-800/30 
                         shadow-md shadow-cyan-800/10 mb-6"
            >
              {/* Icon (optional) */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-400 mb-1">Icon (optional)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="bg-dark-400/40 border border-cyan-700/30 rounded-lg px-3 py-2 text-light-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-all"
                  placeholder="💼 / 💰 / 🧾 etc."
                />
              </div>

              {/* Source */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-400 mb-1">Source *</label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="bg-dark-400/40 border border-cyan-700/30 rounded-lg px-3 py-2 text-light-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-all"
                  placeholder="Salary, Freelance, etc."
                />
              </div>

              {/* Amount */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-400 mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="bg-dark-400/40 border border-cyan-700/30 rounded-lg px-3 py-2 text-light-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-all"
                  placeholder="e.g. 50000"
                />
              </div>

              {/* Date */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-400 mb-1">Date *</label>
                <div className="relative flex items-center">
                  <LuCalendar className="absolute left-3 text-cyan-400" size={16} />
                  <DatePicker
                    selected={formData.date}
                    onChange={(date) => setFormData({ ...formData, date })}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select date"
                    className="w-full bg-dark-400/40 border border-cyan-700/30 rounded-lg px-10 py-2 text-light-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-all cursor-pointer"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-400 mb-1">Category *</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="bg-dark-400/40 border border-cyan-700/30 rounded-lg px-3 py-2 text-light-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-all"
                  placeholder="Job, Bonus, Gift, etc."
                />
              </div>

              <div className="md:col-span-5 flex justify-end mt-3">
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.99 }}
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:opacity-90 shadow-md shadow-cyan-500/20 transition-all disabled:opacity-60"
                >
                  {loading ? "Adding..." : "Add Income"}
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Analytics Section (charts) */}
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
              <IncomeMonthlyChart
                data={{
                  months: summary.months,
                  values: summary.values,
                  // if your IncomeMonthlyChart expects the flat object we used earlier, it will still work
                }}
              />
              <IncomeSourcePieChart data={topSources} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Income list */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-10">
          {incomes.length > 0 ? (
            incomes.map((income) => (
              <motion.div key={income._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
                <TranscationInfoCard
                  icon={income.icon}
                  title={income.source}
                  date={new Date(income.date).toLocaleDateString()}
                  amount={income.amount}
                  type="income"
                  onDelete={() => handleDeleteIncome(income._id)}
                />
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No income records found.</p>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Income;
