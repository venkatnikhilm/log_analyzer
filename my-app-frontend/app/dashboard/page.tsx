"use client"

import { useState } from "react"
import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs"
import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { AIInsightsPanel } from "@/components/dashboard/ai-insights-panel"
import { UploadModal } from "@/components/uploads/upload-modal"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Upload } from 'lucide-react'

// Mock data for uploads
const mockUploads = [
  { id: "1", filename: "nginx-access-2024-01.log", date: "2024-01-15", status: "Parsed" },
  { id: "2", filename: "nginx-access-2024-02.log", date: "2024-02-10", status: "Parsed" },
  { id: "3", filename: "nginx-access-2024-03.log", date: "2024-03-05", status: "Pending" },
]

export default function DashboardPage() {
  const [selectedUpload, setSelectedUpload] = useState(mockUploads[0])
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Log Analysis Dashboard</h1>
          <p className="text-muted-foreground">Analyze and monitor your Nginx access logs with AI-powered insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={selectedUpload.id}
            onValueChange={(value) => {
              const upload = mockUploads.find((u) => u.id === value)
              if (upload) setSelectedUpload(upload)
            }}
          >
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mockUploads.map((upload) => (
                <SelectItem key={upload.id} value={upload.id}>
                  {upload.filename}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setUploadModalOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Log
          </Button>
          <Button onClick={() => setAiPanelOpen(true)}>
            <Brain className="w-4 h-4 mr-2" />
            AI Insights
          </Button>
        </div>
      </div>

      <DashboardFilters />
      <MetricsCards />
      <DashboardTabs />

      <AIInsightsPanel isOpen={aiPanelOpen} onClose={() => setAiPanelOpen(false)} uploadId={selectedUpload.id} />
      <UploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
    </div>
  )
}
