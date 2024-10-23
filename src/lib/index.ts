// place files you want to import through the `$lib` alias in this folder.

import DeployBar from "./DeployBar.svelte";
import FileExplorerBar from "./FileExplorerBar.svelte";
import Editor from "./Editor.svelte";
import {
	doLiveAutocomplete,
	myCompleter,
	snippets,
	createSnippets,
	registerSnippets,
} from "./lua_autocomplete";

export {
	DeployBar,
	FileExplorerBar,
	Editor,
	doLiveAutocomplete,
	myCompleter,
	snippets,
	createSnippets,
	registerSnippets,
};
