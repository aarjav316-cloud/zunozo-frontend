import axiosInstance from "./axios";

// ==========================================
// PUBLIC EVENT APIs
// ==========================================

export const getApprovedEvents = async () => {
  try {
    const response = await axiosInstance.get("/events");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};

export const getEventBySlug = async (slug) => {
  try {
    const response = await axiosInstance.get(`/events/${slug}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};

// ==========================================
// ORGANIZER EVENT APIs
// ==========================================

export const createEvent = async (data) => {
  try {
    const response = await axiosInstance.post("/events", data);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};

export const getMyEvents = async () => {
  try {
    const response = await axiosInstance.get("/events/my-events");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};

export const getEventById = async (eventId) => {
  try {
    const response = await axiosInstance.get(`/events/my-events/${eventId}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};

export const updateEvent = async (eventId, data) => {
  try {
    const response = await axiosInstance.patch(`/events/${eventId}`, data);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const response = await axiosInstance.delete(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};

// ==========================================
// ADMIN EVENT APIs
// ==========================================

export const getPendingEvents = async () => {
  try {
    const response = await axiosInstance.get("/events/admin/pending");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};

export const reviewEvent = async (eventId, data) => {
  try {
    const response = await axiosInstance.patch(
      `/events/admin/${eventId}/review`,
      data,
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};
