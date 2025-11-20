export const BASE_URL='http://localhost:8000';

export const API_PATHS={
    AUTH:{
        LOGIN:`/api/v1/auth/login`,
        REGISTER:`/api/v1/auth/register`,
        GET_USER_INFO:`/api/v1/auth/user`,
        VERIFY: `/api/v1/auth/verify-otp`,
        SEND_OTP: `/api/v1/auth/send-otp`
    },
    DASHBOARD:{
        STATS:`/api/v1/dashboard`
    },
    INCOME: {
        ADD_INCOME: `/api/v1/income/add-income`,
        GET_ALL_INCOME: `/api/v1/income/get-income`,
        DELETE_INCOME: (incomeId) => `/api/v1/income/delete-income/${incomeId}`,
        DOWNLOAD_INCOME_EXCEL: `/api/v1/income/download-income-excel`,
        SUMMARY: `/api/v1/income/summary`,
        FILTER: `/api/v1/income/filter`,
        TOP_SOURCES: `/api/v1/income/top-sources`,
        GROWTH: `/api/v1/income/growth`,
    },

    EXPENSE: {
    ADD_EXPENSE: `/api/v1/expense/add-expense`,
    GET_ALL_EXPENSE: `/api/v1/expense/get-expense`,
    DELETE_EXPENSE: (expenseId) => `/api/v1/expense/delete-expense/${expenseId}`,
    DOWNLOAD_EXPENSE_EXCEL: `/api/v1/expense/download-expense-excel`,

    // 📊 Advanced Analytics Routes
    GET_SUMMARY: `/api/v1/expense/summary`,                   // Monthly expense chart
    GET_TOP_CATEGORIES: `/api/v1/expense/top-categories`,     // Top spending categories
    GET_GROWTH: `/api/v1/expense/growth`,                     // Month-over-month growth
    FILTER_BY_DATE: (startDate, endDate) => 
        `/api/v1/expense/filter?startDate=${startDate}&endDate=${endDate}`,
    GET_BUDGET_STATUS: `/api/v1/expense/budget-status`,       // Monthly budget overview
    GET_EXPENSE_INCOME_RATIO: `/api/v1/expense/expense-income-ratio`, // Savings & ratio
},

    IMAGE:{
        UPLOAD_IMAGE:`/api/v1/auth/upload-image`
    },
}