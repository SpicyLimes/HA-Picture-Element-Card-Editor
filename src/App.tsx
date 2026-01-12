import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { useHAStore } from './store/haStore';
import { clsx } from 'clsx';

function App() {
  const { url, token, isConnected, isLoading, error, setConnection, connect } = useHAStore();

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900 overflow-hidden text-white">
      {/* Header */}
      <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <img src="spicylimes_icon.png" alt="Logo" className="h-10 w-10 object-contain" />
          <div>
            <h1 className="text-white font-bold text-lg tracking-wide leading-tight">Picture Element Card Editor</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">By SpicyLimes</p>
          </div>
        </div>

        {/* Home Assistant Connection (Fixed to Top Right) */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mr-2">Home Assistant Connection</span>
          <div className="flex items-center gap-3 bg-gray-900/50 p-2 rounded-lg border border-gray-700/50">
            <div className="flex flex-col">
              <input
                type="text"
                value={url}
                onChange={(e) => setConnection(e.target.value, token)}
                className="bg-gray-800 text-[11px] px-2 py-1 rounded border border-gray-700 focus:border-blue-500 outline-none w-40 placeholder-gray-600"
                placeholder="HA URL (HTTPS)"
              />
            </div>
            <div className="flex flex-col">
              <input
                type="password"
                value={token}
                onChange={(e) => setConnection(url, e.target.value)}
                className="bg-gray-800 text-[11px] px-2 py-1 rounded border border-gray-700 focus:border-blue-500 outline-none w-40 placeholder-gray-600"
                placeholder="Access Token"
              />
            </div>
            <button
              onClick={connect}
              disabled={isLoading}
              className={clsx(
                "px-4 py-1.5 rounded text-xs font-bold transition-all shadow-sm whitespace-nowrap",
                isConnected
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white",
                isLoading && "opacity-70 cursor-wait"
              )}
            >
              {isLoading ? 'Connecting...' : isConnected ? 'Connected' : 'Connect'}
            </button>

            {error && (
              <div className="group relative">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse cursor-help"></div>
                <div className="absolute top-full right-0 mt-2 w-64 bg-red-900/90 border border-red-500 p-2 rounded text-[10px] text-white hidden group-hover:block z-[100] shadow-xl">
                  {error}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <Canvas />
        <PropertiesPanel />
      </div>
    </div>
  )
}

export default App
