import { useStore } from './state/store'
import { ManifestoScreen } from './screens/ManifestoScreen'
import { StageScreen } from './screens/StageScreen'

export default function App() {
  const screen = useStore((s) => s.screen)

  return (
    <div className="w-screen h-screen overflow-hidden bg-ink text-paper">
      {screen === 'manifesto' ? <ManifestoScreen /> : <StageScreen />}
    </div>
  )
}
