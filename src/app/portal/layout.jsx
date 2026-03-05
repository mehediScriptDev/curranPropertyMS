import { PortalAuthProvider } from "@/context/PortalAuthContext";

export const metadata = {
  title: "Client Portal — McCann & Curran",
  description: "Landlord portal for McCann & Curran Realty",
};

export default function PortalLayout({ children }) {
  return (
    <PortalAuthProvider>
      {children}
    </PortalAuthProvider>
  );
}
