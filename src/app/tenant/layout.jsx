import { PortalAuthProvider } from "@/context/PortalAuthContext";

export const metadata = {
  title: "Tenant Portal — McCann & Curran",
  description: "Tenant portal for McCann & Curran Realty",
};

export default function TenantLayout({ children }) {
  return <PortalAuthProvider>{children}</PortalAuthProvider>;
}
