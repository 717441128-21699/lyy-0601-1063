import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { JobList } from "./pages/JobList";
import { JobDetail } from "./pages/JobDetail";
import { ResumeCenter } from "./pages/ResumeCenter";
import { CompanyPage } from "./pages/CompanyPage";
import { ApplicationManagement } from "./pages/ApplicationManagement";
import { InterviewSchedule } from "./pages/InterviewSchedule";
import { MessageCenter } from "./pages/MessageCenter";
import { AdminPanel } from "./pages/AdminPanel";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<JobList />} />
          <Route path="job/:id" element={<JobDetail />} />
          <Route path="company/:id" element={<CompanyPage />} />
          <Route path="resume" element={<ResumeCenter />} />
          <Route path="applications" element={<ApplicationManagement />} />
          <Route path="interviews" element={<InterviewSchedule />} />
          <Route path="messages" element={<MessageCenter />} />
          <Route path="admin" element={<AdminPanel />} />
        </Route>
      </Routes>
    </Router>
  );
}
