import { useEffect, useReducer, type ReactNode } from 'react';
import { loadBaseDictionary } from '../../engine/index.ts';
import { initialState } from './types.ts';
import { reducer } from './reducer.ts';
import { DispatchContext, StateContext } from './context.ts';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load the base dictionary whenever the effective FIX version changes.
  const fixVersion = state.fixVersion === 'profile' ? state.profile?.fixVersion : state.fixVersion;
  useEffect(() => {
    if (!fixVersion) return;
    let cancelled = false;
    void loadBaseDictionary(fixVersion).then((dictionary) => {
      if (!cancelled) dispatch({ type: 'dictionary-loaded', dictionary });
    });
    return () => {
      cancelled = true;
    };
  }, [fixVersion]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}
