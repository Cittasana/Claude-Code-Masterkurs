"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Upload,
  Download,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Wrench,
  Terminal,
  Zap,
  Globe,
} from "lucide-react";

// Mock Data
const mockTools = [
  {
    id: "1",
    name: "grep",
    slug: "01-grep",
    kategorie: "anfaenger",
    beschreibung: "Pattern Matching & Textsuche",
    icon: Terminal,
    status: "published",
    reihenfolge: 1,
  },
  {
    id: "8",
    name: "curl",
    slug: "08-curl",
    kategorie: "anfaenger",
    beschreibung: "HTTP Client & API Testing",
    icon: Globe,
    status: "published",
    reihenfolge: 8,
  },
  {
    id: "15",
    name: "fzf",
    slug: "09-fzf",
    kategorie: "fortgeschritten",
    beschreibung: "Fuzzy Finder für interaktive Suche",
    icon: Search,
    status: "published",
    reihenfolge: 9,
  },
  {
    id: "35",
    name: "zellij",
    slug: "30-zellij",
    kategorie: "experten",
    beschreibung: "Moderner Terminal Multiplexer",
    icon: Terminal,
    status: "published",
    reihenfolge: 30,
  },
  {
    id: "42",
    name: "Puppeteer MCP",
    slug: "42-mcp-puppeteer",
    kategorie: "mcp",
    beschreibung: "Browser Automation für Claude Code",
    icon: Zap,
    status: "published",
    reihenfolge: 42,
  },
  {
    id: "43",
    name: "Slack MCP",
    slug: "43-mcp-slack",
    kategorie: "mcp",
    beschreibung: "Team Communication Integration",
    icon: Zap,
    status: "published",
    reihenfolge: 43,
  },
];

const kategorien = [
  { value: "all", label: "Alle", count: 43, color: "gray" },
  { value: "anfaenger", label: "Anfänger", count: 8, color: "blue" },
  { value: "fortgeschritten", label: "Fortgeschritten", count: 20, color: "purple" },
  { value: "experten", label: "Experten", count: 6, color: "orange" },
  { value: "mcp", label: "MCP Servers", count: 8, color: "green" },
];

export default function ToolsPage() {
  const [selectedKategorie, setSelectedKategorie] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleImportMarkdown = () => {
    console.log("Import Markdown files...");
  };

  const handleExportAll = () => {
    console.log("Export all tools...");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tools & Extensions</h1>
          <p className="mt-1 text-sm text-gray-600">
            Verwalte alle 43 CLI-Tools und MCP Servers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleImportMarkdown}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Upload className="h-4 w-4" />
            Import MD
          </button>
          <button
            onClick={handleExportAll}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Neues Tool
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {kategorien.map((kat) => (
          <button
            key={kat.value}
            onClick={() => setSelectedKategorie(kat.value)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              selectedKategorie === kat.value
                ? `bg-${kat.color}-50 text-${kat.color}-700 ring-1 ring-${kat.color}-200`
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {kat.label}
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                selectedKategorie === kat.value
                  ? `bg-${kat.color}-100`
                  : "bg-gray-100"
              }`}
            >
              {kat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 rounded-xl border bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Suche Tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockTools.map((tool) => {
          const Icon = tool.icon;
          const kategorie = kategorien.find((k) => k.value === tool.kategorie);

          return (
            <div
              key={tool.id}
              className="group relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              {/* Kategorie Badge */}
              <div className="absolute right-4 top-4">
                <span className={`rounded-full bg-${kategorie?.color}-100 px-3 py-1 text-xs font-semibold text-${kategorie?.color}-700`}>
                  {kategorie?.label}
                </span>
              </div>

              {/* Tool Icon */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <Icon className="h-6 w-6 text-white" />
              </div>

              {/* Tool Info */}
              <div className="mb-4">
                <h3 className="mb-1 text-lg font-bold text-gray-900">{tool.name}</h3>
                <p className="text-sm text-gray-600">{tool.beschreibung}</p>
              </div>

              {/* Tool Meta */}
              <div className="mb-4 flex items-center gap-2 text-xs text-gray-500">
                <span className="rounded-full bg-gray-100 px-2 py-1">
                  #{String(tool.reihenfolge).padStart(2, "0")}
                </span>
                <span>•</span>
                <span>{tool.slug}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100">
                  <Edit className="h-3.5 w-3.5" />
                  Bearbeiten
                </button>
                <button className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bulk Actions */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">43 Tools</span> insgesamt
          </p>
          <div className="flex gap-2">
            <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
              Reihenfolge ändern
            </button>
            <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
              Bulk-Operationen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
