"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, ArrowRight, Flame, BarChart3, Globe2 } from "lucide-react"
import Link from "next/link"

interface TrendingTopic {
  topic: string
  mentions: number
  growth: string
  category: string
  articles: number
}

export default function TrendingPage() {
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching trending data
    setTimeout(() => {
      setTrendingTopics([
        { topic: "AI developments", mentions: 1247, growth: "+23%", category: "Technology", articles: 89 },
        { topic: "Tesla updates", mentions: 892, growth: "+18%", category: "Business", articles: 67 },
        { topic: "Climate change", mentions: 756, growth: "+15%", category: "Science", articles: 54 },
        { topic: "Crypto market", mentions: 634, growth: "+12%", category: "Business", articles: 43 },
        { topic: "Space exploration", mentions: 523, growth: "+9%", category: "Science", articles: 38 },
        { topic: "Apple news", mentions: 467, growth: "+7%", category: "Technology", articles: 32 },
        { topic: "Movie releases", mentions: 389, growth: "+5%", category: "Entertainment", articles: 28 },
        { topic: "Tech earnings", mentions: 312, growth: "+3%", category: "Business", articles: 24 },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getCategoryColor = (category: string) => {
    const colors = {
      Technology: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      Entertainment: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      Business: "bg-green-500/10 text-green-400 border-green-500/20",
      Science: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    }
    return colors[category as keyof typeof colors] || "bg-gray-500/10 text-gray-400 border-gray-500/20"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-6 h-6 text-orange-400" />
            <h1 className="text-3xl font-bold text-white">Trending Topics</h1>
          </div>
          <p className="text-gray-400 text-lg">Discover what's making headlines across the globe right now</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Total Mentions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">5,220</div>
              <div className="text-sm text-green-400">+12% from yesterday</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Active Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">127</div>
              <div className="text-sm text-blue-400">Across all categories</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Globe2 className="w-5 h-5 text-purple-400" />
                Global Reach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">60+</div>
              <div className="text-sm text-purple-400">News sources</div>
            </CardContent>
          </Card>
        </div>

        {/* Trending Topics List */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Top Trending Topics
            </CardTitle>
            <CardDescription className="text-gray-400">
              Updated every 15 minutes • Last update: {new Date().toLocaleTimeString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-white/5 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {trendingTopics.map((topic, index) => (
                  <div
                    key={topic.topic}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white font-bold">
                        {index + 1}
                      </div>

                      <div>
                        <h3 className="text-white font-medium group-hover:text-purple-300 transition-colors">
                          {topic.topic}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getCategoryColor(topic.category)}>{topic.category}</Badge>
                          <span className="text-gray-400 text-sm">{topic.articles} articles</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-white font-medium">{topic.mentions.toLocaleString()}</div>
                        <div className="text-green-400 text-sm">{topic.growth}</div>
                      </div>

                      <Link href={`/?query=${encodeURIComponent(topic.topic)}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link href="/categories">
            <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white">
              Browse by Category
            </Button>
          </Link>
          <Link href="/">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
              Search Custom Topic
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
