import { Button, Icon } from "@/components/ui";
import { useJWTAuthContext } from "@/config/Auth";
import { MessageSquarePlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UnionLogo from "./chat-v2/union-logo";
import { BooksIcon } from "./icons/BooksIcon";
import { LayersIcon } from "./icons/LayersIcon";

const Navbar = () => {
  const router = useRouter();
  const { user, logout, isLoggedIn } = useJWTAuthContext();

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

  return (
    <>
      <nav className="px-4 py-2.5 flex  items-center justify-between sm:p-5">
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
      </nav>
    </>
  );
};

export default Navbar;
