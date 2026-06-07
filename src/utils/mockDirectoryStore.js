import DEFAULT_TENANTS from "@/data/tenants";
import DEFAULT_TENANCIES from "@/data/tenancies";

const STORAGE_KEY = "rpr_admin_mock_directory_v1";

const FALLBACK_COLORS = [
  "bg-teal-500",
  "bg-indigo-500",
  "bg-orange-500",
  "bg-sky-600",
  "bg-emerald-600",
  "bg-violet-500",
  "bg-pink-500",
  "bg-amber-600",
];

function getInitials(name = "") {
  return name
    .split(" ")
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function normalizeDefaultTenancies() {
  return DEFAULT_TENANCIES.map((tenancy, index) => {
    const tenant = DEFAULT_TENANTS[index] || null;
    return {
      ...tenancy,
      tenantId: tenancy.tenantId ?? tenant?.id ?? null,
      property: tenancy.property || tenancy.sub || "",
      county: tenancy.county || "Dublin",
      statusLet: tenancy.statusLet || "Let",
      rentDueDay: tenancy.rentDueDay || "1",
    };
  });
}

function seedData() {
  return {
    tenants: DEFAULT_TENANTS,
    tenancies: normalizeDefaultTenancies(),
  };
}

export function loadDirectoryData() {
  if (typeof window === "undefined") return seedData();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedData();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }

    const parsed = JSON.parse(raw);
    if (!parsed?.tenants || !parsed?.tenancies) {
      const seeded = seedData();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }

    return parsed;
  } catch {
    return seedData();
  }
}

export function saveDirectoryData(data) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function addTenantToDirectory(formData) {
  const state = loadDirectoryData();
  const lastId = Math.max(0, ...state.tenants.map((tenant) => Number(tenant.id) || 0));
  const id = lastId + 1;

  const tenant = {
    id,
    name: formData.fullName || "New Tenant",
    initials: getInitials(formData.fullName),
    color: FALLBACK_COLORS[lastId % FALLBACK_COLORS.length],
    sub: formData.property || "",
    property: formData.property || "",
    moveIn: formData.moveIn || "",
    status: formData.status || "Active",
    mobile: formData.mobile || "",
    email: formData.email || "",
    pps: formData.pps || "",
    dob: formData.dob || "",
  };

  const nextState = {
    ...state,
    tenants: [tenant, ...state.tenants],
  };
  saveDirectoryData(nextState);
  return tenant;
}

export function addTenancyToDirectory(formData) {
  const state = loadDirectoryData();
  const tenant = state.tenants.find((entry) => String(entry.id) === String(formData.tenantId));
  if (!tenant) {
    throw new Error("Please select a tenant");
  }

  const lastId = Math.max(0, ...state.tenancies.map((tenancy) => Number(tenancy.id) || 0));
  const id = lastId + 1;

  const tenancy = {
    id,
    tenantId: tenant.id,
    initials: tenant.initials || getInitials(tenant.name),
    color: tenant.color || FALLBACK_COLORS[lastId % FALLBACK_COLORS.length],
    name: tenant.name,
    sub: formData.property,
    property: formData.property,
    statusLet: formData.status,
    statusBadge: formData.status,
    county: formData.county || "Dublin",
    landlord: formData.landlord || "Unassigned",
    landlordSub: formData.landlordSub || "Dublin",
    startDate: formData.startDate || null,
    rent: formData.rent,
    rtb: formData.rtb || "",
    rtbDate: formData.rtbDate || null,
    rtbStatus: formData.rtbStatus || "Active",
    rtbReg: formData.rtb ? "Registered" : "Unknown",
    rentReviewDate: formData.rentReviewDate || null,
    rentStatus: "Pending",
    rentDueDay: formData.rentDueDay,
  };

  const nextTenants = state.tenants.map((entry) => {
    if (entry.id !== tenant.id) return entry;
    return {
      ...entry,
      property: formData.property,
      sub: formData.property,
      moveIn: formData.startDate || entry.moveIn,
      status: formData.status === "Notice" ? "Notice" : "Active",
    };
  });

  const nextState = {
    tenants: nextTenants,
    tenancies: [tenancy, ...state.tenancies],
  };

  saveDirectoryData(nextState);
  return tenancy;
}
