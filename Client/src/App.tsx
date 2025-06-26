import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Invitation from "./pages/Invitation";
import Chat from "./pages/Chat";

export default function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Invitation />}/>
        <Route path="/chat" element={<Chat />}/>
      </Routes>
    </BrowserRouter>
  )
}