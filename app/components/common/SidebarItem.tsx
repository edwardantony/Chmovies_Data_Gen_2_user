"use client";

import { ReactNode } from "react";
import { ChevronRight } from "@mui/icons-material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface SidebarItemProps {
  title: string;
  icon?: ReactNode;
  isActive?: boolean;
  isSubmenu?: boolean;
  isOpen?: boolean;
  href?: string;
  onClick?: () => void;
  children?: ReactNode;
}

const SidebarItem = ({
  title,
  icon,
  isActive = false,
  isSubmenu = false,
  isOpen = false,
  href,
  onClick,
  children
}: SidebarItemProps) => {
  const baseClasses = `flex items-center w-full ${
    isSubmenu 
      ? "p-3 hover:bg-gray-600 text-sm" 
      : "border-b border-gray-700 flex-col p-6 hover:bg-gray-700"
  } ${
    isActive 
      ? "relative after:content-[' '] after:bg-blue-500 after:rounded after:absolute after:w-1 after:h-[75px] after:top-1/2 after:-translate-y-1/2 after:left-0" 
      : ""
  }`;

  return (
    <li className={isSubmenu ? "text-left" : "text-center"}>
      {href ? (
        <a href={href} className={baseClasses}>
          {isSubmenu ? (
            <div className="flex items-center">
              
              {icon && <span className="mr-2 pl-2">{icon}</span>}
              <span>{title}</span>
            </div>
          ) : (
            <>
              <span className="flex justify-center w-full mb-1">{icon}</span>
              <span className="text-xs">{title}</span>
            </>
          )}
        </a>
      ) : (
        <button onClick={onClick} className={baseClasses}>
          {isSubmenu ? (
            <div className="flex items-center">
              <span className="mr-2 text-gray-300">
                {isOpen ? <ExpandMoreIcon fontSize="small" /> : <ChevronRight fontSize="small" />}
              </span>
              {icon && <span className="mr-2">{icon}</span>}
              <span className="text-md text-gray-300">{title}</span>
            </div>
          ) : (
            <>
              <span className="flex justify-center w-full mb-1">{icon}</span>
              <span className="text-xs">{title}</span>
            </>
          )}
        </button>
      )}
      {isOpen && children && (
        <ul className="text-left space-y-1 pl-0">
          {children}
        </ul>
      )}
    </li>
  );
};

export default SidebarItem;