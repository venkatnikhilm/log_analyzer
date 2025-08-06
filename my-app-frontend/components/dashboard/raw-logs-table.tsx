"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

// Mock raw log data
const rawLogs = [
  {
    id: "1",
    timestamp: "2024-01-15 14:23:45",
    ip: "192.168.1.100",
    method: "POST",
    uri: "/admin/login",
    status: 403,
    bytes: 1234,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    referer: "-",
  },
  {
    id: "2",
    timestamp: "2024-01-15 14:23:44",
    ip: "192.168.1.100",
    method: "POST",
    uri: "/admin/login",
    status: 403,
    bytes: 1234,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    referer: "-",
  },
  {
    id: "3",
    timestamp: "2024-01-15 14:23:43",
    ip: "10.0.0.25",
    method: "GET",
    uri: "/api/internal/server-status",
    status: 500,
    bytes: 2048,
    userAgent: "curl/7.68.0",
    referer: "-",
  },
  {
    id: "4",
    timestamp: "2024-01-15 14:23:42",
    ip: "203.0.113.45",
    method: "GET",
    uri: "/wp-admin/admin.php",
    status: 404,
    bytes: 512,
    userAgent: "Mozilla/5.0 (compatible; scanner)",
    referer: "-",
  },
  {
    id: "5",
    timestamp: "2024-01-15 14:23:41",
    ip: "10.0.0.15",
    method: "GET",
    uri: "/dashboard",
    status: 200,
    bytes: 4096,
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    referer: "https://example.com/",
  },
]

export function RawLogsTable() {
  const getRowColor = (status: number, uri: string) => {
    if (status === 403 && uri.includes("/admin"))
      return "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
    if (status >= 500) return "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800"
    if (status === 404 && (uri.includes("wp-") || uri.includes("admin")))
      return "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800"
    return ""
  }

  const getStatusBadge = (status: number) => {
    if (status >= 500) return <Badge variant="destructive">{status}</Badge>
    if (status >= 400) return <Badge variant="secondary">{status}</Badge>
    if (status >= 300) return <Badge variant="outline">{status}</Badge>
    return (
      <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
        {status}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Raw Access Logs</CardTitle>
        <CardDescription>Color-coded log entries with virtual scrolling support</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border max-h-96 overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>URI</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Bytes</TableHead>
                <TableHead>User Agent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rawLogs.map((log) => (
                <TableRow key={log.id} className={cn("transition-colors", getRowColor(log.status, log.uri))}>
                  <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                  <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {log.method}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm max-w-xs truncate">{log.uri}</TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                  <TableCell className="text-sm">{log.bytes.toLocaleString()}</TableCell>
                  <TableCell className="max-w-xs truncate text-xs text-muted-foreground">{log.userAgent}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
