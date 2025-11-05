import api from "./api";

export const superAdminService = {
    adminLogin: async (username, password) => {
        try {
            const res = await api.post("/api/Admin/AdminLogin", { username, password });
            return res.data;
        } catch (error) {
            console.log(error.response);
            if (error.response.data.data.title === "Client Error") {
                throw new Error(error?.response?.data?.responseMessage);
            } else {
                throw new Error("Something went wrong, pls try again");
            }
        }
    },
}