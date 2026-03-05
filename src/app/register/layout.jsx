import { PortalAuthProvider } from "@/context/PortalAuthContext";

export const metadata = {
  title: "Register — McCann & Curran",
  description: "Create your McCann & Curran client portal account",
};

export default function RegisterLayout({ children }) {
  return (
    <PortalAuthProvider>
      {children}
    </PortalAuthProvider>
  );
}
