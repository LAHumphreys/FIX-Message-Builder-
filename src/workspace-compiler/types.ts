/**
 * Profile workspace (docs/PROFILE-WORKSPACE.md): a directory of small
 * entity files compiled into the single profile + instrument DB the app
 * consumes. The compiler is pure — it maps file contents to outputs and
 * issues; all filesystem access lives in the CLI shell.
 */

/** Relative path (e.g. "links/east-uat.json") → file text. */
export type WorkspaceFiles = ReadonlyMap<string, string>;

export interface CompileIssue {
  readonly severity: 'error' | 'warning';
  /** Source file the problem lives in ('' when it spans the workspace). */
  readonly file: string;
  /** JSON path within that file ('' for whole-file problems). */
  readonly path: string;
  readonly message: string;
}

export interface CompileResult {
  /** Assembled profile object (present unless errors prevented assembly). */
  readonly profile?: Record<string, unknown>;
  /** Canonical work.profile.json text. */
  readonly profileText?: string;
  /** Canonical instruments.json text (present when instruments exist). */
  readonly instrumentsText?: string;
  readonly issues: readonly CompileIssue[];
}

/** tag → value sugar: a literal string or a generator reference. */
export type SugarValue = string | { readonly generator: string };
export type TagValueMap = Readonly<Record<string, SugarValue>>;
