// Property Finances Mock Data
export const PROPERTY_FINANCES = {
  "1": {
    propertyName: "Apt 5B Rosewood Close",
    propertyId: "1",
    monthlyRentAmount: 1800,
    landlordId: "landlord-1",
    tenants: [{ name: "Kevin Murphy", startDate: "Oct 2022", monthlyRent: 1800 }],
    months: [
      {
        month: "March 2026",
        rentCollected: 1800,
        deductions: [
          { type: "Maintenance", amount: 150, description: "Plumbing repair" },
          { type: "Bills", amount: 45, description: "Property insurance" },
        ],
        deductionTotal: 195,
        netAmount: 1605,
        status: "Pending",
        isPaid: false,
      },
      {
        month: "February 2026",
        rentCollected: 1800,
        deductions: [{ type: "Maintenance", amount: 200, description: "Heating system service" }],
        deductionTotal: 200,
        netAmount: 1600,
        status: "Paid",
        isPaid: true,
      },
      {
        month: "January 2026",
        rentCollected: 1800,
        deductions: [{ type: "Taxes", amount: 120, description: "Property tax" }],
        deductionTotal: 120,
        netAmount: 1680,
        status: "Paid",
        isPaid: true,
      },
      {
        month: "December 2025",
        rentCollected: 1800,
        deductions: [
          { type: "Bills", amount: 60, description: "Internet/utilities" },
          { type: "Maintenance", amount: 80, description: "Cleaning service" },
        ],
        deductionTotal: 140,
        netAmount: 1660,
        status: "Paid",
        isPaid: true,
      },
    ],
  },
  "2": {
    propertyName: "Apt 306 Fairview Rd",
    propertyId: "2",
    monthlyRentAmount: 2100,
    landlordId: "landlord-1",
    tenants: [{ name: "Michael O'Brien", startDate: "May 2023", monthlyRent: 2100 }],
    months: [
      {
        month: "March 2026",
        rentCollected: 2100,
        deductions: [{ type: "Maintenance", amount: 300, description: "Window repairs" }],
        deductionTotal: 300,
        netAmount: 1800,
        status: "Pending",
        isPaid: false,
      },
      {
        month: "February 2026",
        rentCollected: 2100,
        deductions: [{ type: "Bills", amount: 50, description: "Property insurance" }],
        deductionTotal: 50,
        netAmount: 2050,
        status: "Paid",
        isPaid: true,
      },
      {
        month: "January 2026",
        rentCollected: 2100,
        deductions: [],
        deductionTotal: 0,
        netAmount: 2100,
        status: "Paid",
        isPaid: true,
      },
      {
        month: "December 2025",
        rentCollected: 2100,
        deductions: [{ type: "Taxes", amount: 140, description: "Annual property tax" }],
        deductionTotal: 140,
        netAmount: 1960,
        status: "Paid",
        isPaid: true,
      },
    ],
  },
  "3": {
    propertyName: "Apt 104 Elmwood Grove",
    propertyId: "3",
    monthlyRentAmount: 1650,
    landlordId: "landlord-1",
    tenants: [{ name: "Sarah Kelly", startDate: "Jan 2024", monthlyRent: 1650 }],
    months: [
      {
        month: "March 2026",
        rentCollected: 1650,
        deductions: [{ type: "Bills", amount: 75, description: "Utilities" }],
        deductionTotal: 75,
        netAmount: 1575,
        status: "Pending",
        isPaid: false,
      },
      {
        month: "February 2026",
        rentCollected: 1650,
        deductions: [{ type: "Maintenance", amount: 100, description: "Boiler maintenance" }],
        deductionTotal: 100,
        netAmount: 1550,
        status: "Paid",
        isPaid: true,
      },
      {
        month: "January 2026",
        rentCollected: 1650,
        deductions: [],
        deductionTotal: 0,
        netAmount: 1650,
        status: "Paid",
        isPaid: true,
      },
      {
        month: "December 2025",
        rentCollected: 1650,
        deductions: [{ type: "Bills", amount: 60, description: "Property insurance" }],
        deductionTotal: 60,
        netAmount: 1590,
        status: "Paid",
        isPaid: true,
      },
    ],
  },
  "4": {
    propertyName: "Apt 22 Parkside Plaza",
    propertyId: "4",
    monthlyRentAmount: 1950,
    landlordId: "landlord-1",
    tenants: [{ name: "Emma Wilson", startDate: "Mar 2023", monthlyRent: 1950 }],
    months: [
      {
        month: "March 2026",
        rentCollected: 1950,
        deductions: [
          { type: "Maintenance", amount: 250, description: "Roof inspection and repair" },
          { type: "Bills", amount: 40, description: "Insurance" },
        ],
        deductionTotal: 290,
        netAmount: 1660,
        status: "Pending",
        isPaid: false,
      },
      {
        month: "February 2026",
        rentCollected: 1950,
        deductions: [],
        deductionTotal: 0,
        netAmount: 1950,
        status: "Paid",
        isPaid: true,
      },
      {
        month: "January 2026",
        rentCollected: 1950,
        deductions: [{ type: "Taxes", amount: 130, description: "Property tax" }],
        deductionTotal: 130,
        netAmount: 1820,
        status: "Paid",
        isPaid: true,
      },
      {
        month: "December 2025",
        rentCollected: 1950,
        deductions: [{ type: "Maintenance", amount: 175, description: "Gutter cleaning" }],
        deductionTotal: 175,
        netAmount: 1775,
        status: "Paid",
        isPaid: true,
      },
    ],
  },
};

// Summary function for landlord dashboard
export const getLandlordSummary = (landlordId) => {
  const properties = Object.values(PROPERTY_FINANCES).filter((p) => p.landlordId === landlordId);
  const currentMonth = "March 2026";

  let totalRent = 0;
  let totalDeductions = 0;
  let totalNet = 0;
  let pendingCount = 0;
  let paidCount = 0;

  properties.forEach((prop) => {
    const monthData = prop.months.find((m) => m.month === currentMonth);
    if (monthData) {
      totalRent += monthData.rentCollected;
      totalDeductions += monthData.deductionTotal;
      totalNet += monthData.netAmount;
      if (monthData.isPaid) paidCount++;
      else pendingCount++;
    }
  });

  return {
    propertyCount: properties.length,
    totalRent,
    totalDeductions,
    totalNet,
    pendingCount,
    paidCount,
    currentMonth,
    properties,
  };
};
