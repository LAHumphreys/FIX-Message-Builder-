import { useEffect, useReducer, type ReactNode } from 'react';
import { loadBaseDictionary } from '../../engine/index.ts';
import { initialState } from './types.ts';
import { reducer } from './reducer.ts';
import { DispatchContext, StateContext } from './context.ts';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load the base dictionary whenever the effective FIX version changes.
  // Failures must surface: the dictionary is a lazy-loaded chunk, and a
  // stale cached bundle can request a file a newer deploy no longer serves —
  // swallowing that leaves the builder empty with no explanation.
  const fixVersion = state.fixVersion === 'profile' ? state.profile?.fixVersion : state.fixVersion;
  useEffect(() => {
    if (!fixVersion) return;
    let cancelled = false;
    loadBaseDictionary(fixVersion)
      .then((dictionary) => {
        if (!cancelled) dispatch({ type: 'dictionary-loaded', dictionary });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          dispatch({
            type: 'dictionary-error',
            message: `The ${fixVersion} dictionary failed to load (${String(error)})`,
          });
        }
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
