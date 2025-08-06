"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, AlertTriangle, TrendingUp, Shield, Info, ChevronRight } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AIInsightsPanelProps {
  isOpen: boolean
  onClose: () => void
  uploadId: string
}

// Mock AI insights data
const aiInsights = [
  {
    id: "1",
    type: "threat",
    title: "Brute Force Attack Detected",
    description: "20× failed login attempts on /admin endpoint from IP 192.168.1.100",
    confidence: 95,
    severity: "high",
    rationale:
      "Multiple consecutive failed authentication attempts from single source IP within 2-minute window indicates automated brute force attack pattern.",
    recommendation: "Implement IP-based rate limiting and consider blocking the source IP.",
  },
  {
    id: "2",
    type: "anomaly",
    title: "Unusual Traffic Spike",
    description: "300% increase in requests during off-hours (2-4 AM)",
    confidence: 78,
    severity: "medium",
    rationale: "Traffic pattern deviates significantly from historical baseline during typically low-activity hours.",
    recommendation: "Investigate source of traffic spike and verify legitimacy of requests.",
  },
  {
    id: "3",
    type: "vulnerability",
    title: "Directory Traversal Attempts",
    description: "15 attempts to access WordPress admin on non-WordPress site",
    confidence: 87,
    severity: "medium",
    rationale:
      "Automated scanning tools attempting to access common CMS admin interfaces suggests reconnaissance activity.",
    recommendation: "Ensure proper input validation and consider implementing web application firewall rules.",
  },
  {
    id: "4",
    type: "performance",
    title: "High Error Rate",
    description: "12% of requests returning 5xx errors in last hour",
    confidence: 92,
    severity: "high",
    rationale: "Error rate significantly exceeds normal baseline of 2-3%, indicating potential system issues.",
    recommendation: "Check server resources and application logs for underlying issues.",
  },
]

export function AIInsightsPanel({ isOpen, onClose, uploadId }: AIInsightsPanelProps) {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null)

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "threat":
        return <Shield className="h-4 w-4 text-red-500" />
      case "anomaly":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "vulnerability":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "performance":
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge variant="secondary">Medium</Badge>
      case "low":
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90)
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">High</Badge>
    if (confidence >= 70) return <Badge variant="secondary">Medium</Badge>
    return <Badge variant="outline">Low</Badge>
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            AI Analysis
          </SheetTitle>
          <SheetDescription>AI-powered insights and threat detection for upload {uploadId}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-red-600">4</div>
                <div className="text-sm text-muted-foreground">Threats Detected</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-orange-600">7</div>
                <div className="text-sm text-muted-foreground">Anomalies Found</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Key Findings</h3>
            {aiInsights.map((insight) => (
              <Card
                key={insight.id}
                className="transition-all duration-200 hover:shadow-md cursor-pointer"
                onClick={() => setSelectedInsight(selectedInsight === insight.id ? null : insight.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getInsightIcon(insight.type)}
                      <CardTitle className="text-sm">{insight.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      {getSeverityBadge(insight.severity)}
                      <ChevronRight
                        className={`h-4 w-4 transition-transform ${selectedInsight === insight.id ? "rotate-90" : ""}`}
                      />
                    </div>
                  </div>
                  <CardDescription className="text-sm">{insight.description}</CardDescription>
                </CardHeader>

                {selectedInsight === insight.id && (
                  <CardContent className="pt-0 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-3 border-t pt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Confidence:</span>
                        {getConfidenceBadge(insight.confidence)}
                        <span className="text-sm text-muted-foreground">({insight.confidence}%)</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p className="text-sm">{insight.rationale}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      <div>
                        <span className="text-sm font-medium">AI Rationale:</span>
                        <p className="text-sm text-muted-foreground mt-1">{insight.rationale}</p>
                      </div>

                      <div>
                        <span className="text-sm font-medium">Recommendation:</span>
                        <p className="text-sm text-muted-foreground mt-1">{insight.recommendation}</p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          <div className="pt-4 border-t">
            <Button className="w-full bg-transparent" variant="outline">
              Generate Detailed Report
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
