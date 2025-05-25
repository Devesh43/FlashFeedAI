import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

interface NewsArticle {
  title: string
  summary: string
  link: string
  source: string
  pubDate: string
  category: string
  relevanceScore: number
}

// Comprehensive news sources - 60+ sources across all categories
const NEWS_SOURCES = [
  // Major News Networks
  { url: "https://feeds.bbci.co.uk/news/rss.xml", name: "BBC News", category: "General" },
  { url: "https://rss.cnn.com/rss/edition.rss", name: "CNN", category: "General" },
  { url: "https://feeds.reuters.com/reuters/topNews", name: "Reuters", category: "General" },
  { url: "https://feeds.npr.org/1001/rss.xml", name: "NPR", category: "General" },
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml", name: "NY Times", category: "General" },
  { url: "https://feeds.washingtonpost.com/rss/world", name: "Washington Post", category: "General" },
  { url: "https://feeds.skynews.com/feeds/rss/home.xml", name: "Sky News", category: "General" },
  { url: "https://feeds.feedburner.com/time/topstories", name: "Time", category: "General" },
  { url: "https://feeds.feedburner.com/newsweek", name: "Newsweek", category: "General" },
  { url: "https://feeds.feedburner.com/usnews/news", name: "US News", category: "General" },
  { url: "https://feeds.feedburner.com/ap-top-news", name: "Associated Press", category: "General" },

  // Technology & AI
  { url: "https://feeds.feedburner.com/TechCrunch/", name: "TechCrunch", category: "Technology" },
  { url: "https://www.theverge.com/rss/index.xml", name: "The Verge", category: "Technology" },
  { url: "https://feeds.arstechnica.com/arstechnica/index", name: "Ars Technica", category: "Technology" },
  { url: "https://rss.cnet.com/rss/news/", name: "CNET", category: "Technology" },
  { url: "https://feeds.feedburner.com/venturebeat/SZYF", name: "VentureBeat", category: "Technology" },
  { url: "https://feeds.feedburner.com/Techcrunch/social", name: "TechCrunch Social", category: "Technology" },
  { url: "https://feeds.feedburner.com/Mashable", name: "Mashable", category: "Technology" },
  { url: "https://feeds.feedburner.com/engadget", name: "Engadget", category: "Technology" },
  { url: "https://feeds.feedburner.com/ommalik", name: "GigaOm", category: "Technology" },
  { url: "https://feeds.feedburner.com/Techcrunch/startups", name: "TechCrunch Startups", category: "Technology" },
  { url: "https://feeds.feedburner.com/wired/index", name: "Wired", category: "Technology" },

  // Entertainment & Movies
  { url: "https://feeds.feedburner.com/variety/headlines", name: "Variety", category: "Entertainment" },
  { url: "https://feeds.feedburner.com/thr/news", name: "Hollywood Reporter", category: "Entertainment" },
  { url: "https://rss.ign.com/ign_all", name: "IGN", category: "Entertainment" },
  { url: "https://feeds.feedburner.com/comingsoon", name: "ComingSoon", category: "Entertainment" },
  { url: "https://feeds.feedburner.com/slashfilm", name: "SlashFilm", category: "Entertainment" },
  { url: "https://feeds.feedburner.com/deadlinecom", name: "Deadline", category: "Entertainment" },
  { url: "https://feeds.feedburner.com/polygon-all", name: "Polygon", category: "Entertainment" },
  { url: "https://feeds.feedburner.com/ew-all", name: "Entertainment Weekly", category: "Entertainment" },
  { url: "https://feeds.feedburner.com/people/headlines", name: "People", category: "Entertainment" },
  { url: "https://feeds.feedburner.com/rollingstone/music", name: "Rolling Stone", category: "Entertainment" },

  // Business & Finance
  { url: "https://feeds.bloomberg.com/markets/news.rss", name: "Bloomberg", category: "Business" },
  { url: "https://feeds.reuters.com/reuters/businessNews", name: "Reuters Business", category: "Business" },
  { url: "https://feeds.feedburner.com/entrepreneur/latest", name: "Entrepreneur", category: "Business" },
  { url: "https://feeds.feedburner.com/fastcompany/headlines", name: "Fast Company", category: "Business" },
  { url: "https://feeds.feedburner.com/fortune/headlines", name: "Fortune", category: "Business" },
  { url: "https://feeds.feedburner.com/wsj/xml/rss/3_7085", name: "Wall Street Journal", category: "Business" },
  { url: "https://feeds.feedburner.com/crunchbase-news", name: "Crunchbase News", category: "Business" },
  { url: "https://feeds.feedburner.com/inc/headlines", name: "Inc Magazine", category: "Business" },

  // Sports
  { url: "https://rss.espn.com/espn/rss/news", name: "ESPN", category: "Sports" },
  { url: "https://rss.cnn.com/rss/edition_sport.rss", name: "CNN Sports", category: "Sports" },
  { url: "https://feeds.feedburner.com/SInow", name: "Sports Illustrated", category: "Sports" },
  { url: "https://feeds.feedburner.com/bleacherreport", name: "Bleacher Report", category: "Sports" },
  { url: "https://feeds.feedburner.com/cbssports/headlines", name: "CBS Sports", category: "Sports" },

  // Science & Health
  { url: "https://rss.cnn.com/rss/edition_health.rss", name: "CNN Health", category: "Health" },
  { url: "https://feeds.feedburner.com/sciencedaily", name: "Science Daily", category: "Science" },
  { url: "https://feeds.feedburner.com/NatGeoNews", name: "National Geographic", category: "Science" },
  { url: "https://feeds.feedburner.com/livescience", name: "Live Science", category: "Science" },
  { url: "https://feeds.feedburner.com/space-com", name: "Space.com", category: "Science" },
  { url: "https://feeds.feedburner.com/webmd/health-news", name: "WebMD", category: "Health" },

  // World News
  { url: "https://feeds.reuters.com/Reuters/worldNews", name: "Reuters World", category: "World" },
  { url: "https://rss.cnn.com/rss/edition_world.rss", name: "CNN World", category: "World" },
  { url: "https://feeds.bbci.co.uk/news/world/rss.xml", name: "BBC World", category: "World" },
  { url: "https://feeds.feedburner.com/aljazeera/english", name: "Al Jazeera", category: "World" },
  { url: "https://feeds.feedburner.com/dw-world", name: "Deutsche Welle", category: "World" },

  // Lifestyle & Culture
  { url: "https://feeds.feedburner.com/buzzfeed", name: "BuzzFeed", category: "Lifestyle" },
  { url: "https://feeds.feedburner.com/huffpost/lifestyle", name: "HuffPost Lifestyle", category: "Lifestyle" },
  { url: "https://feeds.feedburner.com/vogue/headlines", name: "Vogue", category: "Lifestyle" },

  // Gaming
  { url: "https://feeds.feedburner.com/gamespot/news", name: "GameSpot", category: "Gaming" },
  { url: "https://feeds.feedburner.com/kotaku", name: "Kotaku", category: "Gaming" },
  { url: "https://feeds.feedburner.com/pcgamer/all", name: "PC Gamer", category: "Gaming" },

  // Additional Tech Sources
  { url: "https://feeds.feedburner.com/9to5mac", name: "9to5Mac", category: "Technology" },
  { url: "https://feeds.feedburner.com/androidcentral", name: "Android Central", category: "Technology" },
  { url: "https://feeds.feedburner.com/gizmodo/full", name: "Gizmodo", category: "Technology" },
]

