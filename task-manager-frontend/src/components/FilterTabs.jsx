import { useTasks } from '../context/TaskContext';
import { FILTERS } from '../lib/constants';

export function FilterTabs() {
  const { filter, setFilter, tasks } = useTasks();

  const counts = {
    [FILTERS.ALL]: tasks.length,
    [FILTERS.PENDING]: tasks.filter((t) => !t.completed).length,
    [FILTERS.COMPLETED]: tasks.filter((t) => t.completed).length,
  };

  const tabs = [
    { key: FILTERS.ALL, label: 'Todas' },
    { key: FILTERS.PENDING, label: 'Pendientes' },
    { key: FILTERS.COMPLETED, label: 'Completadas' },
  ];

  return (
    <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setFilter(tab.key)}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filter === tab.key
              ? 'bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          {tab.label}
          <span className="ml-1.5 text-xs opacity-70">({counts[tab.key]})</span>
        </button>
      ))}
    </div>
  );
}