import { PortalAuthProvider } from "@/context/PortalAuthContext";

export const metadata = {
  title: "Login — McCann & Curran",
  description: "Sign in to the McCann & Curran client portal",
};

export default function LoginLayout({ children }) {
  return (
    <PortalAuthProvider>
      {children}
    </PortalAuthProvider>
  );
}
