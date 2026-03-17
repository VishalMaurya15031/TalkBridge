import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon, Users, MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const isNotificationsPage = location.pathname === "/notifications";
  const isFriendsPage = location.pathname === "/friends";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { logoutMutation } = useLogout();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-base-200/95 backdrop-blur-md border-b border-base-300/50 sticky top-0 z-30 shadow-sm lg:hidden">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Main navbar content */}
        <div className="flex items-center justify-between w-full h-14 sm:h-16">
          {/* LOGO - Always visible on mobile/tablet */}
          <div className="flex items-center min-w-0 flex-1 mr-3">
            <Link 
              to="/" 
              className="flex items-center gap-2 hover:scale-105 transition-transform duration-200 group min-w-0"
              onClick={closeMobileMenu}
            >
              <div className="p-1 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200 flex-shrink-0">
                <ShipWheelIcon className="size-6 sm:size-7 text-primary group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <span className="text-lg sm:text-xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider truncate">
                TalkBridge
              </span>
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Desktop-style buttons for larger mobile screens */}
            <div className="hidden sm:flex items-center gap-1">
              {/* Friends Button */}
              <Link to="/friends">
                <button 
                  className={`btn btn-ghost btn-circle btn-sm hover:btn-primary hover:text-primary-content transition-all duration-200 ${
                    isFriendsPage ? 'bg-primary/10 text-primary' : ''
                  }`}
                  title="Friends"
                >
                  <Users className="h-4 w-4" />
                </button>
              </Link>

              {/* Notifications Button */}
              <Link to="/notifications">
                <button 
                  className={`btn btn-ghost btn-circle btn-sm hover:btn-primary hover:text-primary-content transition-all duration-200 relative ${
                    isNotificationsPage ? 'bg-primary/10 text-primary' : ''
                  }`}
                  title="Notifications"
                >
                  <BellIcon className="h-4 w-4" />
                </button>
              </Link>

              {/* User Avatar */}
              <div className="avatar hover:scale-110 transition-transform duration-200 cursor-pointer ml-1">
                <div className="w-8 h-8 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-200">
                  <img 
                    src={authUser?.profilePic} 
                    alt="User Avatar" 
                    className="rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Logout button */}
              <button 
                className="btn btn-ghost btn-circle btn-sm hover:btn-error hover:text-error-content transition-all duration-200 group"
                onClick={logoutMutation}
                title="Logout"
              >
                <LogOutIcon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>

            {/* Mobile menu button - only for small screens */}
            <button
              onClick={toggleMobileMenu}
              className="btn btn-ghost btn-circle btn-sm sm:hidden flex-shrink-0"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <XIcon className="h-4 w-4" />
              ) : (
                <MenuIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu - only for small screens */}
        <div className={`sm:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-80 opacity-100 visible' 
            : 'max-h-0 opacity-0 invisible overflow-hidden'
        }`}>
          <div className="py-3 space-y-2 border-t border-base-300/50 mt-2">
            {/* Mobile Friends Button */}
            <Link to="/friends" onClick={closeMobileMenu}>
              <button 
                className={`btn btn-ghost w-full justify-start gap-3 h-11 ${
                  isFriendsPage ? 'bg-primary/10 text-primary' : ''
                }`}
              >
                <Users className="h-5 w-5" />
                <span className="text-base">Friends</span>
              </button>
            </Link>

            {/* Mobile Notifications Button */}
            <Link to="/notifications" onClick={closeMobileMenu}>
              <button 
                className={`btn btn-ghost w-full justify-start gap-3 h-11 relative ${
                  isNotificationsPage ? 'bg-primary/10 text-primary' : ''
                }`}
              >
                <BellIcon className="h-5 w-5" />
                <span className="text-base">Notifications</span>
              </button>
            </Link>

            {/* Mobile Theme Selector */}
            <div className="px-4 py-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-base-content/70">Theme:</span>
                <ThemeSelector />
              </div>
            </div>

            {/* Mobile User Profile */}
            <div className="px-4 py-3">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-base-100/50">
                <div className="avatar">
                  <div className="w-10 h-10 rounded-full ring-2 ring-primary/20">
                    <img 
                      src={authUser?.profilePic} 
                      alt="User Avatar" 
                      className="rounded-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium truncate block">{authUser?.fullName}</span>
                  <span className="text-xs text-base-content/60">Ready to learn & teach</span>
                </div>
              </div>
            </div>

            {/* Mobile Logout button */}
            <button 
              className="btn btn-ghost w-full justify-start gap-3 h-11 text-error hover:bg-error/10"
              onClick={() => {
                closeMobileMenu();
                logoutMutation();
              }}
            >
              <LogOutIcon className="h-5 w-5" />
              <span className="text-base">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;