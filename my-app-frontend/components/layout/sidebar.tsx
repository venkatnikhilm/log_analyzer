"use client"

import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart3, Upload, Settings, FileText, Shield, Activity } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface SidebarProps {
  isOpen: boolean
  username?: string
}

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    name: "Uploads",
    href: "/dashboard/uploads",
    icon: Upload,
  },
  // {
  //   name: "Logs",
  //   href: "/dashboard/logs",
  //   icon: FileText,
  // },
  // {
  //   name: "Threats",
  //   href: "/dashboard/threats",
  //   icon: Shield,
  // },
  // {
  //   name: "Activity",
  //   href: "/dashboard/activity",
  //   icon: Activity,
  // },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function Sidebar({ isOpen, username = "User" }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  // Add safety check for username
  const displayName = username || "User"

  return (
    <div
      className={cn(
        "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] bg-background border-r transition-all duration-300",
        isOpen ? "w-64" : "w-16",
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-blue-600 text-white">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Button
                key={item.name}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start transition-all duration-200",
                  !isOpen && "px-2",
                  isActive && "bg-secondary",
                )}
                onClick={() => router.push(item.href)}
              >
                <item.icon className={cn("h-5 w-5", isOpen && "mr-3")} />
                {isOpen && <span className="animate-in fade-in-0 duration-200">{item.name}</span>}
              </Button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
