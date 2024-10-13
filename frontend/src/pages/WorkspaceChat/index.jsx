import React, { useEffect, useState } from "react";
import { default as WorkspaceChatContainer } from "@/components/WorkspaceChat";
import Sidebar from "@/components/Sidebar";
import { useParams } from "react-router-dom";
import Workspace from "@/models/workspace";
import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";
import { isMobile } from "react-device-detect";
import { FullScreenLoader } from "@/components/Preloader";
import Header from "../../components/Header"; // Import the Header component

export default function WorkspaceChat() {
  const { loading, requiresAuth, mode } = usePasswordModal();

  if (loading) return <FullScreenLoader />;
  if (requiresAuth !== false) {
    return <>{requiresAuth !== null && <PasswordModal mode={mode} />}</>;
  }

  return <ShowWorkspaceChat />;
}

function ShowWorkspaceChat() {
  const { slug } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // Set to false for collapsed by default
  const [isCollapsed, setIsCollapsed] = useState(false); // State for sidebar collapse

  const toggleSidebar = () => {
    setIsSidebarVisible(prev => !prev); // Toggle sidebar visibility
  };

  useEffect(() => {
    async function getWorkspace() {
      if (!slug) return;
      const _workspace = await Workspace.bySlug(slug);
      if (!_workspace) {
        setLoading(false);
        return;
      }
      const suggestedMessages = await Workspace.getSuggestedMessages(slug);
      const pfpUrl = await Workspace.fetchPfp(slug);
      setWorkspace({
        ..._workspace,
        suggestedMessages,
        pfpUrl,
      });
      setLoading(false);
    }
    getWorkspace();
  }, [slug]);

  return (
    <>
      {/* Pass isCollapsed, setIsCollapsed, and toggleSidebar to the Header */}
      <Header 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        toggleSidebar={toggleSidebar} 
      />

      {/* Main layout with conditional sidebar rendering */}
      <div className="w-100 overflow-hidden bg-sidebar flex" style={{ height: `calc(100vh - 65px)` }}>
        {!isMobile && isSidebarVisible && <Sidebar />} {/* Sidebar is toggled */}
        <WorkspaceChatContainer loading={loading} workspace={workspace} />
      </div>
    </>
  );
}