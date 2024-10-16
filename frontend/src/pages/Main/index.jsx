import React, { useEffect, useState } from "react";
import DefaultChatContainer from "@/components/DefaultChat";
import Sidebar from "@/components/Sidebar";
import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";
import { isMobile } from "react-device-detect";
import { FullScreenLoader } from "@/components/Preloader";
import UserMenu from "@/components/UserMenu";
import Header from "../../components/Header"; // Import the Header component

export default function Main() {
  const { loading, requiresAuth, mode } = usePasswordModal();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // Set to false for collapsed by default
  const [isCollapsed, setIsCollapsed] = useState(false); // State for sidebar collapse

  if (loading) return <FullScreenLoader />;
  if (requiresAuth !== false) {
    return <>{requiresAuth !== null && <PasswordModal mode={mode} />}</>;
  }

  const toggleSidebar = () => {
    setIsSidebarVisible(prev => !prev); // Toggle sidebar visibility
  };

  return (
    <>
      <Header 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        toggleSidebar={toggleSidebar}
      />
        <div className="w-screen h-screen overflow-hidden bg-sidebar flex" style={{ height: `calc(100vh - 65px)` }}>
          {!isMobile && isSidebarVisible && <Sidebar />} {/* Conditionally render Sidebar */}
          <DefaultChatContainer />
        </div>
    </>
  );
}