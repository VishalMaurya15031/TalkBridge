import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, ShipWheelIcon, UsersIcon, LogOutIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const { logoutMutation } = useLogout();

  const navigationItems = [
    {
      path: "/",
      icon: HomeIcon,
      label: "Home",
      description: "Dashboard & Overview"
    },
    {
      path: "/friends",
      icon: UsersIcon,
      label: "Friends",
      description: "Language Partners"
    },
    {
      path: "/notifications",
      icon: BellIcon,
      label: "Notifications",
      description: "Friend Requests & Updates"
    }
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-base-200 to-base-300/50 border-r border-base-300/70 hidden lg:flex flex-col h-screen sticky top-0 shadow-sm">
      {/* Logo Section */}
      <div className="p-6 border-b border-base-300/50">
        <Link 
          to="/" 
          className="flex items-center gap-3 group hover:scale-105 transition-transform duration-200"
        >
          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-200">
            <ShipWheelIcon className="size-8 text-primary group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              TalkBridge
            </span>
            <span className="text-xs text-base-content/60 font-medium">
              Language Learning
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-base-content/50 uppercase tracking-wider px-3 mb-2">
            Navigation
          </h3>
        </div>

        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                group relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 
                hover:bg-base-100 hover:shadow-sm hover:translate-x-1
                ${isActive 
                  ? "bg-primary text-primary-content shadow-md" 
                  : "text-base-content hover:text-primary"
                }
              `}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-content rounded-r-full" />
              )}
              
              <div className={`
                p-1.5 rounded-md transition-colors duration-200
                ${isActive 
                  ? "bg-primary-content/20" 
                  : "bg-base-300/50 group-hover:bg-primary/10"
                }
              `}>
                <Icon className={`
                  size-4 transition-colors duration-200
                  ${isActive 
                    ? "text-primary-content" 
                    : "text-base-content/70 group-hover:text-primary"
                  }
                `} />
              </div>
              
              <div className="flex-1">
                <span className={`
                  font-medium text-sm
                  ${isActive ? "text-primary-content" : ""}
                `}>
                  {item.label}
                </span>
                <p className={`
                  text-xs mt-0.5 transition-colors duration-200
                  ${isActive 
                    ? "text-primary-content/80" 
                    : "text-base-content/50 group-hover:text-base-content/70"
                  }
                `}>
                  {item.description}
                </p>
              </div>

              {/* Hover effect indicator */}
              <div className={`
                w-2 h-2 rounded-full transition-all duration-200
                ${isActive 
                  ? "bg-primary-content/50" 
                  : "bg-transparent group-hover:bg-primary/30"
                }
              `} />
            </Link>
          );
        })}
      </nav>

      {/* Theme Selector Section */}
      <div className="p-4 border-t border-base-300/50">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">
            Theme
          </span>
          <ThemeSelector />
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-base-300/50 bg-base-100/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <div className="avatar">
              <div className="w-12 h-12 rounded-full ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-200">
                <img 
                  src={authUser?.profilePic} 
                  alt="User Avatar" 
                  className="rounded-full object-cover"
                />
              </div>
            </div>
            {/* Online status indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-base-100 rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-success rounded-full animate-pulse" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-base-content truncate">
              {authUser?.fullName}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-xs text-success font-medium">Online</span>
            </div>
            <p className="text-xs text-base-content/50 mt-0.5">
              Ready to learn & teach
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          className="btn btn-ghost w-full justify-start gap-3 text-error hover:bg-error/10 transition-all duration-200"
          onClick={logoutMutation}
        >
          <LogOutIcon className="h-4 w-4" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;