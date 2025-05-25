"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  Search,
  Zap,
  TrendingUp,
  Globe2,
  Sparkles,
  ArrowRight,
  BarChart3,
  Users,
  Newspaper,
} from "lucide-react"
import Link from "next/link"

interface NewsArticle {
  title: string
  summary: string
  link: string
  source: string
  pubDate: string
  category: string
  relevanceScore: number
}

interface SearchResult {
  answer: string
  sources: NewsArticle[]
  query: string
  meta?: {
    totalArticles: number
    relevantArticles: number
    processingTime: number
    sources: string[]
    avgRelevanceScore: number
    totalSources: number
  }
}

export default function HomePage() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [newsCount, setNewsCount] = useState(0)
  const [lastUpdate, setLastUpdate] = useState<string>("")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    fetchNewsStatus()
    const interval = setInterval(fetchNewsStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchNewsStatus = async () => {
    try {
      const response = await fetch("/api/news-status")
      const data = await response.json()
      setNewsCount(data.count)
      setLastUpdate(data.lastUpdate)
    } catch (error) {
      console.error("Failed to fetch news status:", error)
    }
  }

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/search-news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query.trim() }),
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text()
        throw new Error(`Server returned ${response.status}: ${textResponse.substring(0, 200)}`)
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${data.details || "Unknown error"}`)
      }

      setResult(data)
    } catch (error) {
      console.error("❌ Search failed:", error)

      let errorMessage = "An unexpected error occurred"

      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === "string") {
        errorMessage = error
      }

      if (errorMessage.includes("Failed to fetch")) {
        errorMessage = "Network error: Unable to connect to the server. Please check your connection and try again."
      } else if (errorMessage.includes("JSON")) {
        errorMessage = "Server error: Invalid response format. Please try again in a moment."
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Technology: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      Entertainment: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      Business: "bg-green-500/10 text-green-400 border-green-500/20",
      Sports: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      Health: "bg-red-500/10 text-red-400 border-red-500/20",
      Science: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      World: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      General: "bg-gray-500/10 text-gray-400 border-gray-500/20",
      Gaming: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      Lifestyle: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    }
    return colors[category as keyof typeof colors] || "bg-gray-500/10 text-gray-400 border-gray-500/20"
  }

  const trendingTopics = [
    "AI developments",
    "Tesla updates",
    "Apple news",
    "Crypto market",
    "Space exploration",
    "Climate change",
    "Tech earnings",
    "Movie releases",
  ]

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Analysis",
      description: "Advanced AI analyzes news from 60+ sources to give you comprehensive insights",
      color: "text-purple-400",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Get instant analysis of breaking news as it happens worldwide",
      color: "text-yellow-400",
    },
    {
      icon: BarChart3,
      title: "Smart Insights",
      description: "Understand trends, implications, and connections across different topics",
      color: "text-blue-400",
    },
    {
      icon: Globe2,
      title: "Global Coverage",
      description: "News from major outlets worldwide including BBC, CNN, Reuters, and more",
      color: "text-green-400",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-6 h-6 text-purple-400 mr-2" />
            <span className="text-purple-300 font-medium">AI-Powered News Analysis</span>
          </div>

          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-6">
            Get Instant News Insights
          </h1>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Search any topic and get comprehensive AI analysis combining real-time news feeds with web intelligence
          </p>

          {/* Search Section */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search any topic for instant AI analysis..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-16 pl-6 pr-32 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-2xl"
                disabled={loading}
              />
              <Button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className="absolute right-2 top-2 h-12 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
            </div>

            {/* Trending Topics */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-3">Trending searches:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {trendingTopics.map((topic) => (
                  <Badge
                    key={topic}
                    variant="outline"
                    className="cursor-pointer hover:bg-white/10 border-white/20 text-gray-300 transition-all hover:border-purple-500/50 hover:scale-105"
                    onClick={() => setQuery(topic)}
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display - Right after search */}
      {error && (
        <div className="container mx-auto px-4 mb-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 backdrop-blur-sm">
              <p className="text-red-400">
                <strong>Error:</strong> {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results Section - Right after search */}
      {result && (
        <div className="container mx-auto px-4 pb-8">
          <div className="max-w-4xl mx-auto">
            {/* AI Analysis */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-8 rounded-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2 text-xl">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      AI Analysis: "{result.query}"
                    </CardTitle>
                    <CardDescription className="text-gray-400 mt-2">
                      Comprehensive analysis from {result.meta?.totalSources || "60+"} news sources and web intelligence
                    </CardDescription>
                  </div>
                  {result.meta && (
                    <div className="text-right text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>{result.meta.relevantArticles} relevant</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Zap className="w-3 h-3" />
                        <span>{result.meta.processingTime}ms</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-200 leading-relaxed space-y-6 text-lg">
                    {result.answer.split("\n\n").map((paragraph, index) => (
                      <p key={index} className="text-gray-200 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Source Articles */}
            {result.sources && result.sources.length > 0 && (
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 rounded-2xl mb-8">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe2 className="w-5 h-5" />
                    Related Articles ({result.sources.length})
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Source articles from {result.meta?.sources?.length || 0} different news outlets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {result.sources.slice(0, 10).map((article, index) => (
                      <div
                        key={index}
                        className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 hover:scale-[1.02]"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h4 className="font-medium text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
                              {article.title}
                            </h4>
                            <p className="text-gray-400 text-sm mb-3 line-clamp-3">{article.summary}</p>
                            <div className="flex items-center gap-2 text-xs flex-wrap">
                              <Badge variant="outline" className="border-white/20 text-gray-300">
                                {article.source}
                              </Badge>
                              <Badge className={getCategoryColor(article.category)}>{article.category}</Badge>
                              <span className="text-gray-500">{article.pubDate}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-xl"
                          >
                            <a href={article.link} target="_blank" rel="noopener noreferrer">
                              <ArrowRight className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Stats - Only show when no results */}
      {!result && (
        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-16">
              <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-3xl font-bold text-white mb-2">{newsCount || "60+"}+</div>
                <div className="text-sm text-gray-400">News Sources</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-3xl font-bold text-white mb-2">AI</div>
                <div className="text-sm text-gray-400">Powered Analysis</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-3xl font-bold text-white mb-2">Real-time</div>
                <div className="text-sm text-gray-400">Response Time</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 justify-center mb-16">
              <Link href="/trending">
                <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Trending
                </Button>
              </Link>
              <Link href="/categories">
                <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white">
                  <Newspaper className="w-4 h-4 mr-2" />
                  Browse Categories
                </Button>
              </Link>
              <Link href="/saved">
                <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white">
                  <Users className="w-4 h-4 mr-2" />
                  My Saved Articles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Features Section - Only show when no results */}
      {!result && (
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Why Choose Flash Feed?</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Experience the future of news consumption with our AI-powered platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card
                    key={index}
                    className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                  >
                    <CardHeader>
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4`}
                      >
                        <Icon className={`w-6 h-6 ${feature.color}`} />
                      </div>
                      <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
