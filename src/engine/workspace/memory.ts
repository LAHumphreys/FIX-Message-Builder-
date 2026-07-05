/**
 * In-memory WorkspaceProvider — the reference implementation the real
 * File System Access provider must match, and the test double.
 */
import type { WorkspaceEntry, WorkspaceFile, WorkspaceProvider, WriteResult } from './types.ts';

interface StoredFile {
  text: string;
  version: number;
}

export class MemoryWorkspace implements WorkspaceProvider {
  private readonly files = new Map<string, StoredFile>();

  /** Test hook: mutate a file as if an external editor / git pull did. */
  externallyModify(path: string, text: string): void {
    const existing = this.files.get(path);
    this.files.set(path, { text, version: (existing?.version ?? 0) + 1 });
  }

  list(directory: string): Promise<readonly WorkspaceEntry[]> {
    const prefix = directory.endsWith('/') ? directory : directory + '/';
    return Promise.resolve(
      [...this.files.entries()]
        .filter(([path]) => path.startsWith(prefix))
        .map(([path, file]) => ({ path, modifiedToken: String(file.version) }))
    );
  }

  read(path: string): Promise<WorkspaceFile | undefined> {
    const file = this.files.get(path);
    return Promise.resolve(
      file ? { path, text: file.text, modifiedToken: String(file.version) } : undefined
    );
  }

  write(path: string, text: string, expectedToken: string | undefined): Promise<WriteResult> {
    const existing = this.files.get(path);
    if (existing && expectedToken !== String(existing.version)) {
      return Promise.resolve({
        ok: false,
        reason: 'conflict',
        currentToken: String(existing.version),
      });
    }
    const version = (existing?.version ?? 0) + 1;
    this.files.set(path, { text, version });
    return Promise.resolve({ ok: true, entry: { path, modifiedToken: String(version) } });
  }
}
