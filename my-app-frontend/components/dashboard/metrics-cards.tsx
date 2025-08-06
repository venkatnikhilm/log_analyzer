"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertTriangle, Users, Globe, Activity } from "lucide-react"

// Mock sparkline component
function MiniSparkline({ data, color = "blue" }: { data: number[]; color?: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  return (
    <div className="flex items-end h-8 space-x-0.5">
      {data.map((value, index) => (
        <div
          key={index}
          className={`w-1 bg-${color}-500 rounded-sm opacity-70`}
          style={{
            height: `${((value - min) / range) * 100}%`,
            minHeight: "2px",
          }}
        />
      ))}
    </div>
  )
}

const mockMetrics = {
  totalRequests: { value: 45672, change: 12.5, trend: "up" },
  errorRate: { value: 2.3, change: -0.8, trend: "down" },
  uniqueIPs: { value: 1234, change: 8.2, trend: "up" },
  anomalies: { value: 7, change: -2, trend: "down" },
}

const sparklineData = [12, 19, 15, 27, 32, 28, 35, 42, 38, 45, 52, 48]

export function MetricsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{mockMetrics.totalRequests.value.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />+{mockMetrics.totalRequests.change}% from last
                hour
              </div>
            </div>
            <MiniSparkline data={sparklineData} color="blue" />
          </div>
        </CardContent>
      </Card>

      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{mockMetrics.errorRate.value}%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
                {mockMetrics.errorRate.change}% from last hour
              </div>
            </div>
            <MiniSparkline data={[8, 6, 7, 5, 4, 3, 2, 3, 2, 1, 2, 1]} color="red" />
          </div>
        </CardContent>
      </Card>

      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unique IPs</CardTitle>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{mockMetrics.uniqueIPs.value.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />+{mockMetrics.uniqueIPs.change}% from last hour
              </div>
            </div>
            <MiniSparkline data={[20, 25, 22, 28, 32, 30, 35, 38, 36, 42, 45, 43]} color="green" />
          </div>
        </CardContent>
      </Card>

      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Anomalies Detected</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{mockMetrics.anomalies.value}</span>
                <Badge variant="destructive" className="text-xs">
                  High
                </Badge>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
                {mockMetrics.anomalies.change} from last hour
              </div>
            </div>
            <MiniSparkline data={[5, 8, 12, 7, 9, 6, 4, 7, 5, 3, 7, 4]} color="orange" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
