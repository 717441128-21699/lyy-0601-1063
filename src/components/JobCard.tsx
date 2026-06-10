import { Link } from 'react-router-dom';
import { Heart, MapPin, Briefcase, GraduationCap, Clock, GitCompare } from 'lucide-react';
import type { Job, Company } from '../types';
import { useStore } from '../store/useStore';

interface JobCardProps {
  job: Job;
  company: Company;
  showCompare?: boolean;
}

export const JobCard = ({ job, company, showCompare = false }: JobCardProps) => {
  const toggleFavorite = useStore(state => state.toggleFavorite);
  const isFavorite = useStore(state => state.isFavorite(job.id));
  const hasApplied = useStore(state => state.hasApplied(job.id));
  const addToCompare = useStore(state => state.addToCompare);
  const removeFromCompare = useStore(state => state.removeFromCompare);
  const compareList = useStore(state => state.compareList);
  const inCompare = compareList.includes(job.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(job.id);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(job.id);
    } else {
      addToCompare(job.id);
    }
  };

  const formatSalary = () => {
    if (job.salary.type === 'monthly') {
      return `${job.salary.min}-${job.salary.max}K`;
    }
    return `${job.salary.min}-${job.salary.max}万/年`;
  };

  return (
    <Link
      to={`/job/${job.id}`}
      className="card card-hover block p-5 group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <img
            src={company.logo}
            alt={company.name}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-slate-100"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-slate-800 group-hover:text-primary-600 transition-colors truncate">
              {job.title}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5 truncate">{company.name}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-lg font-bold text-accent-600">
            {formatSalary()}
          </span>
          {hasApplied && (
            <div className="mt-1">
              <span className="badge badge-primary text-xs">已投递</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-slate-500">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {job.location.city}
        </span>
        <span className="flex items-center gap-1">
          <Briefcase className="w-3.5 h-3.5" />
          {job.experience}
        </span>
        <span className="flex items-center gap-1">
          <GraduationCap className="w-3.5 h-3.5" />
          {job.education}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {job.tags.slice(0, 3).map(tag => (
          <span key={tag} className="badge badge-slate">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {job.publishDate}发布
        </span>
        <div className="flex items-center gap-2">
          {showCompare && (
            <button
              onClick={handleCompareClick}
              className={`p-1.5 rounded-lg transition-colors ${
                inCompare
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title="对比职位"
            >
              <GitCompare className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleFavoriteClick}
            className={`p-1.5 rounded-lg transition-all ${
              isFavorite
                ? 'text-red-500 hover:text-red-600'
                : 'text-slate-400 hover:text-red-500 hover:bg-slate-100'
            }`}
            title={isFavorite ? '取消收藏' : '收藏'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </Link>
  );
};
