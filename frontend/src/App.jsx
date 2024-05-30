import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./components/AdminPanel";
import ProvideCertificate from "./components/ProvideCertificate";
import LinkUpdate from "./components/LinkUpdate";
import ShowDatabase from "./components/ShowDatabase";
import ContentWritingForm from "./components/ContentWritingForm";
import VolunteeringForm from "./components/VolunteeringForm";
import SocialMediaMarketingForm from "./components/SocialMediaMarketingForm";
import ProductOnlineMarketingForm from "./components/ProductOnlineMarketingForm";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/admin/provide-certificate" element={<ProvideCertificate />} />
        <Route path="/admin/link-update" element={<LinkUpdate />} />
        <Route path="/admin/show-database" element={<ShowDatabase />} />
        <Route path="/content-writing" element={<ContentWritingForm />} />
        <Route path="/volunteering" element={<VolunteeringForm />} />
        <Route path="/social-media-marketing" element={<SocialMediaMarketingForm />} />
        <Route path="/product-online-marketing" element={<ProductOnlineMarketingForm />} />
      </Routes>
    </Router>
  );
};

export default App;
