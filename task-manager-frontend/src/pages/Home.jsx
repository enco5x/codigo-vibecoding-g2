import { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from '../components/TaskCard';
import { SearchBar } from '../components/SearchBar';
import { FilterTabs } from '../components/FilterTabs';
import { TaskDialog } from '../components/TaskDialog';
import { LoadingSpinner, EmptyState } from '../components/Feedback';

export function Home() {
  const { filteredTasks, loading, error, toggleComplete, createTask, updateTask } = useTasks();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSave = async (data, isDelete) => {
    if (isDelete) {
      await updateTask(null, true);
      return;
    }
    await createTask(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">TECSUP VIBE CODING</h1>
            <h2 className="text-3xl font-bold text-gray-700 dark:text-white">CONTROL DE TAREAS</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Felipe Enco<br />
              Organiza tu trabajo fácilmente
            </p>
          </div>
          <button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700 shadow-lg shadow-violet-500/25 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva
          </button>
        </div>

        <div className="mb-6 space-y-4">
          <SearchBar />
          <FilterTabs />
        </div>

        {loading && filteredTasks.length === 0 ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : filteredTasks.length === 0 ? (
          <EmptyState
            message="No hay tareas para mostrar"
            action={
              <button
                onClick={() => setDialogOpen(true)}
                className="px-4 py-2 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors"
              >
                Crear tu primera tarea
              </button>
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={() => toggleComplete(task.id)}
                onClick={() => window.location.href = `/tasks/${task.id}`}
              />
            ))}
          </div>
        )}
      </div>

      {dialogOpen && (
        <TaskDialog
          onClose={() => setDialogOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}