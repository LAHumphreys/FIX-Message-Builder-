import { createContext, useContext, type Dispatch } from 'react';
import { initialState, type Action, type AppState } from './types.ts';

export const StateContext = createContext<AppState>(initialState);
export const DispatchContext = createContext<Dispatch<Action>>(() => {});

export function useAppState(): AppState {
  return useContext(StateContext);
}

export function useAppDispatch(): Dispatch<Action> {
  return useContext(DispatchContext);
}
