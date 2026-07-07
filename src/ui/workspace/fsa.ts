/**
 * File System Access workspace provider (brief §3.9 Tier 1, milestone 6).
 * Implements the engine's WorkspaceProvider seam over a user-granted
 * directory handle. Chromium-only; everything is feature-detected and the
 * UI stays on Tier 2 (file picker + download) elsewhere.
 *
 * Zero network involved: the File System Access API is local disk.
 */
import type {
  WorkspaceEntry,
  WorkspaceFile,
  WorkspaceProvider,
  WriteResult,
} from '../../engine/index.ts';

/* Minimal ambient surface — keeps compiling even where lib.dom lacks FSA. */
interface FsaFileHandle {
  readonly kind: 'file';
  readonly name: string;
  getFile(): Promise<File>;
  createWritable(): Promise<{ write(data: string): Promise<void>; close(): Promise<void> }>;
}
interface FsaDirectoryHandle {
  readonly kind: 'directory';
  readonly name: string;
  values(): AsyncIterable<FsaFileHandle | FsaDirectoryHandle>;
  getDirectoryHandle(name: string, options?: { create?: boolean }): Promise<FsaDirectoryHandle>;
  getFileHandle(name: string, options?: { create?: boolean }): Promise<FsaFileHandle>;
  queryPermission?(desc: { mode: string }): Promise<string>;
  requestPermission?(desc: { mode: string }): Promise<string>;
}

export function isWorkspaceSupported(): boolean {
  return typeof window !== 'undefined' && 'showDirectoryPicker' in window;
}

export async function pickWorkspaceDirectory(): Promise<FsaDirectoryHandle> {
  const picker = (
    window as unknown as { showDirectoryPicker(o?: unknown): Promise<FsaDirectoryHandle> }
  ).showDirectoryPicker;
  return picker({ mode: 'readwrite' });
}

/** Re-ask permission on a handle restored from IndexedDB (one click, or zero). */
export async function ensurePermission(handle: FsaDirectoryHandle): Promise<boolean> {
  const desc = { mode: 'readwrite' };
  if ((await handle.queryPermission?.(desc)) === 'granted') return true;
  return (await handle.requestPermission?.(desc)) === 'granted';
}

export class FsaWorkspace implements WorkspaceProvider {
  constructor(
    readonly handle: FsaDirectoryHandle,
    readonly name = handle.name
  ) {}

  private async resolveDir(
    directory: string,
    create = false
  ): Promise<FsaDirectoryHandle | undefined> {
    let dir = this.handle;
    for (const part of directory.split('/').filter(Boolean)) {
      try {
        dir = await dir.getDirectoryHandle(part, { create });
      } catch {
        return undefined;
      }
    }
    return dir;
  }

  async list(directory: string): Promise<readonly WorkspaceEntry[]> {
    const dir = await this.resolveDir(directory);
    if (!dir) return [];
    const entries: WorkspaceEntry[] = [];
    for await (const child of dir.values()) {
      if (child.kind !== 'file') continue;
      const file = await child.getFile();
      entries.push({
        path: `${directory}/${child.name}`,
        modifiedToken: String(file.lastModified),
      });
    }
    return entries.sort((a, b) => (a.path < b.path ? -1 : 1));
  }

  async read(path: string): Promise<WorkspaceFile | undefined> {
    const slash = path.lastIndexOf('/');
    const dir = await this.resolveDir(slash > 0 ? path.slice(0, slash) : '');
    if (!dir) return undefined;
    try {
      const handle = await dir.getFileHandle(path.slice(slash + 1));
      const file = await handle.getFile();
      return { path, modifiedToken: String(file.lastModified), text: await file.text() };
    } catch {
      return undefined;
    }
  }

  async write(path: string, text: string, expectedToken: string | undefined): Promise<WriteResult> {
    const slash = path.lastIndexOf('/');
    const dir = await this.resolveDir(slash > 0 ? path.slice(0, slash) : '', true);
    if (!dir) throw new Error(`cannot create directory for ${path}`);
    const name = path.slice(slash + 1);

    // Optimistic concurrency (§3.9): compare on-disk mtime with the token
    // captured at load; never silently clobber an external edit.
    if (expectedToken !== undefined) {
      const current = await this.read(path);
      if (current && current.modifiedToken !== expectedToken) {
        return { ok: false, reason: 'conflict', currentToken: current.modifiedToken };
      }
    }

    const handle = await dir.getFileHandle(name, { create: true });
    const writable = await handle.createWritable();
    await writable.write(text);
    await writable.close();
    const written = await handle.getFile();
    return { ok: true, entry: { path, modifiedToken: String(written.lastModified) } };
  }
}

/** Directories the fixb compiler reads (docs/PROFILE-WORKSPACE.md §3). */
const FIXB_DIRS = ['links', 'flows', 'conventions', 'mappings', 'instruments', 'fragments'];

/** Collect a fixb source workspace's files (workspace.json present at root). */
export async function readFixbSources(ws: FsaWorkspace): Promise<Map<string, string>> {
  const files = new Map<string, string>();
  const rootFiles = ['workspace.json', 'overrides.profile.json'];
  for (const name of rootFiles) {
    const file = await ws.read(name);
    if (file) files.set(name, file.text);
  }
  for (const dir of FIXB_DIRS) {
    for (const entry of await ws.list(dir)) {
      if (!/\.(json|csv)$/i.test(entry.path)) continue;
      const file = await ws.read(entry.path);
      if (file) files.set(entry.path, file.text);
    }
  }
  return files;
}

/* One workspace per app instance; the provider itself is not React state. */
let active: FsaWorkspace | undefined;
export function setActiveWorkspace(workspace: FsaWorkspace | undefined): void {
  active = workspace;
}
export function getActiveWorkspace(): FsaWorkspace | undefined {
  return active;
}
