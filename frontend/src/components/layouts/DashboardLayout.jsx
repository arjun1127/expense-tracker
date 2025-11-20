import { UserContext } from '../../context/userContext'
import { useContext } from 'react'
import Navbar from './Navbar'
import SideMenu from './SideMenu'

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext)

  return (
    <div className="min-h-screen w-full bg-dark-300 text-light-200 flex flex-col overflow-hidden">
      {/* Top Navbar */}
      <Navbar activeMenu={activeMenu} />

      {/* Sidebar + Main */}
      {user && (
        <div className="flex flex-grow overflow-hidden">
          {/* Sidebar */}
          <aside
            className="hidden md:flex flex-col w-64 lg:w-80 xl:w-96 
                      border-r border-dark-500 bg-gradient-to-b from-dark-500/90 to-dark-700/90
                      backdrop-blur-md shadow-xl transition-all duration-300"
          >
            <SideMenu activeMenu={activeMenu} />
          </aside>

          {/* Main Content */}
          <main
            className="flex-grow p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 
                       overflow-y-auto bg-gradient-to-br from-dark-300 via-dark-400 to-dark-500
                       transition-all duration-300 scroll-hidden"
          >
            <div
              className="bg-dark-400/80 rounded-2xl shadow-lg border border-dark-500 
                         p-5 sm:p-6 md:p-8 lg:p-10 backdrop-blur-sm
                         transition-all duration-300"
            >
              {children}
            </div>
          </main>
        </div>
      )}
    </div>
  )
}

export default DashboardLayout
