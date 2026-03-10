import MainApp from "./MainApp";
import { DevModeProvider } from "@/core/contexts/DevModeContext";
import { useDevModeSync } from "@/core/hooks/useDevModeSync";

function AppWithSync() {
  // Sincronizar contexto con mockAdapter
  useDevModeSync();
  
  return <MainApp />;
}

export default function App() {
  // App original con DevModeProvider
  return (
    <DevModeProvider>
      <div className="min-h-screen" style={{
        backgroundImage: `
          linear-gradient(to bottom, #f5f3f0 0%, #f8f6f3 100%),
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.008) 2px,
            rgba(0, 0, 0, 0.008) 4px
          )
        `,
        backgroundBlendMode: 'overlay'
      }}>
        <AppWithSync />
      </div>
    </DevModeProvider>
  );
}