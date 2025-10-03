import { useState } from 'react';
import MappingPage from './pages/MappingPage';
import ExecutivePage from './pages/ExecutivePage';
import { File as FileEdit, ClipboardCheck } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('mapping');

  return (
    <div className="h-screen flex flex-col font-sans">
      <nav className="bg-gray-900 text-white shadow-md">
        <div className="flex">
          <button
            onClick={() => setCurrentView('mapping')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${currentView === 'mapping' ? 'bg-blue-600' : 'hover:bg-gray-800'
              }`}
          >
            <FileEdit size={18} /> Field Mapping
          </button>
          <button
            onClick={() => setCurrentView('executive')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${currentView === 'executive' ? 'bg-blue-600' : 'hover:bg-gray-800'
              }`}
          >
            <ClipboardCheck size={18} /> Executive Review
          </button>
        </div>
      </nav>

      <main className="flex-1 overflow-hidden">
        {currentView === 'mapping' ? <MappingPage /> : <ExecutivePage />}
      </main>
    </div>
  );
}

export default App;