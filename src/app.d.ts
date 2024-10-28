// See https://svelte.dev/docs/kit/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface EditorTab {
    directory: string;
		fileName: string;
		content: string;
	}

  interface FileEntry {
    name: string;
    content: string;
    id: number;
    directoryId: number
  }

  interface DBDirectoryEntry {
    name: string;
    files: FileEntry[];
  }
}

export {};
