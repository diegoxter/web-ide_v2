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
    id: number;
    name: string;
    content: string;
    directoryId: number;
    isEditing: boolean;
  }

  interface FileOperationButton {
    icon: string;
    name: string;
    handler: (type: string, elem: DBDirectoryEntry | FileEntry) => void;
  }

  interface DBDirectoryEntry {
    id: number;
    name: string;
    files: FileEntry[];
    isEditing: boolean;
  }
}

export {};
