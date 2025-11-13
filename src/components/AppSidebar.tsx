import { Home, FileText, Calendar, Trophy, MessageSquare, BarChart3, TrendingUp, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const studentItems = [
  { title: "Dashboard", url: "/student/dashboard", icon: Home },
  { title: "Performance Review", url: "/student/performance", icon: TrendingUp },
  { title: "Assignments", url: "/student/assignments", icon: FileText },
  { title: "Club Events", url: "/student/events", icon: Calendar },
  { title: "Achievements", url: "/student/achievements", icon: Trophy },
  { title: "Feedback", url: "/student/feedback", icon: MessageSquare },
];

const teacherItems = [
  { title: "Dashboard", url: "/teacher/dashboard", icon: Home },
  { title: "Upload Data", url: "/teacher/upload", icon: FileText },
  { title: "Students", url: "/teacher/students", icon: BarChart3 },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { role, logout } = useAuth();
  const currentPath = location.pathname;

  const items = role === 'student' ? studentItems : teacherItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <div className="p-6">
          <h2 className="text-xl font-bold text-sidebar-foreground">EduGrade AI</h2>
          <p className="text-sm text-sidebar-foreground/70 capitalize">{role} Portal</p>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4">
          <SidebarMenuButton onClick={handleLogout} className="w-full text-sidebar-foreground hover:bg-sidebar-accent">
            <LogOut className="h-4 w-4" />
            {open && <span>Logout</span>}
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
