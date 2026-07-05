/**
 * Embedded-mode host bridge protocol.
 *
 * When the builder runs inside an iframe, an internal "host page" (kept in
 * the user's private repo) can drive it via window.postMessage. postMessage
 * is inter-window communication, not network activity — the builder itself
 * still makes zero requests; any Ajax happens in the host page, on the
 * host's origin, under the host's CSP.
 *
 * Handshake:
 *   builder → host  fixbuilder:ready     (on load, when embedded)
 *   host → builder  fixbuilder:config    (profile / instruments / scenario texts)
 *   builder → host  fixbuilder:send      (user pressed Send)
 *   host → builder  fixbuilder:response  (outcome of the host's delivery)
 *
 * Security: the builder only listens when embedded, only accepts messages
 * from its parent window, and pins the origin of the first config message —
 * later messages from other origins are ignored.
 */

export const PROTOCOL_VERSION = 1;

/** Builder → host: announced once on load when running embedded. */
export interface ReadyMessage {
  readonly type: 'fixbuilder:ready';
  readonly protocolVersion: number;
}

/** Host → builder: inject workspace files (same content as file drops). */
export interface ConfigMessage {
  readonly type: 'fixbuilder:config';
  /** JSON text (or object) of a *.profile.json. */
  readonly profile?: string | object;
  /** JSON/CSV text (or object) of an instrument DB. */
  readonly instruments?: string | object;
  /** JSON text (or object) of a *.scenario.json to apply. */
  readonly scenario?: string | object;
}

export interface SendMessagePayload {
  /** The message rendered through the selected JSON mapping. */
  readonly json: unknown;
  /** The same message as pipe-delimited tag=value (debugging aid). */
  readonly wire: string;
}

/** Builder → host: the user pressed Send. */
export interface SendMessage {
  readonly type: 'fixbuilder:send';
  readonly requestId: string;
  readonly protocolVersion: number;
  readonly system: string;
  readonly systemLabel: string;
  readonly fixVersion: string;
  readonly msgType: string;
  readonly mode: string;
  readonly scenarioName: string;
  /** Opaque per-system routing data from the profile (transportHints). */
  readonly transportHints?: unknown;
  readonly messages: readonly SendMessagePayload[];
}

/** Host → builder: outcome of a send. */
export interface ResponseMessage {
  readonly type: 'fixbuilder:response';
  readonly requestId: string;
  readonly ok: boolean;
  /** e.g. HTTP status code. */
  readonly status?: number | string;
  /** Response body / error detail — any JSON-serialisable value. */
  readonly body?: unknown;
  readonly error?: string;
  readonly timingMs?: number;
}

export type HostToBuilderMessage = ConfigMessage | ResponseMessage;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

export function parseHostMessage(data: unknown): HostToBuilderMessage | undefined {
  if (!isRecord(data) || typeof data.type !== 'string') return undefined;
  if (data.type === 'fixbuilder:config') return data as unknown as ConfigMessage;
  if (data.type === 'fixbuilder:response' && typeof data.requestId === 'string') {
    return data as unknown as ResponseMessage;
  }
  return undefined;
}

/** Normalise a config entry that may be an object or JSON text. */
export function configText(value: string | object | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'string' ? value : JSON.stringify(value);
}
