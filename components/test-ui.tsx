"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, User, LogOut } from "lucide-react"

export function TestUI() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    console.log("[TEST] Toggle clicked, current:", sidebarOpen)
    setSidebarOpen(!sidebarOpen)
  }

  const handleDropdownClick = () => {
    console.log("[TEST] Dropdown clicked")
  }

  const handleLogout = () => {
    console.log("[TEST] Logout clicked")
    alert("Logout clicked!")
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">UI Test Components</h1>
      
      {/* Test Sidebar Toggle */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Sidebar Toggle Test</h2>
        <Button onClick={toggleSidebar} variant="outline">
          <Menu className="h-4 w-4 mr-2" />
          Toggle Sidebar (Current: {sidebarOpen ? "Open" : "Closed"})
        </Button>
      </div>

      {/* Test Dropdown */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Dropdown Test</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" onClick={handleDropdownClick}>
              <User className="h-4 w-4 mr-2" />
              Click Me for Dropdown
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Test Menu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => console.log("Profile clicked")}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Test Simple Buttons */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Simple Button Tests</h2>
        <div className="space-x-4">
          <Button onClick={() => alert("Button 1 clicked!")}>Button 1</Button>
          <Button onClick={() => alert("Button 2 clicked!")} variant="secondary">Button 2</Button>
          <Button onClick={() => alert("Button 3 clicked!")} variant="destructive">Button 3</Button>
        </div>
      </div>
    </div>
  )
}
