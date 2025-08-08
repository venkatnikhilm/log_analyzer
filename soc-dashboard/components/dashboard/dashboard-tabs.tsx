// "use client"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { TimelineChart } from "./timeline-chart"
// import { AnomalyTable } from "./anomaly-table"
// import { RawLogsTable } from "./raw-logs-table"

// export function DashboardTabs() {
//   return (
//     <Tabs defaultValue="timeline" className="space-y-4">
//       <TabsList className="grid w-full grid-cols-2">
//         <TabsTrigger value="timeline">Timeline</TabsTrigger>
//         <TabsTrigger value="raw-logs">Raw Logs</TabsTrigger>
//       </TabsList>

//       <TabsContent value="timeline" className="space-y-4">
//         <TimelineChart />
//       </TabsContent>

//       {/* <TabsContent value="anomalies" className="space-y-4">
//         <AnomalyTable />
//       </TabsContent> */}

//       <TabsContent value="raw-logs" className="space-y-4">
//         <RawLogsTable />
//       </TabsContent>
//     </Tabs>
//   )
// }
"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimelineChart } from "./timeline-chart"
// import { AnomalyTable } from "./anomaly-table"
import { RawLogsTable } from "./raw-logs-table"
import type { LogEntry, AIInsight } from "@/lib/api"

interface DashboardTabsProps {
  logs: LogEntry[]
  insights: AIInsight[]
}

export function DashboardTabs({ logs, insights }: DashboardTabsProps) {
  return (
    <Tabs defaultValue="timeline" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">

        {/* <TabsTrigger value="anomalies">Anomalies</TabsTrigger> */}
        <TabsTrigger value="raw-logs">Raw Logs</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
      </TabsList>


      {/* <TabsContent value="anomalies" className="space-y-4">
        <AnomalyTable />
      </TabsContent> */}

      <TabsContent value="raw-logs" className="space-y-4">
        <RawLogsTable logs={logs} />
      </TabsContent>


      <TabsContent value="timeline" className="space-y-4">
        <TimelineChart logs={logs}/>
      </TabsContent>
    </Tabs>
  )
}