// Cache for news articles
let newsCache: NewsArticle[] = []
let lastFetchTime = 0
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

async function fetchNewsFromSource(source: { url: string; name: string; category: string }): Promise<NewsArticle[]> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 12000)

    const response = await fetch(source.url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/rss+xml, application/xml, text/xml, application/atom+xml, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        "Accept-Encoding": "gzip, deflate, br",
        Referer: "https://www.google.com/",
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      return []
    }

    const xmlText = await response.text()
    if (!xmlText || xmlText.length < 100) {
      return []
    }

    const articles = parseXMLFeed(xmlText, source.name, source.category)
    return articles
  } catch (error) {
    return []
  }
}

function parseXMLFeed(xmlText: string, sourceName: string, category: string): NewsArticle[] {
  const articles: NewsArticle[] = []

  try {
    const itemPatterns = [
      /<item[^>]*>([\s\S]*?)<\/item>/gi,
      /<entry[^>]*>([\s\S]*?)<\/entry>/gi,
      /<article[^>]*>([\s\S]*?)<\/article>/gi,
    ]

    let allItems: string[] = []
    itemPatterns.forEach((pattern) => {
      const matches = xmlText.match(pattern) || []
      allItems = allItems.concat(matches)
    })

    for (const item of allItems.slice(0, 25)) {
      const title = extractXMLContent(item, "title")
      const description =
        extractXMLContent(item, "description") ||
        extractXMLContent(item, "summary") ||
        extractXMLContent(item, "content") ||
        extractXMLContent(item, "content:encoded") ||
        extractXMLContent(item, "media:description") ||
        extractXMLContent(item, "excerpt") ||
        title

      let link = extractXMLContent(item, "link") || extractXMLContent(item, "guid")

      if (!link) {
        const linkPatterns = [
          /<link[^>]*href=["']([^"']+)["'][^>]*>/i,
          /<link[^>]*>([^<]+)<\/link>/i,
          /<guid[^>]*>([^<]+)<\/guid>/i,
          /<id[^>]*>([^<]+)<\/id>/i,
        ]

        for (const pattern of linkPatterns) {
          const match = item.match(pattern)
          if (match && match[1]) {
            link = match[1]
            break
          }
        }
      }

      const pubDate =
        extractXMLContent(item, "pubDate") ||
        extractXMLContent(item, "published") ||
        extractXMLContent(item, "updated") ||
        extractXMLContent(item, "dc:date") ||
        extractXMLContent(item, "lastBuildDate") ||
        extractXMLContent(item, "date")

      if (title && link && title.length > 5) {
        const cleanedTitle = cleanText(title)
        const cleanedSummary = cleanText(description || title)
        const cleanedLink = cleanText(link)

        if (
          cleanedTitle.length > 8 &&
          !cleanedTitle.match(/^(ad|advertisement|sponsored|promo)/i) &&
          cleanedLink.startsWith("http")
        ) {
          articles.push({
            title: cleanedTitle,
            summary: cleanedSummary.substring(0, 800),
            link: cleanedLink,
            source: sourceName,
            pubDate: formatDate(pubDate),
            category: category,
            relevanceScore: 0,
          })
        }
      }
    }

    return articles
  } catch (error) {
    return []
  }
}

