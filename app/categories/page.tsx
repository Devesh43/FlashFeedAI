"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Laptop,
  Gamepad2,
  Briefcase,
  Globe,
  Heart,
  Atom,
  Trophy,
  Clapperboard,
  Palette,
  ArrowRight,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

interface Category {
  name: string
  icon: any
  description: string
  articleCount: number
  trending: string[]
  color: string
  bgColor: string
}

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories: Category[] = [
    {
      name: "Technology",
      icon: Laptop,
      description: "Latest in AI, software, hardware, and digital innovation",
      articleCount: 1247,
      trending: ["AI developments", "Apple news", "Tech earnings"],
      color: "text-blue-400",
      bgColor: "bg-blue-500/10 border-blue-500/20",
    },
    {
      name: "Business",
      icon: Briefcase,
      description: "Market trends, corporate news, and economic insights",
      articleCount: 892,
      trending: ["Tesla updates", "Crypto market", "Stock market"],
      color: "text-green-400",
      bgColor: "bg-green-500/10 border-green-500/20",
    },
    {
      name: "Entertainment",
      icon: Clapperboard,
      description: "Movies, TV shows, celebrity news, and pop culture",
      articleCount: 756,
      trending: ["Movie releases", "Netflix shows", "Celebrity news"],
      color: "text-purple-400",
      bgColor: "bg-purple-500/10 border-purple-500/20",
    },
    {
      name: "Sports",
      icon: Trophy,
      description: "Latest scores, player news, and sports analysis",
      articleCount: 634,
      trending: ["NFL playoffs", "NBA trades", "Soccer transfers"],
      color: "text-orange-400",
      bgColor: "bg-orange-500/10 border-orange-500/20",
    },
    {
      name: "Science",
      icon: Atom,
      description: "Scientific discoveries, research, and breakthroughs",
      articleCount: 523,
      trending: ["Space exploration", "Climate change", "Medical research"],
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      name: "Health",
      icon: Heart,
      description: "Medical news, wellness tips, and health research",
      articleCount: 467,
      trending: ["Mental health", "Nutrition studies", "Medical breakthroughs"],
      color: "text-red-400",
      bgColor: "bg-red-500/10 border-red-500/20",
    },
    {
      name: "World",
      icon: Globe,
      description: "International news, politics, and global events",
      articleCount: 389,
      trending: ["International relations", "Elections", "Global economy"],
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10 border-yellow-500/20",
    },
    {
      name: "Gaming",
      icon: Gamepad2,
      description: "Video game news, reviews, and industry updates",
      articleCount: 312,
      trending: ["New releases", "Gaming hardware", "Esports"],
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10 border-indigo-500/20",
    },
    {
      name: "Lifestyle",
      icon: Palette,
      description: "Fashion, travel, food, and lifestyle trends",
      articleCount: 245,
      trending: ["Fashion trends", "Travel destinations", "Food culture"],
      color: "text-pink-400",
      bgColor: "bg-pink-500/10 border-pink-500/20",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">News Categories</h1>
          <p className="text-gray-400 text-lg">Explore news by category and discover trending topics in each area</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            const isSelected = selectedCategory === category.name

            return (
              <Card
                key={category.name}
                className={`bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer ${
                  isSelected ? "ring-2 ring-purple-500/50" : ""
                }`}
                onClick={() => setSelectedCategory(isSelected ? null : category.name)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl ${category.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${category.color}`} />
                    </div>
                    <Badge variant="outline" className="border-white/20 text-gray-300">
                      {category.articleCount}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-lg">{category.name}</CardTitle>
                  <CardDescription className="text-gray-400">{category.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <TrendingUp className="w-4 h-4" />
                      <span>Trending now:</span>
                    </div>

                    <div className="space-y-2">
                      {category.trending.map((topic, index) => (
                        <div key={topic} className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">{topic}</span>
                          <Link href={`/?query=${encodeURIComponent(topic)}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>

                    <Link href={`/?query=${encodeURIComponent(category.name + " news")}`}>
                      <Button
                        className="w-full mt-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-white border border-white/10"
                        variant="outline"
                      >
                        Explore {category.name}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg">Total Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {categories.reduce((sum, cat) => sum + cat.articleCount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Across all categories</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{categories.length}</div>
              <div className="text-sm text-gray-400">News categories available</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg">Updated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Live</div>
              <div className="text-sm text-gray-400">Real-time updates</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
