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

// Fetch services based on status
export const fetchServices = async (status) => {
  const response = await api.get(`/services?status=${status}`);
  return response.data;
};

// Search customer by name or mobile
export const searchCustomers = async (query) => {
  const response = await api.get(`/customers/search?query=${query}`);
  return response.data;
};

export const searchVendors = async (query) => {
  const response = await api.get(`/vendors/search?query=${query}`);
  return response.data;
};

// Add a new service
export const addService = async (serviceData) => {
  const response = await api.post("/services/add", serviceData);
  return response.data;
};

export const fetchMarketingCampaigns = async (type) => {
  const response = await api.get(`/marketing/campaigns?type=${type}`);
  console.log(response);
  return response.data.campaigns;
};

export const addMarketingCampaign = async (campaignData) => {
  const response = await api.post("/marketing/campaigns", campaignData);
  return response;
};

export const fetchMarketingPlans = async (type) => {
  const response = await api.get(`/marketing/plans?type=${type}`);
  return response.data.plans;
};

export const addMarketingPlan = async (planData) => {
  const response = await api.post("/marketing/plans", planData);
  return response;
};

export const fetchReceivables = async () => {
  const response = await api.get("/accounts/receivables");
  return response.data.receivables;
};

export const addReceivable = async (receivableData) => {
  const response = await api.post("/accounts/receivables/new", receivableData);
  return response;
};

export const fetchPayables = async () => {
  const response = await api.get("/accounts/payables");
  return response.data.payables;
};

export const addPayable = async (payableData) => {
  const response = await api.post("/accounts/payables/new", payableData);
  return response;
};
