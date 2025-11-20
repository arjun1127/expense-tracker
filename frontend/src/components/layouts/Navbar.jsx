import React, { useState, useEffect } from 'react'
import SideMenu from './SideMenu'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi'

const Navbar = ({ activeMenu }) => {
  const [openSidebar, setOpenSidebar] = useState(false)

  useEffect(() => {
    document.body.style.overflow = openSidebar ? 'hidden' : 'auto'
  }, [openSidebar])

  return (
    <>
      <nav
        className="flex items-center justify-between bg-gradient-to-r from-dark-400/90 via-dark-500/90 to-dark-600/90 
                   border-b border-dark-500 backdrop-blur-md py-4 px-6 md:px-10 
                   sticky top-0 z-40 shadow-lg transition-all duration-300"
      >
        <h2 className="text-lg md:text-2xl font-bold text-green-400 tracking-wide drop-shadow-sm">
          Expense<span className="text-green-500">Tracker</span>
        </h2>

        {/* Mobile Menu Toggle */}
        <button
          className="block md:hidden text-light-200 hover:text-green-400 transition-colors duration-300"
          onClick={() => setOpenSidebar(!openSidebar)}
        >
          {openSidebar ? (
            <HiOutlineX className="text-2xl" />
          ) : (
            <HiOutlineMenu className="text-2xl" />
          )}
        </button>
      </nav>

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-dark-500/95 backdrop-blur-md 
                    border-r border-dark-600 shadow-2xl transform transition-transform 
                    duration-300 ease-in-out z-50 ${
                      openSidebar ? 'translate-x-0' : '-translate-x-full'
                    }`}
      >
        <SideMenu activeMenu={activeMenu} />
      </div>

      {/* Dim Background */}
      {openSidebar && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-[1px] z-40 animate-fadeIn"
          onClick={() => setOpenSidebar(false)}
        ></div>
      )}
    </>
  )
}

export default Navbar
