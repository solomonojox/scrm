// src/Services/Auth/onboarding.js
import api from "./api";

export const messageService = {
  getMessageByUserId: async (userId, role) => {
    try {
      const res = await api.get(`/api/Message/inbox/${userId}/${role}`);
      // console.log("GetAllTeachers success:", res.data.data);
      return res.data.data;
    } catch (error) {
      console.error("GetAllTeachers error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const res = await api.post("/api/Message/SendMessage", data);
      //   console.log("Message success:", res.data);
      return res.data;
    } catch (error) {
      console.error("Message error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  getMessagesByContactIds: async (userId, role, contactIds) => { 
  try { 
    const requests = contactIds.map(contactId => 
      api.get(`/api/Message/inbox/${userId}/${role}`)
    ); 
    const responses = await Promise.all(requests); 
 
    const allMessages = responses.flatMap(res => res.data.data || []); 
    console.log("Messages from all contacts:", allMessages); 
 
    return allMessages; 
  } catch (error) { 
    console.error("getMessagesByContactIds error:", error?.response?.data?.message || error.message); 
    throw error; 
  }
},

  //   getById: async (id) => {
  //     try {
  //       const res = await api.get(`/api/Teacher/GetTeacherById/${id}`);
  //       console.log("success:", res.data);
  //       return res.data;
  //     } catch (error) {
  //       console.error("DeleteTeacher error:", error?.response?.data?.message || error.message);
  //       throw error;
  //     }
  //   },
  //   delete: async (id) => {
  //     try {
  //       const res = await api.delete(`/api/Teacher/${id}`);
  //       console.log("DeleteTeacher success:", res.data);
  //       return res.data;
  //     } catch (error) {
  //       console.error("DeleteTeacher error:", error?.response?.data?.message || error.message);
  //       throw error;
  //     }
  //   },
};
