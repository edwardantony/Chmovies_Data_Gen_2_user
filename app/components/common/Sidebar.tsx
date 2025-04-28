"use client";

import SidebarItem from "./SidebarItem";
import {
  Dashboard,
  People,
  Settings,
  Description,
  BarChart,
  VideoLibrary,
  PlaylistAddCheck,
  Handshake,
  AttachMoney,
  Theaters,
  Category,
  TheatersOutlined,
  SettingsInputSvideo,
  SatelliteAlt
} from "@mui/icons-material";

const menuItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <SettingsInputSvideo fontSize="large" />,
    subItems: [
      {
        id: "analytics",
        title: "Analytics",
        items: [
          { icon: <Description />, title: "Site Dashboard", href: "/dashboard/site" },
          { icon: <BarChart />, title: "Partner Dashboard", href: "/dashboard/partner" }
        ]
      }
    ]
  },
  {
    id: "cabeltv",
    title: "Cabel TV",
    icon: <SatelliteAlt fontSize="large" />,
    subItems: [
      {
        id: "cabeltv",
        title: "Cabel TV",
        items: [
          { icon: <People />, title: "Active Listing", href: "/cabeltv/active-listing" },
          { icon: <People />, title: "Activate Subscriber", href: "/cabeltv/manage-subscribers" }
        ]
      },
      {
        id: "cabel-partners",
        title: "Cabel Partners",
        items: [
          { icon: <People />, title: "Partner Listing", href: "/cabeltv/partner-listing" }
        ]
      }
    ]
  },
  {
    id: "users",
    title: "Users",
    icon: <People fontSize="large" />,
    subItems: [
      {
        id: "users",
        title: "Users",
        items: [
          { icon: <People />, title: "Subscriber List", href: "/users/subscribers" },
          { icon: <People />, title: "Adminstrator List", href: "/users/adminstrators" }
        ]
      }
    ]
  },
  {
    id: "videos",
    title: "Videos",
    icon: <Theaters fontSize="large" />,
    subItems: [
      {
        id: "videos",
        title: "Videos",
        items: [
          { icon: <TheatersOutlined />, title: "Titles", href: "/videos/titles" },
          { icon: <VideoLibrary />, title: "Episodes", href: "/videos/episodes" },
          { icon: <Category />, title: "Category", href: "/videos/category" },
          { icon: <PlaylistAddCheck />, title: "Genres", href: "/videos/genres" }
        ]
      },
      {
        id: "create",
        title: "Create New",
        items: [
          { icon: <TheatersOutlined />, title: "Create New Titles", href: "/videos/titles/create" },
          { icon: <VideoLibrary />, title: "Create New Episodes", href: "/videos/episodes/create" }
        ]
      }
    ]
  },
  {
    id: "partners",
    title: "Partners",
    icon: <Handshake fontSize="large" />,
    subItems: [
      {
        id: "partners",
        title: "Partners",
        items: [
          { icon: <Dashboard />, title: "Dashboard", href: "/partner/titles" },
          { icon: <TheatersOutlined />, title: "Movie List", href: "/partner/episodes" },
          { icon: <VideoLibrary />, title: "Episode List", href: "/partner/category" },
          { icon: <AttachMoney />, title: "Payments", href: "/videos/genres" }
        ]
      }
    ]
  },
  {
    id: "settings",
    title: "Settings",
    icon: <Settings fontSize="large" />,
    subItems: [
      {
        id: "settings",
        title: "Settings",
        items: [
          { icon: <Dashboard />, title: "General Settings", href: "/setting/general" },
          { icon: <Settings />, title: "Site Settings", href: "/setting/general" },
          { icon: <AttachMoney />, title: "Currency Settings", href: "/setting/general" },
          { icon: <AttachMoney />, title: "Tax Settings", href: "/setting/general" }
        ]
      }
    ]
  }
];

interface SidebarProps {
  isSidebarVisible: boolean;
  activeMenu: string | null;
  openSubMenus: Record<string, boolean>;
  toggleSubMenu: (menuId: string) => void;
  toggleSubMenuItem: (subMenuId: string) => void;
}

const Sidebar = ({
  isSidebarVisible,
  activeMenu,
  openSubMenus,
  toggleSubMenu,
  toggleSubMenuItem
}: SidebarProps) => {
  return (
    <aside
      className="bg-gray-900 text-white h-full fixed top-0 left-0 pt-[52px] flex transition-all duration-300"
      style={{ 
        width: isSidebarVisible ? (activeMenu ? "350px" : "120px") : "0", 
        opacity: isSidebarVisible ? 1 : 0 
      }}
    >
      {/* Main Menu */}
      <div className="w-[120px] bg-gray-800 h-full overflow-y-hidden hover:overflow-y-auto 
        scrollbar-gutter-stable [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/30 
        [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-track]:bg-transparent">
        <ul className="p-0 space-y-0">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              title={item.title}
              icon={item.icon}
              isActive={activeMenu === item.id}
              onClick={() => toggleSubMenu(item.id)}
            />
          ))}
        </ul>
      </div>

      {/* Sub Menu */}
      {activeMenu && (
        <div className="bg-gray-700 border-l border-gray-600 w-[230px] overflow-y-hidden hover:overflow-y-auto
          shadow-[2px_2px_20px_10px_rgba(46,46,46,0.4)] scrollbar-gutter-stable
          [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-white/40 
          [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-track]:bg-transparent">
          {menuItems.find(item => item.id === activeMenu)?.subItems?.map((subItem) => (
            <ul key={subItem.id} className="p-1 space-y-1 pl-0 border-b border-gray-600">
              <SidebarItem
                title={subItem.title}
                isSubmenu
                isOpen={!!openSubMenus[subItem.id]}
                onClick={() => toggleSubMenuItem(subItem.id)}
              >
                {subItem.items?.map((link) => (
                  <SidebarItem
                    key={link.href}
                    title={link.title}
                    icon={link.icon}
                    href={link.href}
                    isSubmenu
                  />
                ))}
              </SidebarItem>
            </ul>
          ))}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;