"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimelineChart } from "./timeline-chart"
import { AnomalyTable } from "./anomaly-table"
import { RawLogsTable } from "./raw-logs-table"

export function DashboardTabs() {
  return (
    <Tabs defaultValue="timeline" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
        <TabsTrigger value="raw-logs">Raw Logs</TabsTrigger>
      </TabsList>

      <TabsContent value="timeline" className="space-y-4">
        <TimelineChart />
      </TabsContent>

      <TabsContent value="anomalies" className="space-y-4">
        <AnomalyTable />
      </TabsContent>

      <TabsContent value="raw-logs" className="space-y-4">
        <RawLogsTable />
      </TabsContent>
    </Tabs>
  )
}
