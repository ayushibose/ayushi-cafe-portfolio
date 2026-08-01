import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

type Props = { children: ReactNode; fallback?: ReactNode };
type State = { hasError: boolean };

export default class SceneErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('3D scene error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-espresso-950 text-center">
            <AlertTriangle className="text-caramel-400" size={32} />
            <p className="text-cream-100">The 3D café could not load on this device.</p>
            <p className="text-sm text-espresso-200">You can still browse the standard portfolio below.</p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
