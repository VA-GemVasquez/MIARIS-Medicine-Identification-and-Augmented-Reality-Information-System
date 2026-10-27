import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pill, ChevronRight, ShieldAlert, Sparkles } from 'lucide-react';
import type { Medicine } from '../../types/medicine';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { recordMedicineViewed } from '../../utils/recentMedicines';
import { getMedicinePlaceholderGradient } from '../../utils/formatters';

interface MedicineCardProps {
  medicine: Medicine;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({ medicine }) => {
  const [imgError, setImgError] = useState(false);
  const imgSrc = medicine.imagePath || medicine.imageUrl;
  const showImage = Boolean(imgSrc) && !imgError;
  const gradient = getMedicinePlaceholderGradient(medicine.name);

  const handleClick = () => {
    recordMedicineViewed(medicine.id);
  };

  return (
    <Card hoverEffect className="flex flex-col h-full bg-white group">
      {/* Image or placeholder */}
      <div className={`relative h-44 w-full overflow-hidden bg-gradient-to-br ${gradient}`}>
        {showImage ? (
          <img
            src={imgSrc}
            alt={`${medicine.name} packaging`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          /* Placeholder shown when no image or image fails to load */
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 select-none">
            <Pill className="w-10 h-10 text-slate-400 opacity-60" aria-hidden="true" />
            <span className="text-xs font-bold text-slate-400 opacity-70">{medicine.dosageForm}</span>
          </div>
        )}

        <div className="absolute top-2.5 left-2.5 flex gap-1.5 flex-wrap">
          <Badge variant="blue">{medicine.category}</Badge>
          {medicine.requiresPrescription ? (
            <Badge variant="warning" className="flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" aria-hidden="true" />
              Rx Required
            </Badge>
          ) : (
            <Badge variant="teal">OTC</Badge>
          )}
        </div>

        {medicine.isDemonstrationRecord && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-[10px] font-medium text-slate-200">
            Demo Record
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors">
                {medicine.name}
              </h3>
              <p className="text-xs font-medium text-slate-500">
                {medicine.genericName}
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md shrink-0">
              {medicine.strength}
            </span>
          </div>

          <p className="mt-2.5 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {medicine.description}
          </p>

          {medicine.brandNames.length > 0 && (
            <div className="mt-2.5 flex items-center gap-1 text-xs text-slate-500">
              <span className="font-semibold text-slate-700 shrink-0">Brands:</span>
              <span className="truncate">{medicine.brandNames.join(', ')}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Pill className="w-3.5 h-3.5 text-[#0D9488]" aria-hidden="true" />
            {medicine.dosageForm}
          </span>
          <div className="flex items-center gap-2">
            <Link
              to={`/ar?id=${medicine.id}`}
              onClick={handleClick}
              aria-label={`View ${medicine.name} in AR display`}
              className="text-xs font-semibold text-[#0D9488] hover:text-teal-700 p-1 rounded hover:bg-teal-50 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
            <Link
              to={`/library/${medicine.id}`}
              onClick={handleClick}
              aria-label={`View full details for ${medicine.name}`}
              className="inline-flex items-center gap-0.5 text-xs font-bold text-[#2563EB] hover:text-blue-700 transition-colors"
            >
              Details
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};
