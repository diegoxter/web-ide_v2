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
		fileName: String;
		content: String;
	}

	interface DBFileEntry {
		name: string;
		files: string[];
	}
}

export {};
