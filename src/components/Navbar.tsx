import { Button, Icon } from "@/components/ui";
import { useJWTAuthContext } from "@/config/Auth";
import { MessageSquarePlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UnionLogo from "./chat-v2/union-logo";
import { BooksIcon } from "./icons/BooksIcon";
import { LayersIcon } from "./icons/LayersIcon";
import { useTheme } from "next-themes";
import { ThemeToggle } from "./common_components/ThemeToggle";

const Navbar = () => {
  const router = useRouter();
  const { user, logout, isLoggedIn } = useJWTAuthContext();
  const { resolvedTheme } = useTheme();

  let fillColor = "";

  if (resolvedTheme === "dark") {
    fillColor = "#FFFFFF";
  } else {
    fillColor = "#BDC1C6";
  }

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
  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "";

  return (
    <>
      <nav className="px-4 py-2.5 flex  items-center justify-between relative git push --set-upstream origin dev-mini-task z-10 sm:p-5">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <Link href={user ? "/" : "/login"} className="mr-4">
            <UnionLogo />
          </Link>
        </div>

        {/* Right side - User profile */}
        <div className="flex items-center space-x-2.5">
          {/* <Button
            onClick={handleNewChat}
            variant="primary"
            size="md"
            aria-label="New Chat"
          >
            <MessageSquarePlus size={20} />
          </Button> */}
          <ThemeToggle />
          <Button
            onClick={handleNewChat}
            variant="primary"
            size="md"
            aria-label="Tasks history"
            className="bg-white dark:bg-white/20 hover:bg-white/80 dark:hover:bg-white/30 text-foreground "
          >
            <LayersIcon fillColor={fillColor} />
          </Button>
          <Button
            onClick={handleNewChat}
            variant="primary"
            size="md"
            aria-label="Tutorial page"
            className="bg-white dark:bg-white/20 hover:bg-white/80 dark:hover:bg-white/30 text-foreground "
          >
            <BooksIcon fillColor={fillColor} />
          </Button>
          {isLoggedIn ? (
            <Button
              onClick={handleLogout}
              variant="primary"
              size="md"
              className="p-0"
            >
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={displayName}
                  className="rounded-full object-cover"
                />
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
