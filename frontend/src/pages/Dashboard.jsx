import { useAuth } from "../context/AuthContext";
import SeekerDashboard from "./SeekerDashboard";
import RecruiterDashboard from "./RecruiterDashboard";

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;
  return user.role === "recruiter" ? <RecruiterDashboard /> : <SeekerDashboard />;
}