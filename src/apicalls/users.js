const { axiosInstance } = require(".");

// Register a new user
export const RegisterUser = async (payload) => {
    try {
        const response = await axiosInstance.post("https://guvi-hackathon2.onrender.com/api/users/register", payload);
        return response.data;
    } catch (error) {
        return error.response;
    }
};

// Login a user
export const LoginUser = async (payload) => {
    try {
        const response = await axiosInstance.post("https://guvi-hackathon2.onrender.com/api/users/login", payload);
        return response.data;
    } catch (error) {
        return error.response;
    }
}

// Get current user
export const GetCurrentUser = async () => {
    try {
        const response = await axiosInstance.get("https://guvi-hackathon2.onrender.com/api/users/get-current-user");
        return response.data;
    } catch (error) {
        return error;
    }
}