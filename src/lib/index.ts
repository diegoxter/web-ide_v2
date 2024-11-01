// place files you want to import through the `$lib` alias in this folder.

import DeployBar from "./components/DeployBar.svelte";
import FileExplorerBar from "./components/FileExplorer/FileExplorerBar.svelte";
import Editor from "./components/Editor.svelte";
import EditorTabComp from "./components/EditorTabComp.svelte";
import HomeTab from "./components/HomeTab.svelte";

import {
  doLiveAutocomplete,
  myCompleter,
  snippets,
  createSnippets,
  registerSnippets,
  script,
} from "./lua_autocomplete";

import { openDatabase, listDirectoriesWithFiles, addFile, addDirectory } from "./db";

export {
  DeployBar,
  FileExplorerBar,
  Editor,
  EditorTabComp,
  doLiveAutocomplete,
  HomeTab,
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
