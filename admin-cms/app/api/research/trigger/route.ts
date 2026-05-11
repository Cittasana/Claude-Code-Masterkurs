import { NextRequest, NextResponse } from "next/server";

// POST /api/research/trigger - Research Agent starten
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, quelle, userId } = body;

    if (!topic || !quelle) {
      return NextResponse.json(
        { error: "Topic und Quelle sind erforderlich" },
        { status: 400 }
      );
    }

    // Research Agent Logic
    let results: any[] = [];

    switch (quelle) {
      case "web":
        results = await searchWeb(topic);
        break;
      case "github":
        results = await searchGitHub(topic);
        break;
      case "stackoverflow":
        results = await searchStackOverflow(topic);
        break;
      case "docs":
        results = await searchDocs(topic);
        break;
      default:
        results = await searchWeb(topic);
    }

    // Speichere in ResearchHistory (in Produktion Prisma)
    // await prisma.researchHistory.create({
    //   data: {
    //     topic,
    //     quelle,
    //     ergebnis: results,
    //     userId,
    //   },
    // });

    return NextResponse.json({
      success: true,
      data: {
        topic,
        quelle,
        results,
        count: results.length,
      },
      message: "Research erfolgreich abgeschlossen",
    });
  } catch (error) {
    console.error("Fehler beim Research:", error);
    return NextResponse.json(
      { error: "Interner Server-Fehler" },
      { status: 500 }
    );
  }
}

// Helper Funktionen für verschiedene Quellen

async function searchWeb(topic: string) {
  // In Produktion: Brave Search API, Google Custom Search, oder andere API
  // Für Mock: Simulierte Ergebnisse
  return [
    {
      title: `Understanding ${topic}`,
      url: "https://example.com/article",
      excerpt: `This comprehensive guide explains ${topic} in detail...`,
      source: "Example.com",
      relevance: 95,
    },
    {
      title: `${topic} Best Practices`,
      url: "https://example.com/best-practices",
      excerpt: `Learn the best practices for implementing ${topic}...`,
      source: "Dev.to",
      relevance: 92,
    },
  ];
}

async function searchGitHub(topic: string) {
  // In Produktion: GitHub API
  // https://api.github.com/search/repositories?q={topic}
  return [
    {
      title: `awesome-${topic.replace(/\s+/g, "-")}`,
      url: "https://github.com/example/repo",
      excerpt: "A curated list of awesome resources",
      source: "GitHub",
      stars: 1234,
      relevance: 90,
    },
  ];
}

async function searchStackOverflow(topic: string) {
  // In Produktion: Stack Exchange API
  // https://api.stackexchange.com/2.3/search?q={topic}&site=stackoverflow
  return [
    {
      title: `How to implement ${topic}?`,
      url: "https://stackoverflow.com/questions/123456",
      excerpt: "Detailed answer with code examples...",
      source: "Stack Overflow",
      votes: 456,
      relevance: 88,
    },
  ];
}

async function searchDocs(topic: string) {
  // In Produktion: Custom search für offizielle Dokumentationen
  // z.B. Python Docs, React Docs, etc.
  return [
    {
      title: `${topic} - Official Documentation`,
      url: "https://docs.example.com/topic",
      excerpt: "Official documentation and API reference...",
      source: "Official Docs",
      relevance: 98,
    },
  ];
}

// GET /api/research/trigger - Research History abrufen
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "10");

    // In Produktion: Von Prisma DB abrufen
    // const history = await prisma.researchHistory.findMany({
    //   where: { userId },
    //   orderBy: { createdAt: "desc" },
    //   take: limit,
    // });

    const history = [
      {
        id: "1",
        topic: "Python async/await",
        quelle: "web",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        resultCount: 5,
      },
      {
        id: "2",
        topic: "TypeScript generics",
        quelle: "docs",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        resultCount: 8,
      },
    ];

    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der History:", error);
    return NextResponse.json(
      { error: "Interner Server-Fehler" },
      { status: 500 }
    );
  }
}
