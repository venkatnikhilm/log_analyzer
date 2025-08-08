"use client"

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Types based on your backend models
export interface User {
  id: number
  username: string
  email: string
  created_at: string
}

export interface FileUpload {
  file_hash: string
  user_id: number
  file_name: string
  file_size: number
  uploaded_at: string
}

export interface LogEntry {
  id: number
  file_hash: string
  timestamp: string
  ip: string | null
  method: string | null
  uri: string | null
  status: number | null
  bytes: number | null
  user_agent: string | null
  referer: string | null
}

export interface AIInsight {
  type: string
  title: string
  description: string
  severity: string
  recommendation: string
  confidence: number
  anomaly_logs: number[]
}

export interface AIInsightResponse {
  insights: AIInsight[]
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

// API client class
class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token')
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    return response.json()
  }

  // Auth methods
  async register(username: string, email: string, password: string): Promise<User> {
    return this.request<User>('/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    })
  }

  async login(email: string, password: string): Promise<TokenResponse> {
    const response = await this.request<TokenResponse>('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    })
    
    this.setToken(response.access_token)
    return response
  }

  // File methods
  async uploadFile(file: File): Promise<FileUpload> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${this.baseURL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    return response.json()
  }

  async getFiles(): Promise<FileUpload[]> {
    return this.request<FileUpload[]>('/files')
  }

  async getLogs(fileHash: string): Promise<LogEntry[]> {
    return this.request<LogEntry[]>('/logs', {
      method: 'POST',
      body: JSON.stringify({ file_hash: fileHash }),
    })
  }

  async analyzeFile(fileHash: string): Promise<AIInsightResponse> {
    return this.request<AIInsightResponse>('/analyse', {
      method: 'POST',
      body: JSON.stringify({ file_hash: fileHash }),
    })
  }

  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health')
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL)
