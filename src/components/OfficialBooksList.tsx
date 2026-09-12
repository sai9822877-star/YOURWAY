import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  Info,
  Globe,
  GraduationCap,
} from 'lucide-react';
import { ClassLevel, OfficialBook } from '../types';
import { OFFICIAL_BOOKS } from '../data/officialBooks';

interface OfficialBooksListProps {
  userClass?: ClassLevel;
  filterSubject?: string;
  compact?: boolean;
}

export const OfficialBooksList: React.FC<OfficialBooksListProps> = ({
  userClass,
  filterSubject,
  compact = false,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>(userClass || 'All');
  const [selectedSubject, setSelectedSubject] = useState<string>(filterSubject || 'All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Synchronize with user class if changed
  React.useEffect(() => {
    if (userClass && selectedClass === 'All') {
      setSelectedClass(userClass);
    }
  }, [userClass]);

  const filteredBooks = useMemo(() => {
    return OFFICIAL_BOOKS.filter((b) => {
      // Class filter
      if (selectedClass !== 'All' && b.class !== selectedClass && b.class !== 'Class 9') {
        // also keep universal/all-subject books for any class if relevant
        if (b.subject !== 'All Subjects') return false;
      }
      // Subject filter
      if (selectedSubject !== 'All' && b.subject !== selectedSubject && b.subject !== 'All Subjects') {
        return false;
      }
      // Type filter
      if (selectedType !== 'All' && b.type !== selectedType) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          b.title.toLowerCase().includes(q) ||
          b.authorOrPublisher.toLowerCase().includes(q) ||
          b.subject.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.officialSourceName.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [selectedClass, selectedSubject, selectedType, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header & Policy Notice */}
      {!compact && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Legal & Authorized Official Sources</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
                Official Curriculum Books & Textbooks
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Browse official, syllabus-prescribed NCERT, CBSE, and educational books. Every entry redirects directly to the official government portal or authorized publisher.
              </p>
            </div>

            {/* Legal compliance badge */}
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-600 max-w-xs">
              <Info className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span>
                <strong>Direct Redirection:</strong> Books are never copied, downloaded, or mirrored on Your Way. Opens in a new tab so you can return anytime.
              </span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search official books, NCERT titles, or publishers…"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              />
            </div>

            {/* Select Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Class Filter */}
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
                <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Classes</option>
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                </select>
              </div>

              {/* Subject Filter */}
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Subjects</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="Social Science">Social Science</option>
                  <option value="Physics">Physics</option>
                  <option value="All Subjects">General Portals</option>
                </select>
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Formats</option>
                  <option value="Free Official eBook / PDF">Free Official eBook / PDF</option>
                  <option value="Official Online Reader">Official Online Reader</option>
                  <option value="Authorized Publisher">Authorized Publisher</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Book Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBooks.map((book) => {
          return (
            <div
              key={book.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-bold">
                      {book.class}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-semibold border border-indigo-100">
                      {book.subject}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        book.type === 'Free Official eBook / PDF'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : book.type === 'Official Online Reader'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : 'bg-amber-50 text-amber-800 border border-amber-100'
                      }`}
                    >
                      {book.type}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                </div>

                {/* Book Title */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-950 transition-colors">
                  {book.title}
                </h3>

                {/* Publisher / Authority */}
                <div className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1">
                  <span>Publisher:</span>
                  <span className="font-semibold text-slate-700">{book.authorOrPublisher}</span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                  {book.description}
                </p>
              </div>

              {/* Action Button: Open Official Source */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate max-w-[200px]">{book.officialSourceName}</span>
                </div>

                <a
                  id={`open-official-source-${book.id}`}
                  href={book.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 text-white hover:bg-slate-800 font-bold text-xs shadow-xs transition-all flex-shrink-0 cursor-pointer group/btn"
                  title={`Open official source at ${book.officialSourceName} in a new tab`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Open Official Source</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-white transition-colors" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBooks.length === 0 && (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800">No official books matched your filters</h4>
          <p className="text-xs text-slate-500 mt-1">
            Try selecting “All Classes” or clearing your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};
