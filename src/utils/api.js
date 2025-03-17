/* eslint-disable react-hooks/rules-of-hooks */
import api from "@/services/api";

export const fetchStaffs = async () => {
  const response = await api.get("/users/staffs");
  return response.data;
};

export const addStaff = async (staffData) => {
  const response = await api.post("/auth/add-staff", staffData);
  return response.data;
};

// Fetch all customers
export const fetchCustomers = async () => {
  const response = await api.get("/customers");
  return response.data;
};

// Add a new customer
export const addCustomer = async (customerData) => {
  const response = await api.post("/customers/add", customerData);
  return response.data;
};

// Fetch all vendors
export const fetchVendors = async () => {
  const response = await api.get("/vendors");
  return response.data;
};

// Add a new vendor
export const addVendor = async (vendorData) => {
  const response = await api.post("/vendors/add", vendorData);
  return response.data;
};
