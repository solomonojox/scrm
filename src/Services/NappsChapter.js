import api from "./api";

export const nappsChapterService = {
    getAllNappsChapters: async () => {
      try {
        const response = await api.get(`/api/NappsChapter/GetAllNappsChapters`);
        return response.data.data; // ✅ get the array inside `data`
      } catch (error) {
        throw error;
      }
    },

    getNappsChapterById: async (id) => {
      try {
        const response = await api.get(`/api/NappsChapter/GetNappsChapterById?id=${id}`);
        return response.data; // ✅ get the array inside `data`
      } catch (error) {
        throw error;
      }
    },
};
