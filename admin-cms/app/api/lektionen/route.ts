import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";

// GET /api/lektionen - Alle Lektionen abrufen
export async function GET(request: NextRequest) {
  try {
    // const session = await getServerSession();
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const searchParams = request.nextUrl.searchParams;
    const kategorie = searchParams.get("kategorie");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // Mock data - In Produktion von Prisma DB
    const lektionen = [
      {
        id: "1",
        titel: "01 - Einführung in Claude Code",
        slug: "01-einfuehrung-claude-code",
        beschreibung: "Lerne die Grundlagen von Claude Code",
        content: "<p>Content hier...</p>",
        kategorie: "basics",
        reihenfolge: 1,
        status: "published",
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        autorId: "user_1",
        autor: {
          name: "Cosmo",
          email: "office@cittasana.de",
        },
      },
      // Weitere Lektionen...
    ];

    return NextResponse.json({
      success: true,
      data: lektionen,
      count: lektionen.length,
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der Lektionen:", error);
    return NextResponse.json(
      { error: "Interner Server-Fehler" },
      { status: 500 }
    );
  }
}

// POST /api/lektionen - Neue Lektion erstellen
export async function POST(request: NextRequest) {
  try {
    // const session = await getServerSession();
    // if (!session || session.user.rolle !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const body = await request.json();
    const { titel, slug, beschreibung, content, kategorie, reihenfolge } = body;

    // Validierung
    if (!titel || !slug || !content) {
      return NextResponse.json(
        { error: "Titel, Slug und Content sind erforderlich" },
        { status: 400 }
      );
    }

    // In Produktion: Prisma erstellen
    // const lektion = await prisma.lektion.create({
    //   data: {
    //     titel,
    //     slug,
    //     beschreibung,
    //     content,
    //     kategorie,
    //     reihenfolge,
    //     status: "draft",
    //     autorId: session.user.id,
    //   },
    // });

    const lektion = {
      id: "new_id",
      titel,
      slug,
      beschreibung,
      content,
      kategorie,
      reihenfolge,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      data: lektion,
      message: "Lektion erfolgreich erstellt",
    });
  } catch (error) {
    console.error("Fehler beim Erstellen der Lektion:", error);
    return NextResponse.json(
      { error: "Interner Server-Fehler" },
      { status: 500 }
    );
  }
}
