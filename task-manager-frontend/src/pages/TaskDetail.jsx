import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { taskApi } from '../api/taskApi';
import { TaskDialog } from '../components/TaskDialog';
import { LoadingSpinner } from '../components/Feedback';

export function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      try {
        const data = await taskApi.getById(id);
        setTask(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleToggle = async () => {
    if (!task) return;
    try {
      const updated = await taskApi.update(task.id, { completed: !task.completed });
      setTask(updated);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = async (data, isDelete) => {
    if (isDelete) {
      await taskApi.delete(task.id);
      navigate('/');
      return;
    }
    const updated = await taskApi.update(task.id, data);
    setTask(updated);
    setDialogOpen(false);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <LoadingSpinner />;

  if (error && !task) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Tarea no encontrada</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al inicio
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            <button
              onClick={handleToggle}
              className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                task.completed
                  ? 'bg-violet-600 border-violet-600'
                  : 'border-gray-300 dark:border-gray-600 hover:border-violet-500'
              }`}
            >
              {task.completed && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <div className="flex-1">
              <h1 className={`text-2xl font-bold ${task.completed ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                {task.title}
              </h1>
              <div className="flex items-center gap-2 mt-3 text-sm text-gray-400 dark:text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Creada el {formatDate(task.createdAt)}
              </div>
            </div>
          </div>

          {task.description && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Descripción</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{task.description}</p>
            </div>
          )}

          <div className="flex items-center gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={() => setDialogOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar
            </button>
            <button
              onClick={handleToggle}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
          <span>ID: {task.id}</span>
          <span>Estado: {task.completed ? 'Completada' : 'Pendiente'}</span>
        </div>
      </div>

      {dialogOpen && (
        <TaskDialog
          task={task}
          onClose={() => setDialogOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}