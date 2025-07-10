import { Button, Icon, StatusDot } from "@/components/ui";
import { useJWTAuthContext } from "@/config/Auth";
import { ConnectionStatus } from "@/types";
import { MessageSquarePlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ConversationsSidebar from "./ConversationsSidebar";
import UnionLogo from "./chat-v2/union-logo";
import { BooksIcon } from "./icons/BooksIcon";
import { LayersIcon } from "./icons/LayersIcon";

interface HeaderProps {
  connectionStatus: ConnectionStatus;
  isTaskActive: boolean;
  elapsedTime: number;
  activeAgentCount: number;
  onRetryConnection: () => void;
  onStopAgent: () => void;
  taskStatus?: "created" | "in_progress" | "completed" | "failed" | "waiting_user_response" | null;
}

const Header: React.FC<HeaderProps> = ({ connectionStatus, isTaskActive, elapsedTime, activeAgentCount, onRetryConnection, onStopAgent, taskStatus }) => {
  const router = useRouter();
  const { user, logout, isLoggedIn } = useJWTAuthContext();
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [isConversationsSidebarOpen, setIsConversationsSidebarOpen] = useState(false);

  // Share current task URL
  const handleShareTask = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        setShowCopiedToast(true);
        setTimeout(() => setShowCopiedToast(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy URL: ", err);
      });
  };

  // Format elapsed time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  // Handle login/logout
  const handleLogin = () => {
    router.push("/auth/login");
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Handle new chat - full page reload to home page
  const handleNewChat = () => {
    window.location.href = "/";
  };

  // Create display name from user data
  const displayName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "";

  // Determine if we should show task controls
  // Only show task controls if task is active and status is 'created', 'in_progress', or 'waiting_user_response'
  const shouldShowTaskControls = isTaskActive && (taskStatus === "created" || taskStatus === "in_progress" || taskStatus === "waiting_user_response");

  const toggleConversationsSidebar = () => {
    setIsConversationsSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <header className="px-4 py-2.5 flex  items-center justify-between sm:p-5">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <Link href={user ? "/" : "/login"} className="mr-4">
            <UnionLogo />
          </Link>
        </div>

        {/* Right side - User profile */}
        <div className="flex items-center gap-3">
          <Button onClick={handleNewChat} variant="primary" size="md" aria-label="New Chat">
            <MessageSquarePlus size={20} />
          </Button>
          <Button onClick={handleNewChat} variant="primary" size="md" aria-label="Tasks history">
            <LayersIcon />
          </Button>
          <Button onClick={handleNewChat} variant="primary" size="md" aria-label="Tutorial page">
            <BooksIcon />
          </Button>
          {isLoggedIn ? (
            <Button onClick={handleLogout} variant="primary" size="md" className="p-0">
              {user?.picture ? (
                <img src={user.picture} alt={displayName} className="rounded-full object-cover" />
              ) : (
                <div className="rounded-full w-full">
                  <Icon name="user" className="w-full" />
                </div>
              )}
            </Button>
          ) : (
            <button onClick={handleLogin} className="j">
              LogIn
            </button>
          )}
        </div>
      </header>

      {/* Task Status Bar - Only shown when a task is active AND in progress/created */}
      {shouldShowTaskControls && connectionStatus === "connected" && (
        <div className="bg-stone-50 border-b border-stone-200 px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <StatusDot status="success" pulsing={true} />
              <span className="text-sm font-medium text-gray-700">Task Running</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500">
              <Icon name="clock" className="w-3.5 h-3.5" />
              <span className="text-xs">{formatTime(elapsedTime)}</span>
            </div>
            {activeAgentCount > 0 && (
              <div className="flex items-center gap-1.5">
                <Icon name="users" className="w-3.5 h-3.5 text-gray-600" />
                <span className="text-xs text-gray-700">
                  {activeAgentCount} agent{activeAgentCount !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleShareTask} variant="ghost" size="xs" className="text-gray-600 hover:text-indigo-600" icon={<Icon name="document" className="w-3.5 h-3.5 mr-1" />}>
              Share
            </Button>
            <Button onClick={onStopAgent} variant="outline" size="xs" className="text-red-500 border-red-200 hover:bg-red-50" icon={<Icon name="x-circle" className="w-3.5 h-3.5 mr-1" />}>
              Stop
            </Button>
          </div>
        </div>
      )}

      {/* Connection Status Bar - Only shown when disconnected or connecting */}
      {(connectionStatus === "disconnected" || connectionStatus === "connecting") && (
        <div className={`px-4 py-1 flex items-center justify-between ${connectionStatus === "disconnected" ? "bg-red-50 border-b border-red-100" : "bg-yellow-50 border-b border-yellow-100"}`}>
          <div className="flex items-center gap-2">
            <StatusDot status={connectionStatus === "disconnected" ? "error" : "warning"} pulsing={connectionStatus === "connecting"} />
            <span className="text-sm font-medium">{connectionStatus === "connecting" ? "Connecting to server..." : "Disconnected from server"}</span>
          </div>

          {connectionStatus === "disconnected" && (
            <Button onClick={onRetryConnection} variant="outline" size="xs" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50" icon={<Icon name="check" className="w-3 h-3 mr-1" />}>
              Retry Connection
            </Button>
          )}
        </div>
      )}

      {/* Conversations Sidebar */}
      <ConversationsSidebar isOpen={isConversationsSidebarOpen} onClose={() => setIsConversationsSidebarOpen(false)} />

      {/* Copied to clipboard toast notification */}
      {showCopiedToast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-indigo-800 text-white text-sm py-2 px-4 rounded-md shadow-lg animate-fade-in z-50">URL copied to clipboard</div>
      )}
    </>
  );
};

export default Header;