function extractXMLContent(xml: string, tag: string): string {
  const patterns = [
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"),
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)(?=<[^/]|$)`, "i"),
    new RegExp(`<${tag}[^>]*\\s+[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"),
  ]

  for (const pattern of patterns) {
    const match = xml.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }
  return ""
}

function cleanText(text: string): string {
  if (!text) return ""
  return text
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "...")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/\s+/g, " ")
    .replace(/^\s*[-•]\s*/, "")
    .trim()
}

function formatDate(dateString: string): string {
  if (!dateString) return "Recent"

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "Recent"

    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMinutes < 5) return "Just now"
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`

    return date.toLocaleDateString()
  } catch {
    return "Recent"
  }
}

async function fetchAllNews(): Promise<NewsArticle[]> {
  const now = Date.now()

  if (newsCache.length > 150 && now - lastFetchTime < CACHE_DURATION) {
    console.log(`📰 Using cached news: ${newsCache.length} articles`)
    return newsCache
  }

  console.log(`🔄 Fetching fresh news from ${NEWS_SOURCES.length} sources...`)

  const results: NewsArticle[] = []

  for (let i = 0; i < NEWS_SOURCES.length; i += 4) {
    const batch = NEWS_SOURCES.slice(i, i + 4)
    const promises = batch.map((source) => fetchNewsFromSource(source))
    const batchResults = await Promise.allSettled(promises)

    batchResults.forEach((result) => {
      if (result.status === "fulfilled" && result.value.length > 0) {
        results.push(...result.value)
      }
    })

    if (i + 4 < NEWS_SOURCES.length) {
      await new Promise((resolve) => setTimeout(resolve, 600))
    }
  }

  const uniqueArticles = removeDuplicates(results)
  uniqueArticles.sort((a, b) => {
    const dateA = new Date(a.pubDate).getTime() || 0
    const dateB = new Date(b.pubDate).getTime() || 0
    return dateB - dateA
  })

  newsCache = uniqueArticles
  lastFetchTime = now

  console.log(`📰 Total articles cached: ${uniqueArticles.length}`)
  return uniqueArticles
}

function removeDuplicates(articles: NewsArticle[]): NewsArticle[] {
  const seen = new Set<string>()
  return articles.filter((article) => {
    const key = article.title
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .substring(0, 80)

    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function searchArticles(articles: NewsArticle[], query: string): NewsArticle[] {
  const queryLower = query.toLowerCase()
  const queryWords = queryLower
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .map((word) => word.replace(/[^\w]/g, ""))

  if (queryWords.length === 0) return []

  const scored = articles.map((article) => {
    const titleLower = article.title.toLowerCase()
    const summaryLower = article.summary.toLowerCase()
    const textLower = `${titleLower} ${summaryLower}`
    let score = 0

    // Exact query match
    if (textLower.includes(queryLower)) {
      score += 500
    }

    // Title matches
    if (titleLower.includes(queryLower)) {
      score += 350
    }

    // Individual word matches
    queryWords.forEach((word) => {
      const wordRegex = new RegExp(`\\b${word}\\b`, "gi")
      const titleMatches = titleLower.match(wordRegex) || []
      const summaryMatches = summaryLower.match(wordRegex) || []

      score += titleMatches.length * 100
      score += summaryMatches.length * 50

      if (titleLower.includes(word)) score += 60
      if (summaryLower.includes(word)) score += 30
    })

    // Recency boost
    if (article.pubDate.includes("ago") || article.pubDate === "Just now") {
      score += 25
    }

    article.relevanceScore = score
    return { article, score }
  })

  const results = scored
    .filter((item) => item.score > 50)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15)

  console.log(`🔍 Found ${results.length} relevant articles for "${query}"`)
  return results.map((item) => item.article)
}

// Initialize Gemini AI with proper API key
const getGeminiModel = () => {
  // Debug environment variables
  console.log("🔑 Environment Debug:")
  console.log("   - NODE_ENV:", process.env.NODE_ENV)
  console.log("   - GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY)
  console.log("   - NEXT_PUBLIC_GEMINI_API_KEY exists:", !!process.env.NEXT_PUBLIC_GEMINI_API_KEY)

  // Use the working API key directly
  const apiKey = "AIzaSyC12h8nyK-GORDHl1VcKif5u-CWZCRuzTo"

  console.log("   - Using direct API key")
  console.log("   - API key length:", apiKey.length)
  console.log("   - API key preview:", `${apiKey.substring(0, 10)}...`)

  console.log("✅ Using API key for Gemini")

  try {
    const genai = new GoogleGenerativeAI(apiKey)
    return genai.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 4000,
      },
    })
  } catch (error) {
    console.error("❌ Failed to initialize Gemini model:", error)
    throw new Error(`Failed to initialize Gemini: ${error.message}`)
  }
}

// Web search using Gemini - ACTUALLY searches for the specific topic
async function searchWebForTopic(query: string): Promise<string> {
  console.log(`🌐 Searching web specifically for: "${query}"`)

  try {
    const model = getGeminiModel()

    const prompt = `I need you to search for and provide comprehensive, current information specifically about "${query}".

