import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Pill, X, Loader2 } from 'lucide-react';
import { medicines } from '../data/medicines';
import { MedicineCard } from '../components/medicine/MedicineCard';

export const MedicineLibrary: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [prescriptionFilter, setPrescriptionFilter] = useState<'all' | 'otc' | 'rx'>('all');
  const [isFiltering, setIsFiltering] = useState(false);

  // Sync state if URL query param changes
  useEffect(() => {
    if (initialQuery !== searchTerm) {
      setSearchTerm(initialQuery);
    }
  }, [initialQuery]);

  // Extract unique categories from canonical dataset
  const categories = useMemo(() => {
    const list: string[] = ['All'];
    medicines.forEach((m) => {
      if (!list.includes(m.category)) {
        list.push(m.category);
      }
    });
    return list;
  }, []);

  // Filtered dataset: search by medicine name, generic name, brand name, and uses
  const filteredMedicines = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return medicines.filter((med) => {
      const matchesSearch =
        !q ||
        med.name.toLowerCase().includes(q) ||
        med.genericName.toLowerCase().includes(q) ||
        med.brandNames.some((brand) => brand.toLowerCase().includes(q)) ||
        med.uses.some((use) => use.toLowerCase().includes(q)) ||
        med.category.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === 'All' || med.category === selectedCategory;

      const matchesRx =
        prescriptionFilter === 'all' ||
        (prescriptionFilter === 'otc' && !med.requiresPrescription) ||
        (prescriptionFilter === 'rx' && med.requiresPrescription);

      return matchesSearch && matchesCategory && matchesRx;
    });
  }, [searchTerm, selectedCategory, prescriptionFilter]);

  // Handle Search Input Change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setIsFiltering(true);
    if (value.trim()) {
      setSearchParams({ q: value.trim() });
    } else {
      setSearchParams({});
    }
    const timer = setTimeout(() => setIsFiltering(false), 80);
    return () => clearTimeout(timer);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setPrescriptionFilter('all');
    setSearchParams({});
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] text-[11px] font-bold border border-blue-200 mb-1">
            <Pill className="w-3 h-3" />
            Demonstration Drug Directory
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Medicine Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Search clinical monographs by brand name, generic chemical formula, or therapeutic category
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl self-start sm:self-auto shadow-xs">
          Showing <strong className="text-slate-900">{filteredMedicines.length}</strong> of {medicines.length} monographs
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Search Input Field */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by medicine name, generic name, or commercial brand (e.g. Paracetamol, Advil, Acetaminophen, Biogesic)..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white text-slate-900 placeholder:text-slate-400 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls: Categories and Prescription Type */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pt-1 border-t border-slate-100">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#2563EB]" />
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Rx vs OTC Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold shrink-0">
            <button
              onClick={() => setPrescriptionFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                prescriptionFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setPrescriptionFilter('otc')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                prescriptionFilter === 'otc'
                  ? 'bg-white text-[#0D9488] shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              OTC Only
            </button>
            <button
              onClick={() => setPrescriptionFilter('rx')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                prescriptionFilter === 'rx'
                  ? 'bg-white text-[#F59E0B] shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rx Only
            </button>
          </div>
        </div>
      </div>

      {/* Loading State or Results Grid */}
      {isFiltering ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin mx-auto" />
          <p className="mt-2 text-xs text-slate-500 font-medium">Filtering medicine records...</p>
        </div>
      ) : filteredMedicines.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMedicines.map((medicine) => (
            <MedicineCard key={medicine.id} medicine={medicine} />
          ))}
        </div>
      ) : (
        /* Empty Search Results State */
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
            <Pill className="w-7 h-7" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            No matching medicine monographs found
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            We couldn't find any medications matching "<strong>{searchTerm}</strong>". Check the spelling or reset filters to display all entries.
          </p>
          <div className="pt-2">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-blue-50 text-[#2563EB] text-xs font-bold rounded-xl hover:bg-blue-100 transition-colors"
            >
              Reset Search & Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
