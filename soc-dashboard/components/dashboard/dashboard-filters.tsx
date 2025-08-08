// "use client"

// import { useState } from "react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Calendar } from "@/components/ui/calendar"
// import { CalendarIcon, Filter, Save, Search } from 'lucide-react'
// import { format } from "date-fns"
// import type { DateRange } from "react-day-picker"

// const statusCodes = [
//   { id: "200", label: "200 (OK)", checked: true },
//   { id: "300", label: "3xx (Redirect)", checked: true },
//   { id: "400", label: "4xx (Client Error)", checked: true },
//   { id: "500", label: "5xx (Server Error)", checked: true },
// ]

// export function DashboardFilters() {
//   const [dateRange, setDateRange] = useState<DateRange | undefined>()
//   const [ipSearch, setIpSearch] = useState("")
//   const [uriSearch, setUriSearch] = useState("")
//   const [statusFilters, setStatusFilters] = useState(statusCodes)

//   const handleStatusChange = (id: string, checked: boolean) => {
//     setStatusFilters((prev) => prev.map((status) => (status.id === id ? { ...status, checked } : status)))
//   }

//   return (
//     <Card>
//       <CardContent className="pt-6">
//         <div className="flex flex-wrap items-center gap-4">
//           <div className="flex items-center gap-2">
//             <Filter className="h-4 w-4 text-muted-foreground" />
//             <span className="text-sm font-medium">Filters:</span>
//           </div>

//           {/* Date Range Picker */}
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button variant="outline" className="justify-start text-left font-normal bg-transparent">
//                 <CalendarIcon className="mr-2 h-4 w-4" />
//                 {dateRange?.from ? (
//                   dateRange.to ? (
//                     <>
//                       {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
//                     </>
//                   ) : (
//                     format(dateRange.from, "LLL dd, y")
//                   )
//                 ) : (
//                   <span>Pick a date range</span>
//                 )}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0" align="start">
//               <Calendar
//                 initialFocus
//                 mode="range"
//                 defaultMonth={dateRange?.from}
//                 selected={dateRange}
//                 onSelect={setDateRange}
//                 numberOfMonths={2}
//               />
//             </PopoverContent>
//           </Popover>

//           {/* Status Code Filters */}
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button variant="outline">
//                 Status Codes
//                 <span className="ml-2 text-xs text-muted-foreground">
//                   ({statusFilters.filter((s) => s.checked).length})
//                 </span>
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-64">
//               <div className="space-y-3">
//                 <Label className="text-sm font-medium">Status Codes</Label>
//                 {statusFilters.map((status) => (
//                   <div key={status.id} className="flex items-center space-x-2">
//                     <Checkbox
//                       id={status.id}
//                       checked={status.checked}
//                       onCheckedChange={(checked) => handleStatusChange(status.id, checked as boolean)}
//                     />
//                     <Label htmlFor={status.id} className="text-sm">
//                       {status.label}
//                     </Label>
//                   </div>
//                 ))}
//               </div>
//             </PopoverContent>
//           </Popover>

//           {/* IP Search */}
//           <div className="relative">
//             <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search IP..."
//               value={ipSearch}
//               onChange={(e) => setIpSearch(e.target.value)}
//               className="pl-8 w-32"
//             />
//           </div>

//           {/* URI Search */}
//           <div className="relative">
//             <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search URI..."
//               value={uriSearch}
//               onChange={(e) => setUriSearch(e.target.value)}
//               className="pl-8 w-32"
//             />
//           </div>

//           <div className="ml-auto flex items-center gap-2">
//             <Button variant="outline" size="sm">
//               <Save className="w-4 h-4 mr-2" />
//               Save View
//             </Button>
//             <Button size="sm">Apply Filters</Button>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