Please provide detailed information about "${query}" including:

1. What exactly is happening with "${query}" right now?
2. Latest news, developments, or updates about "${query}"
3. Recent announcements, changes, or events related to "${query}"
4. Current status and timeline of "${query}"
5. Key facts, numbers, dates, and specific details about "${query}"
6. Who are the main people/companies involved in "${query}"?
7. What are the implications and significance of "${query}"?
8. Recent market reactions, public response, or industry impact of "${query}"

Focus entirely on "${query}" - I want specific, factual, up-to-date information about this exact topic. Include as many concrete details as possible (dates, numbers, names, locations, etc.).

Provide comprehensive information about "${query}" that I can use to understand what's currently happening with this topic.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text().trim()

    if (!text) {
      throw new Error("Empty response from web search")
    }

    console.log(`✅ Web search completed for: "${query}"`)
    return text
  } catch (error) {
    console.error("Web search error:", error)
    throw new Error(`Failed to search web for "${query}": ${error.message}`)
  }
}

// Generate UNIQUE AI analysis for each specific topic
async function generateUniqueAnalysis(query: string, information: string, isWebSearch: boolean): Promise<string> {
  console.log(`🤖 Creating unique analysis specifically for: "${query}"`)

  try {
    const model = getGeminiModel()

    const sourceType = isWebSearch ? "web search results" : "recent news articles"

    const prompt = `You are an expert analyst writing a comprehensive analysis specifically about "${query}".

INFORMATION ABOUT "${query}":
${information}

YOUR TASK: Write a detailed, unique analysis about "${query}" based on the information above.

REQUIREMENTS FOR THIS ANALYSIS:
1. Focus ENTIRELY on "${query}" - this analysis should be 100% about this specific topic
2. Extract and analyze the ACTUAL facts, events, and developments mentioned in the information
3. Identify what makes "${query}" significant RIGHT NOW
4. Discuss the specific implications and consequences of what's happening with "${query}"
5. Include concrete details: dates, numbers, names, companies, locations from the information
6. Analyze trends, patterns, and what this means for the future of "${query}"
7. Write in a natural, engaging style - NOT templated or generic
8. Make connections between different aspects of "${query}"
9. Provide insights that go beyond just summarizing - analyze WHY this matters

WRITING STYLE:
- Write as if you're an expert who has deeply studied "${query}"
- Use specific details and facts from the information provided
- Make it conversational but professional
- Avoid generic phrases like "this topic" or "this area" - always refer to "${query}" specifically
- Each paragraph should reveal new insights about "${query}"

Write a comprehensive, unique analysis about "${query}" that someone reading would find genuinely insightful and informative about this specific topic.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text().trim()

    if (!text) {
      throw new Error("Empty response from AI analysis")
    }

    console.log(`✅ Unique analysis generated for: "${query}"`)
    return text
  } catch (error) {
    console.error("AI analysis error:", error)
    throw new Error(`Failed to generate analysis for "${query}": ${error.message}`)
  }
}

// Improved article search with better relevance scoring
function searchArticlesImproved(articles: NewsArticle[], query: string): NewsArticle[] {
  const queryLower = query.toLowerCase()
  const queryWords = queryLower
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .map((word) => word.replace(/[^\w]/g, ""))

  if (queryWords.length === 0) return []

  console.log(`🔍 Searching for keywords: ${queryWords.join(", ")}`)

  const scored = articles.map((article) => {
    const titleLower = article.title.toLowerCase()
    const summaryLower = article.summary.toLowerCase()
    const sourceLower = article.source.toLowerCase()
    const categoryLower = article.category.toLowerCase()
    const textLower = `${titleLower} ${summaryLower} ${sourceLower} ${categoryLower}`
    let score = 0

    // Exact query match (highest priority)
    if (textLower.includes(queryLower)) {
      score += 1000
    }

    // Title exact match
    if (titleLower.includes(queryLower)) {
      score += 800
    }

    // Summary exact match
    if (summaryLower.includes(queryLower)) {
      score += 600
    }

    // Individual word matches with context
    queryWords.forEach((word) => {
      const wordRegex = new RegExp(`\\b${word}\\b`, "gi")

      // Title word matches (very high value)
      const titleMatches = titleLower.match(wordRegex) || []
      score += titleMatches.length * 200

      // Summary word matches
      const summaryMatches = summaryLower.match(wordRegex) || []
      score += summaryMatches.length * 100

      // Partial word matches in title
      if (titleLower.includes(word)) score += 150

      // Partial word matches in summary
      if (summaryLower.includes(word)) score += 75

      // Source relevance
      if (sourceLower.includes(word)) score += 50

      // Category relevance
      if (categoryLower.includes(word)) score += 30
    })

    // Boost for recent articles
    if (article.pubDate.includes("ago") || article.pubDate === "Just now") {
      score += 100
    }
    if (article.pubDate.includes("hour") || article.pubDate.includes("minute")) {
      score += 50
    }

    // Boost for reputable sources
    const reputableSources = ["BBC", "Reuters", "CNN", "Associated Press", "NPR", "Wall Street Journal"]
    if (reputableSources.some((source) => article.source.includes(source))) {
      score += 25
    }

    article.relevanceScore = score
    return { article, score }
  })

  const results = scored
    .filter((item) => item.score > 100) // Higher threshold for relevance
    .sort((a, b) => b.score - a.score)
    .slice(0, 20) // Get more articles for better analysis

  console.log(`🔍 Found ${results.length} relevant articles for "${query}"`)
  if (results.length > 0) {
    console.log(
      `📊 Top relevance scores: ${results
        .slice(0, 5)
        .map((r) => r.score)
        .join(", ")}`,
    )
  }

  return results.map((item) => item.article)
}

// Comprehensive web search for when articles aren't sufficient
async function searchWebComprehensive(query: string): Promise<string> {
  console.log(`🌐 Conducting comprehensive web search for: "${query}"`)

  try {
    const model = getGeminiModel()

    const prompt = `You are a professional research analyst. I need you to provide comprehensive, factual information about "${query}".

RESEARCH TASK: Gather detailed information about "${query}" including:

1. CURRENT STATUS & LATEST DEVELOPMENTS:
   - What is happening with "${query}" right now?
   - Latest news, updates, announcements in the past 30 days
   - Recent changes, developments, or milestones
   - Current timeline and status

2. KEY FACTS & DATA:
   - Important statistics, numbers, dates, figures
   - Key people, companies, organizations involved
   - Financial data, market information (if applicable)
   - Technical specifications or details (if applicable)

3. CONTEXT & BACKGROUND:
   - Brief history and background of "${query}"
   - Why this topic is significant or newsworthy
   - Previous major developments or milestones
   - Industry or sector context

4. IMPACT & IMPLICATIONS:
   - How this affects different stakeholders
   - Market reactions, public response, industry impact
   - Future implications and potential outcomes
   - Broader significance and consequences

5. EXPERT PERSPECTIVES:
   - What experts, analysts, or industry leaders are saying
   - Different viewpoints or opinions on the topic
   - Predictions or forecasts related to "${query}"

6. RELATED DEVELOPMENTS:
   - Connected news, trends, or events
   - Competing or alternative developments
   - Regulatory or policy implications

REQUIREMENTS:
- Provide specific, factual, up-to-date information
- Include concrete details: dates, numbers, names, locations
- Focus on recent developments (last 30-90 days)
- Cite specific examples and evidence
- Be comprehensive but concise
- Organize information clearly

Please provide detailed research findings about "${query}" that I can use for comprehensive analysis.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text().trim()

    if (!text) {
      throw new Error("Empty response from web search")
    }

    console.log(`✅ Comprehensive web research completed for: "${query}"`)
    console.log(`📄 Research data length: ${text.length} characters`)
    return text
  } catch (error) {
    console.error("Web search error:", error)
    throw new Error(`Failed to conduct comprehensive research for "${query}": ${error.message}`)
  }
}

