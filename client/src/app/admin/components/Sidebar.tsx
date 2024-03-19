import { Users, UserCog } from "lucide-react";
import { ReactElement } from "react";

export default function Sidebar() {
  interface sidebarType {
    icon: ReactElement;
    label: string;
  };

  const iconClass = "w-4 h-4 mr-2";

  const sidebarLabels: Array<sidebarType> = [
    {
      label: "Users",
      icon: <Users className={iconClass} />,
    },
    {
      label: "Admins",
      icon: <UserCog className={iconClass} />,
    },
  ];
  
  return (
    <nav className="h-full w-[300px] flex-col space-y-1 border p-2 rounded-md hidden lg:flex">
      {sidebarLabels.map((sidebarMenu: sidebarType, index: number) => 
        <div key={index} className="flex items-center h-9 hover:bg-zinc-800 px-3 rounded-md cursor-pointer">
          {sidebarMenu.icon}
          <div className="text-sm font-medium">{sidebarMenu.label}</div>
        </div>
      )}
    </nav>
  );
}
