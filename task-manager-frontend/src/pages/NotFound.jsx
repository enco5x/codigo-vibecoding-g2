import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Página no encontrada</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">La página que buscas no existe o fue movida.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}