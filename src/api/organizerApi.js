import axiosInstance from "./axios";

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
