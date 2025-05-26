# ⚡FlashFeed.AI

FlashFeed.AI is a modern, open-source news search and aggregation app built with Next.js and TypeScript. It fetches news from multiple free RSS sources. If no relevant articles are found, it automatically searches the web, extracts headlines, and  uses **Gemini AI** to generate a summary analysis. All relevant article links are displayed for user reference.

---

## ✨ Features

- **Multi-source news search**: Aggregates news from Google News, BBC, CNN, The Verge, Entertainment Weekly, and more via RSS feeds.
- **Web search fallback**: If no RSS articles are found, scrapes Google News search results for the latest headlines.
- **AI-powered summaries (optional)**: Uses **Gemini AI** to generate a summary based on found headlines (if you provide an API key).
- **No API keys required for basic use**: RSS and web scraping are free and open.
- **Simple, clean UI**: Search any topic and get instant results.
- **Modern stack**: Built with Next.js, TypeScript, and React.

---

## 🚀 Demo

> [Live Demo on Vercel](https://flashfeed-ai.vercel.app/)  

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/flashfeed.git
cd flashfeed
````

### 2. Install Dependencies

```bash
npm install
```

or

```bash
pnpm install
```

### 3. Add Gemini API Key

To enable AI-powered summaries, add your **Gemini AI API key** to a `.env.local` file in the project root:

```
GEMINI_API_KEY=your-gemini-key-here
```

If you skip this step, the app will still work but won’t generate AI summaries.

### 4. Run the Development Server

```bash
npm run dev
```

or

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗂️ Project Structure

```
/components
  └── NewsSearch.tsx     # Main search and display component
/pages
  ├── api/news.ts        # API route for fetching and analyzing news
  └── index.tsx          # Home page
```

---

## ⚙️ How It Works

1. User searches for a topic (e.g., "Marvel Avengers Doomsday").
2. Backend checks multiple RSS feeds for relevant articles.
3. If no RSS articles found, backend scrapes Google News search results for recent headlines.
4. If Gemini API key is set, backend generates an AI summary of the topic using the headlines.
5. Frontend displays all found articles and (if available) the AI-generated summary.

---

## 📰 Sources Used

* Google News RSS: [https://news.google.com/](https://news.google.com/)
* BBC News RSS: [http://feeds.bbci.co.uk/news/rss.xml](http://feeds.bbci.co.uk/news/rss.xml)
* CNN RSS: [http://rss.cnn.com/rss/edition.rss](http://rss.cnn.com/rss/edition.rss)
* The Verge RSS: [https://www.theverge.com/rss/index.xml](https://www.theverge.com/rss/index.xml)
* Entertainment Weekly RSS: [https://ew.com/rss/](https://ew.com/rss/)
* Google News web search (fallback)

---

## 🧑‍💻 Technologies

* [Next.js](https://nextjs.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [React](https://react.dev/)
* [rss-parser](https://www.npmjs.com/package/rss-parser)
* [axios](https://www.npmjs.com/package/axios)
* [cheerio](https://www.npmjs.com/package/cheerio)
* [Gemini AI API](https://ai.google.dev/) 

---

## 📦 Deployment

Deploy easily on [Vercel](https://vercel.com/) or any Next.js-compatible platform.

1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com/), log in, and click **New Project**.
3. Import your GitHub repo and click **Deploy**.
4. (If using AI summaries) Add your `GEMINI_API_KEY` in Vercel’s environment variables.

---

## 🙏 Credits

* Inspired by open web news and AI-powered summarization.
* Built by Devesh and Atharv
---

## 📝 License

MIT License

---

## 📬 Feedback & Contributions

PRs and suggestions welcome!
Open an issue or submit a pull request.

---

## 🔍 Example Usage

1. Open the app.
2. Enter any news topic (e.g., Russia-Ukraine War) in the search box.
3. Press **Search**.
4. If articles are found in RSS feeds, they are shown immediately.
5. If not, the app searches the web for news headlines and (if enabled) provides an AI-powered summary.
6. All article links are shown below the summary.

---

## 💡 Troubleshooting

* **No articles or summary?**
  Try a different search term. Some very obscure topics may have no coverage.
* **AI summary not showing?**
  Make sure you have set `GEMINI_API_KEY` in your `.env.local` file or Vercel environment variables.
* **Errors on deploy?**
  Ensure you have installed all dependencies and are running on Node.js 18+.

---

## 📄 Example .env.local

```
GEMINI_API_KEY=your-gemini-key-here
```

---

## ⭐ Star this repo if you find it useful!



