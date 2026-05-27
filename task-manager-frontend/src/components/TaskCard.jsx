import { Link } from 'react-router-dom';

export function TaskCard({ task, onToggle, onClick }) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div
      onClick={onClick}
      className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg hover:border-violet-200 dark:hover:border-violet-700 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            task.completed
              ? 'bg-violet-600 border-violet-600'
              : 'border-gray-300 dark:border-gray-600 hover:border-violet-500'
          }`}
        >
          {task.completed && (
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <Link
            to={`/tasks/${task.id}`}
            onClick={(e) => e.stopPropagation()}
            className={`text-base font-medium transition-colors ${
              task.completed
                ? 'text-gray-400 dark:text-gray-500 line-through'
                : 'text-gray-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400'
            }`}
          >
            {task.title}
          </Link>

          {task.description && (
            <p
              className={`mt-1.5 text-sm line-clamp-2 ${
                task.completed
                  ? 'text-gray-300 dark:text-gray-600'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {task.description}
            </p>
          )}

          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(task.createdAt)}</span>
          </div>
        </div>

        <Link
          to={`/tasks/${task.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 opacity-0 group-hover:opacity-100 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}