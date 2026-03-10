import api from "./api";

export const nappsChapterService = {
    getAllNappsChapters: async () => {
      try {
        const response = await api.get(`/api/NappsChapter/GetAllNappsChapters`);
        return response.data.data; // ✅ get the array inside `data`
      } catch (error) {
        console.error("GetAllNappsChapters error:", error);
        throw new Error(error?.response?.data?.responseMessage || "Failed to fetch Napps Chapters");
      }
    },

    getNappsChapterById: async (id) => {
      try {
        const response = await api.get(`/api/NappsChapter/GetNappsChapterById?id=${id}`);
        return response.data; // ✅ get the array inside `data`
      } catch (error) {
        console.error("GetNappsChapterById error:", error);
        throw new Error(error?.response?.data?.responseMessage || "Failed to fetch Napps Chapter");
      }
    },
};
