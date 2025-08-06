"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Brush } from "recharts"

// Mock timeline data
const timelineData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i.toString().padStart(2, "0")}:00`,
  requests: Math.floor(Math.random() * 1000) + 500,
  errors: Math.floor(Math.random() * 50) + 10,
}))

export function TimelineChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Timeline</CardTitle>
        <CardDescription>Requests per hour over the last 24 hours with zoom brush control</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs fill-muted-foreground" />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Line
                type="monotone"
                dataKey="requests"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                name="Requests"
              />
              <Line
                type="monotone"
                dataKey="errors"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                dot={false}
                name="Errors"
              />
              <Brush dataKey="time" height={30} stroke="hsl(var(--primary))" fill="hsl(var(--muted))" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
