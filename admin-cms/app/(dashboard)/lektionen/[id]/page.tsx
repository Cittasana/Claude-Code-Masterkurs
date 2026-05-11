"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import {
  Save,
  Eye,
  Sparkles,
  ArrowLeft,
  MoreVertical,
  Upload,
  Calendar,
  Globe,
} from "lucide-react";

export default function LektionEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [titel, setTitel] = useState("01 - Einführung in Claude Code");
  const [slug, setSlug] = useState("01-einfuehrung-claude-code");
  const [beschreibung, setBeschreibung] = useState(
    "Lerne die Grundlagen von Claude Code und wie du AI-gestützt programmieren kannst"
  );
  const [kategorie, setKategorie] = useState("basics");
  const [content, setContent] = useState("<p>Starte hier mit dem Content...</p>");
  const [showResearchPanel, setShowResearchPanel] = useState(false);

  const handleSave = () => {
    // API Call zum Speichern
    console.log("Speichere Lektion...", { titel, slug, beschreibung, kategorie, content });
  };

  const handlePublish = () => {
    // API Call zum Veröffentlichen
    console.log("Veröffentliche Lektion...");
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] gap-6">
      {/* Main Editor */}
      <div className="flex flex-1 flex-col gap-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin/lektionen")}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lektion bearbeiten</h1>
              <p className="text-sm text-gray-600">ID: {params.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowResearchPanel(!showResearchPanel)}
              className="flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-100"
            >
              <Sparkles className="h-4 w-4" />
              Research Agent
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
              <Eye className="h-4 w-4" />
              Vorschau
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
            >
              <Save className="h-4 w-4" />
              Speichern
            </button>
            <button
              onClick={handlePublish}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
            >
              <Globe className="h-4 w-4" />
              Veröffentlichen
            </button>
            <button className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Meta Fields */}
        <div className="grid gap-4 rounded-xl border bg-white p-4 shadow-sm md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Titel
            </label>
            <input
              type="text"
              value={titel}
              onChange={(e) => setTitel(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Beschreibung
            </label>
            <textarea
              value={beschreibung}
              onChange={(e) => setBeschreibung(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Kategorie
            </label>
            <select
              value={kategorie}
              onChange={(e) => setKategorie(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="basics">Basics</option>
              <option value="fortgeschritten">Fortgeschritten</option>
              <option value="experten">Experten</option>
              <option value="tools">Tools & Extensions</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Reihenfolge
            </label>
            <input
              type="number"
              defaultValue="1"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Content Editor */}
        <div className="flex-1 overflow-hidden">
          <TiptapEditor content={content} onChange={setContent} />
        </div>
      </div>

      {/* Research Agent Panel (Sidebar) */}
      {showResearchPanel && (
        <div className="w-96 space-y-4 overflow-y-auto">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-bold text-gray-900">Research Agent</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Topic
                </label>
                <input
                  type="text"
                  placeholder="z.B. 'Python async/await patterns'"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Quelle
                </label>
                <select className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20">
                  <option value="web">Web Search</option>
                  <option value="github">GitHub</option>
                  <option value="stackoverflow">Stack Overflow</option>
                  <option value="docs">Official Docs</option>
                </select>
              </div>

              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-700">
                <Sparkles className="h-4 w-4" />
                Research starten
              </button>
            </div>
          </div>

          {/* Research Results */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Ergebnisse
            </h3>
            <p className="text-sm text-gray-500">
              Starte eine Recherche, um Ergebnisse zu sehen...
            </p>
          </div>

          {/* Research History */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Verlauf
            </h3>
            <div className="space-y-2">
              <button className="w-full rounded-lg border border-gray-200 p-3 text-left text-sm transition-colors hover:bg-gray-50">
                <p className="font-medium text-gray-900">Python async/await</p>
                <p className="text-xs text-gray-500">Vor 2 Stunden</p>
              </button>
              <button className="w-full rounded-lg border border-gray-200 p-3 text-left text-sm transition-colors hover:bg-gray-50">
                <p className="font-medium text-gray-900">TypeScript generics</p>
                <p className="text-xs text-gray-500">Gestern</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
