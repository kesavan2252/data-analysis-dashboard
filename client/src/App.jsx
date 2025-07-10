import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import FileUploader from "./components/FileUploader";
import Dashboard from "./pages/Dashboard";
import { NotificationProvider } from "./components/NotificationProvider";
import HistoryPage from "./components/HistoryPage";

// Inside <Routes>


function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<FileUploader />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
// This is the main entry point of the React application.