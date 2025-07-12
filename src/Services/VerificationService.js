import api from "./api";
// const token = localStorage.getItem('mevUserToken');

export const VerificationService = {
    sendToken: async (emailAddress, title) => {
        try {
            const res = await api.post(`/api/Token/SendToken`, {
                emailAddress, title
            })
            return res.data
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    },
    verifyUser: async (enteredCode, email) => {
        try {
            const res = await api.get(`/api/Token/VerifyToken?tk=${enteredCode}&reference=${email}`)
            return res.data
        } catch (error) {
            console.log(error.response);

            if (error.response.data.data.title === 'Client Error') {
                throw new Error(error?.response?.data?.responseMessage);
            } else {
                throw new Error('Something went wrong, pls try again');
            }
        }
    }
}