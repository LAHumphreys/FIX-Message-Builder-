import { useEffect, useRef } from 'react';
import {
  parseInstrumentDb,
  parseProfile,
  parseScenario,
  scenarioCompatibility,
} from '../../engine/index.ts';
import { useAppDispatch, useAppState } from '../state/context.ts';
import { configText, parseHostMessage, PROTOCOL_VERSION } from './protocol.ts';
import { isEmbedded } from './embedded.ts';

/**
 * Listens for host-page messages when the builder runs embedded.
 * Renders nothing; it only wires window messaging to the reducer.
 */
export function HostBridge() {
  const dispatch = useAppDispatch();
  const { profile, hostOrigin } = useAppState();
  const pinnedOrigin = useRef<string | undefined>(hostOrigin);
  const profileRef = useRef(profile);
  profileRef.current = profile;

  useEffect(() => {
    if (!isEmbedded()) return;

    const onMessage = (event: MessageEvent) => {
      // Only the embedding parent may drive the builder; pin its origin on
      // first contact and ignore everyone else afterwards.
      if (event.source !== window.parent) return;
      if (pinnedOrigin.current && event.origin !== pinnedOrigin.current) return;
      const message = parseHostMessage(event.data);
      if (!message) return;
      if (!pinnedOrigin.current) {
        pinnedOrigin.current = event.origin;
        dispatch({ type: 'host-connected', origin: event.origin });
      }

      if (message.type === 'fixbuilder:config') {
        const profileText = configText(message.profile);
        if (profileText !== undefined) {
          const { profile: loaded, issues } = parseProfile(profileText);
          dispatch({ type: 'profile-loaded', profile: loaded, issues });
        }
        const instrumentsText = configText(message.instruments);
        if (instrumentsText !== undefined) {
          const { db, issues } = parseInstrumentDb(instrumentsText);
          dispatch({ type: 'instruments-loaded', db, issues });
        }
        const scenarioText = configText(message.scenario);
        if (scenarioText !== undefined) {
          const { scenario, issues } = parseScenario(scenarioText);
          // The profile from this same config message lands via the dispatch
          // above; compatibility is checked against the freshest one we have.
          const target =
            profileText !== undefined ? parseProfile(profileText).profile : profileRef.current;
          if (scenario) {
            dispatch({
              type: 'apply-scenario',
              scenario,
              findings: [
                ...issues.map((i) => ({
                  ruleId: 'scenario-load',
                  severity: i.severity,
                  path: i.path,
                  message: i.message,
                })),
                ...(target ? scenarioCompatibility(scenario, target) : []),
              ],
            });
          }
        }
      } else {
        dispatch({
          type: 'transport-response',
          id: message.requestId,
          ok: message.ok,
          ...(message.status !== undefined ? { status: message.status } : {}),
          ...(message.body !== undefined ? { body: message.body } : {}),
          ...(message.error !== undefined ? { error: message.error } : {}),
          ...(message.timingMs !== undefined ? { timingMs: message.timingMs } : {}),
        });
      }
    };

    window.addEventListener('message', onMessage);
    // Announce readiness so the host knows when to post config.
    window.parent.postMessage({ type: 'fixbuilder:ready', protocolVersion: PROTOCOL_VERSION }, '*');
    return () => window.removeEventListener('message', onMessage);
  }, [dispatch]);

  return null;
}
