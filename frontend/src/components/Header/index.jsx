import React from "react";
import { List } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import brandLogo from '../../media/logo/brantas.png';
import paths from "@/utils/paths";

export default function Header({ isCollapsed, setIsCollapsed, toggleSidebar, from = null }) {
  return (
    <div className="flex items-center px-4 py-3 bg-sidebar border-b border-bs-secondary-hover">
      {/* Hamburger Menu Icon */}
      <button
        onClick={toggleSidebar} // Call toggleSidebar when the button is clicked
        className={`p-2 text-dark-text ${from && from == 'settings' ? 'hidden' : 'flex' }`}
        aria-label="Toggle Sidebar"
      >
        <List size={24} />
      </button>

      {/* Logo */}
      <Link
        to={paths.home()}
        className="flex items-center"
        aria-label="Home"
      >
        <img
          src={brandLogo}
          alt="Logo"
          className="rounded object-contain max-h-[30px]"
        />
      </Link>
    </div>
  );
}