import NavbarLayout from "../navbar/NavbarLayout";
import FooterLayout from "../footer/FooterLayout";
import NoJobs from "./NoJobs";
export default function WorkerDashboard() {
  return (
    <div>
      <NavbarLayout />
      <NoJobs />
      <FooterLayout />
    </div>
  );
}
