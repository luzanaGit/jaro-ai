import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SignIn from "./auth/sign-in.jsx";
import SignUp from "./auth/sign-up.jsx";
import ProtectedRoute from "./auth/protected-route.jsx";

import HeaderSignedIn from "./header/header-signed-in.jsx";
import SidebarSignedIn from "./sidebar/sidebar-signed-in.jsx";
import DeepHermesSignedIn from "./deephermes/deephermes-signed-in.jsx";
import DevstralSignedIn from "./devstral/devstral-signed-in.jsx";
import GemmaSignedIn from "./gemma/gemma-signed-in.jsx";
import LlamaSignedIn from "./llama/llama-signed-in.jsx";
import QwenSignedIn from "./qwen/qwen-signed-in.jsx";

import HeaderSignedOut from "./header/header-signed-out.jsx";
import SidebarSignedOut from "./sidebar/sidebar-signed-out.jsx";
import DeepHermesSignedOut from "./deephermes/deephermes-signed-out.jsx";
import DevstralSignedOut from "./devstral/devstral-signed-out.jsx";
import GemmaSignedOut from "./gemma/gemma-signed-out.jsx";
import LlamaSignedOut from "./llama/llama-signed-out.jsx";
import QwenSignedOut from "./qwen/qwen-signed-out.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeaderSignedOut />
              <SidebarSignedOut />
              <DeepHermesSignedOut />
            </>
          }
        />

        <Route
          path="/deephermes-signed-out"
          element={
            <>
              <HeaderSignedOut />
              <SidebarSignedOut />
              <DeepHermesSignedOut />
            </>
          }
        />
        <Route
          path="/devstral-signed-out"
          element={
            <>
              <HeaderSignedOut />
              <SidebarSignedOut />
              <DevstralSignedOut />
            </>
          }
        />
        <Route
          path="/gemma-signed-out"
          element={
            <>
              <HeaderSignedOut />
              <SidebarSignedOut />
              <GemmaSignedOut />
            </>
          }
        />
        <Route
          path="/llama-signed-out"
          element={
            <>
              <HeaderSignedOut />
              <SidebarSignedOut />
              <LlamaSignedOut />
            </>
          }
        />
        <Route
          path="/qwen-signed-out"
          element={
            <>
              <HeaderSignedOut />
              <SidebarSignedOut />
              <QwenSignedOut />
            </>
          }
        />
      </Routes>

      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        <Route
          path="/deephermes"
          element={
            <ProtectedRoute>
              <HeaderSignedIn />
              <SidebarSignedIn />
              <DeepHermesSignedIn />
            </ProtectedRoute>
          }
        />
        <Route
          path="/devstral"
          element={
            <ProtectedRoute>
              <HeaderSignedIn />
              <SidebarSignedIn />
              <DevstralSignedIn />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gemma"
          element={
            <ProtectedRoute>
              <HeaderSignedIn />
              <SidebarSignedIn />
              <GemmaSignedIn />
            </ProtectedRoute>
          }
        />
        <Route
          path="/llama"
          element={
            <ProtectedRoute>
              <HeaderSignedIn />
              <SidebarSignedIn />
              <LlamaSignedIn />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qwen"
          element={
            <ProtectedRoute>
              <HeaderSignedIn />
              <SidebarSignedIn />
              <QwenSignedIn />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  </StrictMode>
);
