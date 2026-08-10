import axiosInstance from "./axios";

export const getAdminDashboardStats = async () => {
  try {
    const response = await axiosInstance.get("/admin/dashboard-stats");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch admin stats",
      }
    );
  }
};

export const getOrganizersList = async () => {
  try {
    const response = await axiosInstance.get("/admin/organizers");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch organizers",
      }
    );
  }
};

export const getOrganizerDetails = async (organizerId) => {
  try {
    const response = await axiosInstance.get(`/admin/organizers/${organizerId}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch organizer details",
      }
    );
  }
};
