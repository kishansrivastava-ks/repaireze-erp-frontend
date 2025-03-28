import toast from "react-hot-toast";

// Success toast
export const successToast = (message) => {
  toast.success(message, {
    position: "top-center",
    duration: 4000,
    style: {
      background: "#4CAF50",
      color: "white",
      borderRadius: "8px",
      padding: "12px",
    },
    iconTheme: {
      primary: "white",
      secondary: "#4CAF50",
    },
  });
};

// Error toast
export const errorToast = (message) => {
  toast.error(message, {
    position: "top-right",
    duration: 4000,
    style: {
      background: "#F44336",
      color: "white",
      borderRadius: "8px",
      padding: "12px",
    },
    iconTheme: {
      primary: "white",
      secondary: "#F44336",
    },
  });
};

// Info toast
export const infoToast = (message) => {
  toast(message, {
    position: "top-right",
    duration: 4000,
    style: {
      background: "#2196F3",
      color: "white",
      borderRadius: "8px",
      padding: "12px",
    },
  });
};

// Custom toast with more configuration options
export const customToast = (message, options = {}) => {
  return toast(message, {
    position: "top-right",
    duration: 4000,
    ...options,
  });
};
