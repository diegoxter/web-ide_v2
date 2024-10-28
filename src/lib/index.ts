// place files you want to import through the `$lib` alias in this folder.

import DeployBar from "./components/DeployBar.svelte";
import FileExplorerBar from "./components/FileExplorerBar.svelte";
import Editor from "./components/Editor.svelte";
import EditorTabBar from "./components/EditorTabBar.svelte";

import {
	doLiveAutocomplete,
	myCompleter,
	snippets,
	createSnippets,
	registerSnippets,
	script,
} from "./lua_autocomplete";

import {
	openDatabase,
	listDirectoriesWithFiles,
	addFile,
	addDirectory,
} from "./db";

export {
	DeployBar,
	FileExplorerBar,
	Editor,
	EditorTabBar,
	doLiveAutocomplete,
	myCompleter,
	snippets,
	script,
	createSnippets,
	registerSnippets,
	openDatabase,
	listDirectoriesWithFiles,
	addFile,
	addDirectory,
};
