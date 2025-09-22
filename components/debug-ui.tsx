"use client"

import { useState } from "react"

export function DebugUI() {
  const [count, setCount] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleClick = () => {
    console.log("Button clicked!")
    setCount(count + 1)
    alert(`Button clicked ${count + 1} times!`)
  }

  const toggleSidebar = () => {
    console.log("Toggle sidebar clicked, current:", sidebarOpen)
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-blue-600">Debug UI Test</h1>
      
      <div className="space-y-6">
        {/* Basic Button Test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Basic Button Test</h2>
          <button 
            onClick={handleClick}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Click Me! (Clicked {count} times)
          </button>
        </div>

        {/* Sidebar Toggle Test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Sidebar Toggle Test</h2>
          <button 
            onClick={toggleSidebar}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors mb-4"
          >
            Toggle Sidebar
          </button>
          <p>Sidebar is: <strong>{sidebarOpen ? "Open" : "Closed"}</strong></p>
          
          <div className="mt-4 flex">
            <div 
              className={`
                w-64 h-32 bg-gray-200 border-2 border-gray-300 rounded
                transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              `}
              style={{
                transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
              }}
            >
              <div className="p-4">
                <p className="text-sm">Sidebar Content</p>
              </div>
            </div>
            <div className="flex-1 ml-4 p-4 bg-gray-50 rounded">
              <p className="text-sm">Main Content Area</p>
            </div>
          </div>
        </div>

        {/* Dropdown Test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Dropdown Test</h2>
          <div className="relative inline-block">
            <select 
              className="bg-white border border-gray-300 rounded px-4 py-2"
              onChange={(e) => {
                console.log("Dropdown changed:", e.target.value)
                alert(`Selected: ${e.target.value}`)
              }}
            >
              <option value="">Select an option</option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="logout">Logout</option>
            </select>
          </div>
        </div>

        {/* Event Test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Event Test</h2>
          <div className="space-x-4">
            <button 
              onClick={() => console.log("Console log test")}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              Console Log
            </button>
            <button 
              onClick={() => alert("Alert test")}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              Alert Test
            </button>
            <button 
              onMouseEnter={() => console.log("Mouse entered")}
              onMouseLeave={() => console.log("Mouse left")}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Hover Test
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
