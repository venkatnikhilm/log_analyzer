"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, AlertTriangle, TrendingUp, Shield, Info, ChevronRight } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { AIInsight } from "@/lib/api"
import { useState } from "react"

interface AIInsightsPanelProps {
  isOpen: boolean
  onClose: () => void
  insights: AIInsight[]
  fileName: string
}

export function AIInsightsPanel({ isOpen, onClose, insights, fileName }: AIInsightsPanelProps) {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null)

  const getInsightIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "threat":
      case "security":
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
    switch (severity.toLowerCase()) {
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

  // const threatCount = insights.filter(i => i.type.toLowerCase() === 'threat' || i.type.toLowerCase() === 'security').length
  // const anomalyCount = insights.filter(i => i.type.toLowerCase() === 'anomaly').length
  const threatCount = insights.filter(
    insight => ["high", "medium", "low"].includes(insight.severity?.toLowerCase())
  ).length

  return (
    
    // <Sheet open={isOpen} onOpenChange={onClose}>
    //   <SheetContent className="w-[600px] sm:max-w-[600px]">
    //     <SheetHeader>
    //       <SheetTitle className="flex items-center gap-2">
    //         <Brain className="h-5 w-5 text-purple-500" />
    //         AI Analysis
    //       </SheetTitle>
    //       <SheetDescription>
    //         AI-powered insights and threat detection for {fileName || 'uploaded file'}
    //       </SheetDescription>
    //     </SheetHeader>
    //     <div className="mt-6 space-y-4 overflow-y-auto pr-2 flex-1 max-h-[calc(100vh-120px)] scroll-smooth scrollbar-thin">
    //     <div className="mt-6 space-y-4">
    //       <div className="grid grid-cols-1 gap-4">
    //         <Card>
    //           <CardContent className="pt-4">
    //             <div className="text-2xl font-bold text-red-600">{threatCount}</div>
    //             <div className="text-sm text-muted-foreground">Threats Detected</div>
    //           </CardContent>
    //         </Card>
    //         {/* <Card>
    //           <CardContent className="pt-4">
    //             <div className="text-2xl font-bold text-orange-600">{anomalyCount}</div>
    //             <div className="text-sm text-muted-foreground">Anomalies Found</div>
    //           </CardContent>
    //         </Card> */}
    //       </div>

    //       <div className="space-y-3">
    //         <h3 className="text-lg font-semibold">Key Findings</h3>
    //         {insights.length === 0 ? (
    //           <Card>
    //             <CardContent className="pt-6 text-center">
    //               <Brain className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
    //               <p className="text-muted-foreground">No insights available yet. Upload and analyze a log file to see AI-powered security insights.</p>
    //             </CardContent>
    //           </Card>
    //         ) : (
    //           insights.map((insight, index) => (
    //             <Card
    //               key={index}
    //               className="transition-all duration-200 hover:shadow-md cursor-pointer"
    //               onClick={() => setSelectedInsight(selectedInsight === insight.title ? null : insight.title)}
    //             >
    //               <CardHeader className="pb-3">
    //                 <div className="flex items-start justify-between">
    //                   <div className="flex items-center gap-2">
    //                     {getInsightIcon(insight.type)}
    //                     <CardTitle className="text-sm">{insight.title}</CardTitle>
    //                   </div>
    //                   <div className="flex items-center gap-2">
    //                     {getSeverityBadge(insight.severity)}
    //                     <ChevronRight
    //                       className={`h-4 w-4 transition-transform ${
    //                         selectedInsight === insight.title ? "rotate-90" : ""
    //                       }`}
    //                     />
    //                   </div>
    //                 </div>
    //                 <CardDescription className="text-sm">{insight.description}</CardDescription>
    //               </CardHeader>

    //               {selectedInsight === insight.title && (
    //                 <CardContent className="pt-0 animate-in slide-in-from-top-2 duration-200">
    //                   <div className="space-y-3 border-t pt-3">
    //                     <div className="flex items-center gap-2">
    //                       <span className="text-sm font-medium">Confidence:</span>
    //                       {getConfidenceBadge(insight.confidence)}
    //                       <span className="text-sm text-muted-foreground">({insight.confidence}%)</span>
    //                       <TooltipProvider>
    //                         <Tooltip>
    //                           <TooltipTrigger>
    //                             <Info className="h-4 w-4 text-muted-foreground" />
    //                           </TooltipTrigger>
    //                           <TooltipContent className="max-w-xs">
    //                             <p className="text-sm">AI confidence level in this detection</p>
    //                           </TooltipContent>
    //                         </Tooltip>
    //                       </TooltipProvider>
    //                     </div>

    //                     <div>
    //                       <span className="text-sm font-medium">Type:</span>
    //                       <p className="text-sm text-muted-foreground mt-1 capitalize">{insight.type}</p>
    //                     </div>

    //                     <div>
    //                       <span className="text-sm font-medium">Recommendation:</span>
    //                       <p className="text-sm text-muted-foreground mt-1">{insight.recommendation}</p>
    //                     </div>

    //                     {insight.anomaly_logs && insight.anomaly_logs.length > 0 && (
    //                       <div>
    //                         <span className="text-sm font-medium">Affected Log Entries:</span>
    //                         <p className="text-sm text-muted-foreground mt-1">
    //                           {insight.anomaly_logs.length} log entries involved
    //                         </p>
    //                       </div>
    //                     )}
    //                   </div>
    //                 </CardContent>
    //               )}
    //             </Card>
    //           ))
    //         )}
    //       </div>

    //       {/* {insights.length > 0 && (
    //         <div className="pt-4 border-t">
    //           <Button className="w-full" variant="outline">
    //             Generate Detailed Report
    //           </Button>
    //         </div>
    //       )} */}
    //     </div>
    //     </div>.
    //   </SheetContent>
    // </Sheet>
    <Sheet open={isOpen} onOpenChange={onClose}>
  {/* Make the sheet fill height and use flex so children can grow */}
  <SheetContent className="flex h-full flex-col w-[600px] sm:max-w-[600px]">
    <SheetHeader className="shrink-0">
      <SheetTitle className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-purple-500" />
        AI Analysis
      </SheetTitle>
      <SheetDescription>
        AI-powered insights and threat detection for {fileName || "uploaded file"}
      </SheetDescription>
    </SheetHeader>

    {/* This is the ONLY scrollable container */}
    <div className="flex-1 overflow-y-auto pr-2 mt-6 space-y-4 scroll-smooth">
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-red-600">{threatCount}</div>
            <div className="text-sm text-muted-foreground">Threats Detected</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Key Findings</h3>
        {insights.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Brain className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No insights available yet. Upload and analyze a log file to see AI-powered security insights.
              </p>
            </CardContent>
          </Card>
        ) : (
          insights.map((insight) => (
            <Card
              key={insight.title}
              className="transition-all duration-200 hover:shadow-md cursor-pointer"
              onClick={() => setSelectedInsight(selectedInsight === insight.title ? null : insight.title)}
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
                      className={`h-4 w-4 transition-transform ${
                        selectedInsight === insight.title ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </div>
                <CardDescription className="text-sm">{insight.description}</CardDescription>
              </CardHeader>

              {selectedInsight === insight.title && (
                <CardContent className="pt-0 animate-in slide-in-from-top-2 duration-200">
                  {/* details... */}
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  </SheetContent>
</Sheet>

  )
}
