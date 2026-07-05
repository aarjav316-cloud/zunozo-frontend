import axiosInstance from "./axios";

export const updateProfile = async (data) => {
  try {
    const response = await axiosInstance.patch("/auth/profile", data);
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

export const changePassword = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/change-password", data);
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
