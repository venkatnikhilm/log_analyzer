"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle, Eye } from "lucide-react"


//TODO: Get real anomaly data.
// Mock anomaly data
const anomalies = [
  {
    id: "1",
    timestamp: "2024-01-15 14:23:45",
    ip: "192.168.1.100",
    user: "-",
    endpoint: "/admin/login",
    type: "Brute Force",
    confidence: 95,
    description: "Multiple failed login attempts from single IP",
    details: "15 failed login attempts in 2 minutes from IP 192.168.1.100",
  },
  {
    id: "2",
    timestamp: "2024-01-15 14:18:32",
    ip: "10.0.0.50",
    user: "admin",
    endpoint: "/api/users",
    type: "Data Exfiltration",
    confidence: 87,
    description: "Unusual large data transfer",
    details: "User downloaded 500MB of user data in single request",
  },
  {
    id: "3",
    timestamp: "2024-01-15 14:15:12",
    ip: "203.0.113.45",
    user: "-",
    endpoint: "/wp-admin/",
    type: "Directory Traversal",
    confidence: 78,
    description: "Attempted access to WordPress admin",
    details: "Multiple attempts to access WordPress admin on non-WordPress site",
  },
]

export function AnomalyTable() {
  const [selectedAnomaly, setSelectedAnomaly] = useState<(typeof anomalies)[0] | null>(null)

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) return <Badge variant="destructive">High</Badge>
    if (confidence >= 70) return <Badge variant="secondary">Medium</Badge>
    return <Badge variant="outline">Low</Badge>
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Detected Anomalies
          </CardTitle>
          <CardDescription>AI-powered threat detection results with confidence scores</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {anomalies.map((anomaly) => (
                <TableRow key={anomaly.id}>
                  <TableCell className="font-mono text-sm">{anomaly.timestamp}</TableCell>
                  <TableCell className="font-mono">{anomaly.ip}</TableCell>
                  <TableCell>{anomaly.user}</TableCell>
                  <TableCell className="font-mono">{anomaly.endpoint}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{anomaly.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getConfidenceBadge(anomaly.confidence)}
                      <span className="text-sm text-muted-foreground">{anomaly.confidence}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedAnomaly(anomaly)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedAnomaly} onOpenChange={() => setSelectedAnomaly(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Anomaly Details</DialogTitle>
            <DialogDescription>Detailed analysis of the detected security anomaly</DialogDescription>
          </DialogHeader>
          {selectedAnomaly && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <p className="text-sm text-muted-foreground">{selectedAnomaly.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Confidence</label>
                  <div className="flex items-center gap-2">
                    {getConfidenceBadge(selectedAnomaly.confidence)}
                    <span className="text-sm">{selectedAnomaly.confidence}%</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">IP Address</label>
                  <p className="text-sm text-muted-foreground font-mono">{selectedAnomaly.ip}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Timestamp</label>
                  <p className="text-sm text-muted-foreground font-mono">{selectedAnomaly.timestamp}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <p className="text-sm text-muted-foreground">{selectedAnomaly.description}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Details</label>
                <p className="text-sm text-muted-foreground">{selectedAnomaly.details}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
