import { SIDE_MENU_DATA } from '../../utils/data'
import { UserContext } from '../../context/userContext'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import CharAvatar from '../cards/CharAvatar'

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleClick = (route) => {
    if (route === 'logout') {
      localStorage.clear()
      clearUser()
      navigate('/login')
      return
    }
    navigate(route)
  }

  return (
    <div className="h-full flex flex-col justify-between py-6">
      {/* Profile Section */}
      <div className="flex flex-col items-center justify-center mb-10">
        {user?.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="Profile"
            className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border-2 border-green-500 shadow-md"
          />
        ) : (
          <CharAvatar
            fullName={user?.fullName}
            width="w-20 lg:w-24"
            height="h-20 lg:h-24"
            style="text-xl"
          />
        )}
        <h5 className="mt-3 text-lg font-semibold text-light-100 text-center">
          {user?.fullName || ''}
        </h5>
      </div>

      {/* Menu Items */}
      <div className="flex-1 px-3 overflow-y-auto">
        {SIDE_MENU_DATA.map((item, index) => (
          <button
            key={`menu_${index}`}
            onClick={() => handleClick(item.link)}
            className={`w-full flex items-center gap-3 text-sm py-3 px-4 rounded-xl mb-2 transition-all duration-200 ${
              activeMenu === item.label
                ? 'bg-green-500 text-white shadow-green-500/40 shadow-md'
                : 'text-light-200 hover:bg-green-500/10 hover:text-green-400'
            }`}
          >
            <item.icon className="text-lg" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="px-4 pb-6">
        <button
          onClick={() => handleClick('logout')}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm 
                     text-red-400 bg-dark-500 hover:bg-red-500/30 border border-dark-500 
                     transition-all duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default SideMenu
