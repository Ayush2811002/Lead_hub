export type LeadStatus = "Draft" | "Contacted" | "Submitted" | "Verification" | "Correction" | "Approved" | "Active" | "Rejected";

export const leads = [
  { id: "LD-2026-01842", name: "Aarav Sharma", initials: "AS", type: "Distributor", program: "Aadhaar Banking", mobile: "+91 ••••• 4821", district: "Lucknow", state: "Uttar Pradesh", owner: "Neha Singh", status: "Verification" as LeadStatus, followUp: "Today, 3:30 PM", priority: "High" },
  { id: "LD-2026-01841", name: "Priya Kumari", initials: "PK", type: "CSP", program: "Financial Inclusion", mobile: "+91 ••••• 7190", district: "Patna", state: "Bihar", owner: "Rahul Verma", status: "Submitted" as LeadStatus, followUp: "21 Sep, 11:00 AM", priority: "Medium" },
  { id: "LD-2026-01838", name: "Vikram Patel", initials: "VP", type: "Retailer", program: "Merchant Network", mobile: "+91 ••••• 2408", district: "Ahmedabad", state: "Gujarat", owner: "Ishita Shah", status: "Correction" as LeadStatus, followUp: "Overdue by 2 days", priority: "High" },
  { id: "LD-2026-01835", name: "Sneha Das", initials: "SD", type: "Distributor", program: "Rural Expansion", mobile: "+91 ••••• 9304", district: "Kolkata", state: "West Bengal", owner: "Arjun Bose", status: "Approved" as LeadStatus, followUp: "23 Sep, 2:00 PM", priority: "Low" },
  { id: "LD-2026-01829", name: "Manoj Yadav", initials: "MY", type: "CSP", program: "Aadhaar Banking", mobile: "+91 ••••• 1157", district: "Jaipur", state: "Rajasthan", owner: "Neha Singh", status: "Active" as LeadStatus, followUp: "30 Sep, 10:00 AM", priority: "Medium" },
  { id: "LD-2026-01822", name: "Farhan Ali", initials: "FA", type: "Retailer", program: "Merchant Network", mobile: "+91 ••••• 6682", district: "Bhopal", state: "Madhya Pradesh", owner: "Karan Mehta", status: "Contacted" as LeadStatus, followUp: "Tomorrow, 9:30 AM", priority: "Medium" },
];

export const territories = [
  { state: "Uttar Pradesh", district: "Lucknow", block: "Mohanlalganj", capacity: 3, occupied: 2, reserved: 1, status: "Reserved", partners: 2, leads: 6 },
  { state: "Bihar", district: "Patna", block: "Phulwari Sharif", capacity: 2, occupied: 1, reserved: 0, status: "Partial", partners: 1, leads: 4 },
  { state: "Gujarat", district: "Ahmedabad", block: "Daskroi", capacity: 2, occupied: 2, reserved: 0, status: "Filled", partners: 2, leads: 3 },
  { state: "Rajasthan", district: "Jaipur", block: "Sanganer", capacity: 4, occupied: 1, reserved: 0, status: "Vacant", partners: 1, leads: 5 },
  { state: "West Bengal", district: "Kolkata", block: "Bhangar I", capacity: 2, occupied: 0, reserved: 0, status: "Vacant", partners: 0, leads: 2 },
];

export const activities = [
  { title: "Document verification completed", detail: "PAN and Aadhaar evidence verified", user: "Ritika Rao", time: "18 min ago", tone: "success" },
  { title: "Correction requested", detail: "Outlet exterior photograph is unclear", user: "Amit Khanna", time: "46 min ago", tone: "warning" },
  { title: "Lead submitted", detail: "LD-2026-01841 moved to verification", user: "Rahul Verma", time: "1 hr ago", tone: "info" },
  { title: "Territory reserved", detail: "Mohanlalganj reserved until 27 Sep", user: "Neha Singh", time: "2 hrs ago", tone: "primary" },
];

export const monthlyLeads = [
  { month: "Apr", leads: 620, approved: 318 }, { month: "May", leads: 710, approved: 366 },
  { month: "Jun", leads: 680, approved: 390 }, { month: "Jul", leads: 845, approved: 448 },
  { month: "Aug", leads: 910, approved: 526 }, { month: "Sep", leads: 1048, approved: 612 },
];

export const stateCoverage = [
  { state: "UP", coverage: 78 }, { state: "BR", coverage: 64 }, { state: "GJ", coverage: 86 },
  { state: "RJ", coverage: 58 }, { state: "WB", coverage: 71 }, { state: "MP", coverage: 67 },
];

export const documents = [
  { name: "PAN Card", file: "PAN_Aarav_Sharma.pdf", date: "18 Sep 2026", version: "v2", status: "Verified" },
  { name: "Aadhaar (Masked)", file: "Identity_Proof.pdf", date: "18 Sep 2026", version: "v1", status: "Verified" },
  { name: "Applicant Photograph", file: "Profile_Photo.jpg", date: "17 Sep 2026", version: "v1", status: "Verified" },
  { name: "Police Verification", file: "Police_Verification.pdf", date: "19 Sep 2026", version: "v1", status: "Under Review" },
  { name: "Bank Application Form", file: "Bank_Form_Signed.pdf", date: "19 Sep 2026", version: "v1", status: "Uploaded" },
  { name: "Outlet Exterior", file: "Outlet_Exterior.jpg", date: "16 Sep 2026", version: "v2", status: "Correction" },
];