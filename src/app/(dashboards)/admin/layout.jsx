import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin Portal — McCann & Curran Reality",
};

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
