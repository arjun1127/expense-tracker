import {
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletMinimal,
    LuLogOut,

}from "react-icons/lu";

export const SIDE_MENU_DATA=[
    {
        id:"1",
        label:"Dashboard",
        icon:LuLayoutDashboard,
        link:"/dashboard"
    },
    {
        id:"2",
        label:"Income",
        icon:LuWalletMinimal,
        link:"/income"
    },
    {
        id:"3",
        label:"Expense",
        icon:LuHandCoins,
        link:"/expense"
    },
    // {
    //     id:"4",
    //     label:"Logut",
    //     icon:LuLogOut,
    //     link:"/logout"
    // },
]   
