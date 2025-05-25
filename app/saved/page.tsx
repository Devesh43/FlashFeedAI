"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, Search, Trash2, ExternalLink, Calendar, Tag, Filter } from "lucide-react"

interface SavedArticle {
  id: string
  title: string
  summary: string
  source: string
  category: string
  savedDate: string
  url: string
  tags: string[]
}

export default function SavedPage() {
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading saved articles
    setTimeout(() => {
      setSavedArticles([
        {
          id: "1",
          title: "AI Breakthrough in Natural Language Processing",
          summary: "Researchers have developed a new AI model that can understand context better than ever before...",
          source: "TechCrunch",
          category: "Technology",
          savedDate: "2024-01-15",
          url: "https://example.com/ai-breakthrough",
          tags: ["AI", "Machine Learning", "NLP"],
        },
        {
          id: "2",
          title: "Tesla's New Battery Technology Promises 1000-Mile Range",
          summary:
            "Tesla announces revolutionary battery technology that could change the electric vehicle industry...",
          source: "Reuters",
          category: "Business",
          savedDate: "2024-01-14",
          url: "https://example.com/tesla-battery",
          tags: ["Tesla", "Electric Vehicles", "Battery"],
        },
        {
          id: "3",
          title: "Climate Change Impact on Global Food Security",
          summary: "New study reveals how climate change is affecting agricultural productivity worldwide...",
          source: "BBC News",
          category: "Science",
          savedDate: "2024-01-13",
          url: "https://example.com/climate-food",
          tags: ["Climate Change", "Agriculture", "Food Security"],
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredArticles = savedArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...Array.from(new Set(savedArticles.map((article) => article.category)))]

  const getCategoryColor = (category: string) => {
    const colors = {
      Technology: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      Business: "bg-green-500/10 text-green-400 border-green-500/20",
      Science: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      Entertainment: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    }
    return colors[category as keyof typeof colors] || "bg-gray-500/10 text-gray-400 border-gray-500/20"
  }

  const removeArticle = (id: string) => {
    setSavedArticles((articles) => articles.filter((article) => article.id !== id))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-6 h-6 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Saved Articles</h1>
          </div>
          <p className="text-gray-400 text-lg">Your personal collection of important news and insights</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search saved articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 focus:border-purple-500/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-md px-3 py-2 focus:border-purple-500/50 focus:outline-none"
              >
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-gray-900">
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg">Total Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{savedArticles.length}</div>
              <div className="text-sm text-gray-400">Articles in your collection</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{categories.length - 1}</div>
              <div className="text-sm text-gray-400">Different categories</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">3</div>
              <div className="text-sm text-gray-400">Articles saved</div>
            </CardContent>
          </Card>
        </div>

        {/* Articles List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-white/10 rounded w-3/4"></div>
                    <div className="h-3 bg-white/10 rounded w-full"></div>
                    <div className="h-3 bg-white/10 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-white text-lg font-medium mb-2">No saved articles found</h3>
              <p className="text-gray-400 mb-4">
                {searchQuery || selectedCategory !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Start saving articles to build your personal news collection"}
              </p>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                Explore News
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredArticles.map((article) => (
              <Card
                key={article.id}
                className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-200"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-white font-medium text-lg mb-2 line-clamp-2">{article.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">{article.summary}</p>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span>Saved {new Date(article.savedDate).toLocaleDateString()}</span>
                        </div>
                        <Badge variant="outline" className="border-white/20 text-gray-300">
                          {article.source}
                        </Badge>
                        <Badge className={getCategoryColor(article.category)}>{article.category}</Badge>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Tag className="w-3 h-3 text-gray-400" />
                        {article.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="border-white/10 text-gray-400 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                      >
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArticle(article.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
