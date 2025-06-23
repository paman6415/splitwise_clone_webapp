import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "@/App"
import GroupDetails from "@/pages/GroupDetails" 
import './index.css'

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/groups/:id" element={<GroupDetails />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