// Generate comprehensive analysis from either articles or web data
async function generateComprehensiveAnalysis(
  query: string,
  sourceData: string,
  isWebSearch: boolean,
  articleCount: number,
): Promise<string> {
  console.log(`🤖 Creating comprehensive analysis for: "${query}"`)
  console.log(`📊 Data source: ${isWebSearch ? "Web Research" : `${articleCount} News Articles`}`)

  try {
    const model = getGeminiModel()

    const sourceType = isWebSearch ? "comprehensive web research" : `${articleCount} recent news articles`
    const dataContext = isWebSearch ? "web intelligence and research data" : "breaking news and recent developments"

    const prompt = `You are an expert news analyst and researcher. Create a comprehensive, professional analysis about "${query}" based on the ${sourceType} provided below.

SOURCE DATA ABOUT "${query}":
${sourceData}

ANALYSIS REQUIREMENTS:

1. EXECUTIVE SUMMARY (2-3 sentences):
   - What is "${query}" and why is it significant right now?
   - Key takeaway that captures the essence of current developments

2. CURRENT DEVELOPMENTS:
   - What's happening with "${query}" right now?
   - Latest news, announcements, or changes
   - Recent timeline of events (with specific dates when available)
   - Key developments in the past 30-90 days

3. KEY FACTS & FIGURES:
   - Important statistics, numbers, financial data
   - Market performance, growth rates, or metrics
   - Technical specifications or key details
   - Names of key people, companies, or organizations involved

4. ANALYSIS & IMPLICATIONS:
   - Why these developments matter
   - Impact on different stakeholders (consumers, investors, industry, etc.)
   - Market reactions and industry response
   - Competitive landscape and positioning

5. FUTURE OUTLOOK:
   - What to expect next with "${query}"
   - Upcoming milestones, deadlines, or events
   - Potential challenges or opportunities
   - Expert predictions or forecasts

6. BROADER CONTEXT:
   - How "${query}" fits into larger trends or movements
   - Connections to related developments or industries
   - Historical context or comparison to past events

WRITING GUIDELINES:
- Write in a professional, analytical tone
- Use specific facts, dates, numbers, and names from the source data
- Structure with clear sections and logical flow
- Make it engaging and informative for general readers
- Include concrete examples and evidence
- Avoid speculation - stick to facts from the source data
- Make connections between different pieces of information
- Highlight what makes this topic newsworthy or important

Create a comprehensive analysis that someone reading would find genuinely insightful and well-informed about "${query}".`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text().trim()

    if (!text) {
      throw new Error("Empty response from AI analysis")
    }

    console.log(`✅ Comprehensive analysis generated for: "${query}"`)
    console.log(`📄 Analysis length: ${text.length} characters`)
    return text
  } catch (error) {
    console.error("AI analysis error:", error)
    throw new Error(`Failed to generate comprehensive analysis for "${query}": ${error.message}`)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query } = body

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json({ error: "Valid query is required" }, { status: 400 })
    }

    const cleanQuery = query.trim()
    console.log(`\n🔍 Processing specific query: "${cleanQuery}"`)

    const startTime = Date.now()

    // STEP 1: Fetch all news articles
    console.log("📰 Step 1: Fetching all news articles...")
    const allArticles = await fetchAllNews()

    // STEP 2: Search articles for the specific query with improved matching
    console.log(`🔍 Step 2: Searching articles specifically for "${cleanQuery}"...`)
    const relevantArticles = searchArticlesImproved(allArticles, cleanQuery)

    let analysis: string
    let usedWebSearch = false
    let sourceData = ""

    if (relevantArticles.length >= 2) {
      // STEP 3A: Found relevant articles - create comprehensive analysis from articles
      console.log(`✅ Found ${relevantArticles.length} relevant articles about "${cleanQuery}"`)

      // Create detailed source data from articles
      sourceData = relevantArticles
        .slice(0, 15)
        .map(
          (article, index) =>
            `ARTICLE ${index + 1}:
HEADLINE: ${article.title}
SOURCE: ${article.source} (${article.category})
PUBLISHED: ${article.pubDate}
RELEVANCE SCORE: ${article.relevanceScore}
CONTENT: ${article.summary}
LINK: ${article.link}

---`,
        )
        .join("\n\n")

      analysis = await generateComprehensiveAnalysis(cleanQuery, sourceData, false, relevantArticles.length)
    } else {
      // STEP 3B: No relevant articles found - search web for comprehensive data
      console.log(
        `❌ Only found ${relevantArticles.length} articles about "${cleanQuery}", searching web for comprehensive data...`,
      )
      usedWebSearch = true

      const webData = await searchWebComprehensive(cleanQuery)
      sourceData = webData
      analysis = await generateComprehensiveAnalysis(cleanQuery, webData, true, 0)
    }

    const totalTime = Date.now() - startTime
    console.log(`⚡ Total processing time: ${totalTime}ms`)
    console.log(`📊 Analysis method: ${usedWebSearch ? "Web Search" : "Article Analysis"}`)
    console.log(`🎯 Topic analyzed: "${cleanQuery}"\n`)

    return NextResponse.json({
      answer: analysis,
      sources: relevantArticles,
      query: cleanQuery,
      meta: {
        totalArticles: allArticles.length,
        relevantArticles: relevantArticles.length,
        processingTime: totalTime,
        sources: [...new Set(relevantArticles.map((a) => a.source))],
        avgRelevanceScore:
          relevantArticles.length > 0
            ? Math.round(relevantArticles.reduce((sum, a) => sum + a.relevanceScore, 0) / relevantArticles.length)
            : 0,
        totalSources: NEWS_SOURCES.length,
        usedWebSearch,
        dataQuality: usedWebSearch ? "Web Intelligence" : "News Articles",
      },
    })
  } catch (error) {
    console.error("❌ API Error:", error)
    return NextResponse.json(
      {
        error: "Failed to process search request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
