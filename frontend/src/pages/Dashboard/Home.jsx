import DashboardLayout from '../../components/layouts/DashboardLayout'
import UseUserAuth from '../../hooks/useUserAuth'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'
import InfoCard from '../../components/cards/InfoCard'
import { IoMdCard } from 'react-icons/io'
import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu'
import { addThousandsSeperator } from '../../utils/helper'
import RecentTranscations from '../../components/dashboard/RecentTranscations'
import FincaceOverview from '../../components/dashboard/FincaceOverview'
import IncomeTranscations from '../../components/dashboard/IncomeTranscations'
import Summary from '../../components/dashboard/Summary'

const Home = () => {
  UseUserAuth()
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchDashboardData = async () => {
    if (loading) return
    setLoading(true)
    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.STATS)
      if (response.data) setDashboardData(response.data)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-dark-300/80 via-dark-400/80 to-dark-600/90 backdrop-blur-md 
                      p-4 sm:p-6 md:p-8 lg:p-10 transition-all duration-500 ease-in-out md:ml-0 scroll-hidden">

        {/* Background Layer with Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] 
                        bg-[size:40px_40px] pointer-events-none rounded-2xl"></div>

        {/* Header */}
        <div className="relative z-10 mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-green-400 mb-2 tracking-wide">
            Dashboard Overview
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Monitor your balance, income, and expenses all in one place.
          </p>
        </div>

        {/* Info Cards Section */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 transition-all duration-300">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={addThousandsSeperator(dashboardData?.totalBalance || 0)}
            color="bg-gradient-to-br from-green-500 to-emerald-600"
          />
          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={addThousandsSeperator(dashboardData?.totalIncome || 0)}
            color="bg-gradient-to-br from-blue-500 to-cyan-600"
          />
          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expense"
            value={addThousandsSeperator(dashboardData?.totalExpense || 0)}
            color="bg-gradient-to-br from-purple-500 to-indigo-600"
          />
        </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="col-span-1 flex flex-col">
              <RecentTranscations 
                transactions={dashboardData?.lastTransaction || []}
                onSeeMore={() => navigate('/expense')}
              />
            </div>
            {/* Financial Overview should take two columns on large screens */}
            <div className="col-span-1 md:col-span-2 flex flex-col">
              <Summary
              totalSavingsRate={dashboardData?.totalSavingsRate}
              totalExpenseLast30Days={dashboardData?.totalExpenseLast30Days}
              dailyExpenseAvg={dashboardData?.dailyExpenseAvg}
              monthlyIncomeTrend={dashboardData?.monthlyIncomeTrend}
              monthlyExpenseTrend={dashboardData?.monthlyExpenseTrend}
            />
              
            </div>
            <div className=''>
              <IncomeTranscations 
                transactions={dashboardData?.last60DaysIncomeTransactions || []}
                onSeeMore={() => navigate('/income')}
              />
            </div>
            <div className="col-span-1 md:col-span-2 flex flex-col">
            <FincaceOverview 
                totalIncome={dashboardData?.totalIncome || 0}
                totalExpense={dashboardData?.totalExpense || 0}
                totalBalance={dashboardData?.totalBalance || 0}
              />
        </div>
          </div>

        {/* Decorative Gradient Lines */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-500/30 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-500/30 to-transparent"></div>
      </div>
    </DashboardLayout>
  )
}

export default Home
