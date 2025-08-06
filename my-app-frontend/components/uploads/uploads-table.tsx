"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, MoreHorizontal, Trash2, Download, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

// Mock uploads data
const uploads = [
  {
    id: "1",
    filename: "nginx-access-2024-01.log",
    uploadDate: "2024-01-15 10:30:00",
    fileSize: "2.4 MB",
    status: "Parsed",
    recordCount: 15420,
    errorCount: 23,
    anomalyCount: 5,
  },
  {
    id: "2",
    filename: "nginx-access-2024-02.log",
    uploadDate: "2024-02-10 14:22:15",
    fileSize: "3.1 MB",
    status: "Parsed",
    recordCount: 18750,
    errorCount: 45,
    anomalyCount: 12,
  },
  {
    id: "3",
    filename: "nginx-access-2024-03.log",
    uploadDate: "2024-03-05 09:15:30",
    fileSize: "1.8 MB",
    status: "Pending",
    recordCount: 0,
    errorCount: 0,
    anomalyCount: 0,
  },
  {
    id: "4",
    filename: "nginx-error-2024-01.log",
    uploadDate: "2024-01-20 16:45:22",
    fileSize: "512 KB",
    status: "Error",
    recordCount: 0,
    errorCount: 0,
    anomalyCount: 0,
  },
]

export function UploadsTable() {
  const router = useRouter()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Parsed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Parsed</Badge>
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>
      case "Error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleView = (uploadId: string) => {
    router.push(`/dashboard?upload=${uploadId}`)
  }

  const handleDownload = (filename: string) => {
    console.log("Downloading:", filename)
    // Mock download functionality
  }

  const handleDelete = (uploadId: string, filename: string) => {
    console.log("Deleting:", uploadId, filename)
    // Mock delete functionality
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Recent Uploads
        </CardTitle>
        <CardDescription>Manage your uploaded log files and view processing status</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Filename</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Records</TableHead>
              <TableHead>Errors</TableHead>
              <TableHead>Anomalies</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uploads.map((upload) => (
              <TableRow key={upload.id}>
                <TableCell className="font-medium">{upload.filename}</TableCell>
                <TableCell className="font-mono text-sm">{upload.uploadDate}</TableCell>
                <TableCell>{upload.fileSize}</TableCell>
                <TableCell>{getStatusBadge(upload.status)}</TableCell>
                <TableCell>{upload.status === "Parsed" ? upload.recordCount.toLocaleString() : "-"}</TableCell>
                <TableCell>{upload.status === "Parsed" ? upload.errorCount : "-"}</TableCell>
                <TableCell>
                  {upload.status === "Parsed" && upload.anomalyCount > 0 ? (
                    <Badge variant="destructive">{upload.anomalyCount}</Badge>
                  ) : upload.status === "Parsed" ? (
                    "0"
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(upload.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Analysis
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(upload.filename)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(upload.id, upload.filename)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
