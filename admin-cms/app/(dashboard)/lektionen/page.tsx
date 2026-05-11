"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Copy,
  Clock,
  CheckCircle2,
  FileText,
} from "lucide-react";

// Mock Data - In Produktion von API
const mockLektionen = [
  {
    id: "1",
    titel: "01 - Einführung in Claude Code",
    kategorie: "Basics",
    status: "published",
    views: 234,
    completion: 89,
    lastEdited: "Vor 2 Stunden",
    autor: "Cosmo",
  },
  {
    id: "2",
    titel: "15 - MCP Server Integration",
    kategorie: "Fortgeschritten",
    status: "published",
    views: 189,
    completion: 72,
    lastEdited: "Gestern",
    autor: "Cosmo",
  },
  {
    id: "3",
    titel: "27 - Eigene Projekte bauen",
    kategorie: "Experten",
    status: "published",
    views: 156,
    completion: 68,
    lastEdited: "Vor 3 Tagen",
    autor: "Cosmo",
  },
  {
    id: "4",
    titel: "28 - Advanced Patterns",
    kategorie: "Experten",
    status: "draft",
    views: 0,
    completion: 0,
    lastEdited: "Vor 1 Woche",
    autor: "Cosmo",
  },
];

export default function LektionenPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKategorie, setSelectedKategorie] = useState("all");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lektionen</h1>
          <p className="mt-1 text-sm text-gray-600">
            Verwalte alle Kurs-Inhalte
          </p>
        </div>
        <Link
          href="/admin/lektionen/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Neue Lektion
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Suche Lektionen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedKategorie}
          onChange={(e) => setSelectedKategorie(e.target.value)}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">Alle Kategorien</option>
          <option value="basics">Basics</option>
          <option value="fortgeschritten">Fortgeschritten</option>
          <option value="experten">Experten</option>
          <option value="tools">Tools & Extensions</option>
        </select>

        {/* Status Filter */}
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-600">Gesamt</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">27</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-600">Veröffentlicht</p>
          <p className="mt-1 text-2xl font-bold text-green-600">24</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-600">Entwürfe</p>
          <p className="mt-1 text-2xl font-bold text-orange-600">3</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-600">Tools</p>
          <p className="mt-1 text-2xl font-bold text-purple-600">43</p>
        </div>
      </div>

      {/* Lektionen Table */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Lektion
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Kategorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Completion
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Bearbeitet
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockLektionen.map((lektion) => (
                <tr key={lektion.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{lektion.titel}</p>
                        <p className="text-sm text-gray-500">von {lektion.autor}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {lektion.kategorie}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {lektion.status === "published" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        <CheckCircle2 className="h-3 w-3" />
                        Veröffentlicht
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                        <Clock className="h-3 w-3" />
                        Entwurf
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{lektion.views}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${lektion.completion}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{lektion.completion}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {lektion.lastEdited}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/lektionen/${lektion.id}`}
                        className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
                        title="Bearbeiten"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
                        title="Duplizieren"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                        title="Löschen"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t px-6 py-4">
          <p className="text-sm text-gray-600">
            Zeige 1 bis 4 von 27 Lektionen
          </p>
          <div className="flex gap-2">
            <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
              Vorherige
            </button>
            <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
              Nächste
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
