"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertTriangle, Users, Globe, Activity, Clock } from 'lucide-react'
import type { LogEntry } from "@/lib/api"

interface MetricsCardsProps {
  logs: LogEntry[]
}

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

export function MetricsCards({ logs }: MetricsCardsProps) {
  const metrics = useMemo(() => {
    if (!logs.length) {
      return {
        totalRequests: 0,
        errorRate: 0,
        uniqueIPs: 0,
        anomalies: 0,
      }
    }

    const totalRequests = logs.length
    const errorRequests = logs.filter(log => log.status && log.status >= 400).length
    const errorRate = totalRequests > 0 ? (errorRequests / totalRequests) * 100 : 0
    const uniqueIPs = new Set(logs.map(log => log.ip).filter(Boolean)).size
    
    // Simple anomaly detection: high error rates from single IPs
    const ipErrorCounts = logs.reduce((acc, log) => {
      if (log.ip && log.status && log.status >= 400) {
        acc[log.ip] = (acc[log.ip] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)
    
    const anomalies = Object.values(ipErrorCounts).filter(count => count > 5).length

    return {
      totalRequests,
      errorRate: Number(errorRate.toFixed(1)),
      uniqueIPs,
      anomalies,
    }
  }, [logs])

  // Generate mock sparkline data based on actual logs
  const sparklineData = useMemo(() => {
    if (!logs.length) return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    
    // Group logs by hour for sparkline
    const hourlyData = new Array(12).fill(0)
    logs.forEach(log => {
      if (log.timestamp) {
        const hour = new Date(log.timestamp).getHours() % 12
        hourlyData[hour]++
      }
    })
    
    return hourlyData
  }, [logs])

  // Add to metrics calculation
const hourlyCounts = new Array(24).fill(0)
logs.forEach(log => {
  if (log.timestamp) {
    const hour = new Date(log.timestamp).getHours()
    hourlyCounts[hour]++
  }
})
const peakHour = hourlyCounts.indexOf(Math.max(...hourlyCounts))

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
              <div className="text-2xl font-bold">{metrics.totalRequests.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                From uploaded logs
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
              <div className="text-2xl font-bold">{metrics.errorRate}%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {metrics.errorRate > 5 ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-red-500" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
                )}
                4xx and 5xx responses
              </div>
            </div>
            <MiniSparkline 
              data={sparklineData.map(val => Math.floor(val * (metrics.errorRate / 100)))} 
              color="red" 
            />
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
              <div className="text-2xl font-bold">{metrics.uniqueIPs.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                Distinct IP addresses
              </div>
            </div>
            <MiniSparkline 
              data={sparklineData.map(val => Math.floor(val * 0.3))} 
              color="green" 
            />
          </div>
        </CardContent>
      </Card>

      {/* TODO: Add the correct anomalies. */}
      {/* <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Potential Threats</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{metrics.anomalies}</span>
                {metrics.anomalies > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    High
                  </Badge>
                )}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                {metrics.anomalies > 0 ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-red-500" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
                )}
                IPs with high error rates
              </div>
            </div>
            <MiniSparkline 
              data={sparklineData.map(() => Math.floor(Math.random() * 10))} 
              color="orange" 
            />
          </div>
        </CardContent>
      </Card> */}
      <Card className="transition-all duration-200 hover:shadow-md">
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">Peak Hour</CardTitle>
    <Clock className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="flex items-center justify-between">
      <div>
        <div className="text-2xl font-bold">{peakHour}:00</div>
        <div className="flex items-center text-xs text-muted-foreground">
          <TrendingUp className="mr-1 h-3 w-3 text-orange-500" />
          Highest traffic
        </div>
      </div>
    </div>
  </CardContent>
</Card>
    </div>
  )
}
