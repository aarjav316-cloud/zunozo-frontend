import axiosInstance from "./axios";

// Get authenticated organizer profile
export const getOrganizerProfile = async () => {
  try {
    const response = await axiosInstance.get("/organizers/me");
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

// Update authenticated organizer profile
export const updateOrganizerProfile = async (data) => {
  try {
    const response = await axiosInstance.patch("/organizers/me", data);
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

// Become an organizer
export const becomeOrganizer = async (data) => {
  try {
    const response = await axiosInstance.post("/organizers", data);
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
