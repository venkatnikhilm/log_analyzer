"use client"

import { useState, useEffect } from "react"
import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs"
// import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { AIInsightsPanel } from "@/components/dashboard/ai-insights-panel"
import { UploadModal } from "@/components/uploads/upload-modal"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Upload, RefreshCw } from 'lucide-react'
import { apiClient, type FileUpload, type LogEntry, type AIInsight } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const [files, setFiles] = useState<FileUpload[]>([])
  const [selectedFile, setSelectedFile] = useState<FileUpload | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { toast } = useToast()

  // Load files on component mount
  useEffect(() => {
    loadFiles()
  }, [])

  // Load logs when selected file changes
  useEffect(() => {
    if (selectedFile) {
      loadLogs(selectedFile.file_hash)
    }
  }, [selectedFile])

  const loadFiles = async () => {
    try {
      const filesData = await apiClient.getFiles()
      setFiles(filesData)
      if (filesData.length > 0 && !selectedFile) {
        setSelectedFile(filesData[0])
      }
    } catch (error) {
      toast({
        title: "Error loading files",
        description: error instanceof Error ? error.message : "Failed to load files",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadLogs = async (fileHash: string) => {
    try {
      const logsData = await apiClient.getLogs(fileHash)
      setLogs(logsData)
    } catch (error) {
      toast({
        title: "Error loading logs",
        description: error instanceof Error ? error.message : "Failed to load logs",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = async (file: File) => {
    try {
      const uploadedFile = await apiClient.uploadFile(file)
      setFiles(prev => [uploadedFile, ...prev])
      setSelectedFile(uploadedFile)
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been processed and is ready for analysis.`,
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      })
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)
    try {
      const response = await apiClient.analyzeFile(selectedFile.file_hash)
      setInsights(response.insights)
      setAiPanelOpen(true)
      toast({
        title: "Analysis complete",
        description: `Found ${response.insights.length} insights for ${selectedFile.file_name}`,
      })
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to analyze file",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Log Analysis Dashboard</h1>
          <p className="text-muted-foreground">Analyze and monitor your Nginx access logs with AI-powered insights</p>
        </div>
        <div className="flex items-center gap-3">
          {files.length > 0 && (
            <Select
              value={selectedFile?.file_hash || ""}
              onValueChange={(value) => {
                const file = files.find((f) => f.file_hash === value)
                if (file) setSelectedFile(file)
              }}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select a file" />
              </SelectTrigger>
              <SelectContent>
                {files.map((file) => (
                  <SelectItem key={file.file_hash} value={file.file_hash}>
                    {file.file_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button onClick={() => setUploadModalOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Log
          </Button>
          <Button 
            onClick={handleAnalyze} 
            disabled={!selectedFile || isAnalyzing}
          >
            {isAnalyzing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Brain className="w-4 h-4 mr-2" />
            )}
            {isAnalyzing ? "Analyzing..." : "AI Insights"}
          </Button>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-12">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No files uploaded yet</h3>
          <p className="text-muted-foreground mb-4">Upload your first Nginx log file to get started with analysis</p>
          <Button onClick={() => setUploadModalOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Your First Log
          </Button>
        </div>
      ) : (
        <>
          {/* <DashboardFilters /> */}
          <MetricsCards logs={logs} />
          <DashboardTabs logs={logs} insights={insights} />
        </>
      )}

      <AIInsightsPanel 
        isOpen={aiPanelOpen} 
        onClose={() => setAiPanelOpen(false)} 
        insights={insights}
        fileName={selectedFile?.file_name || ""}
      />
      <UploadModal 
        isOpen={uploadModalOpen} 
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleFileUpload}
      />
    </div>
  )
}
