<script lang="ts">
import { onMount } from "svelte";
import {
  doLiveAutocomplete,
  myCompleter,
  snippets,
  createSnippets,
  registerSnippets,
} from "../lua_autocomplete";
import type * as Ace from "ace-builds";

// biome-ignore lint/style/useConst: svelte variable
let { tabsContent }: { tabsContent: string | null } = $props();
let scriptLoaded = $state(false);
let ace: typeof Ace | null = $state(null);

function loadAce(): Promise<typeof Ace> {
  return new Promise((resolve) => {
    import("ace-builds").then((ace) => {
      resolve(ace);
    });
  });
}

onMount(async () => {
  if (typeof window !== "undefined") {
    const _ace = await loadAce();
    ace = _ace;

    if (!ace) {
      return;
    }

    ace.config.set("basePath", "https://unpkg.com/ace-builds@1.36.3/src-noconflict");

    scriptLoaded = true;
  }
});

$effect(() => {
  if (ace && scriptLoaded) {
    const editor = ace.edit("editor");
    editor.session.setMode("ace/mode/lua");
    editor.setTheme("ace/theme/tomorrow_night_bright");
    editor.setFontSize(18);
    editor.session.setOptions({ tabSize: 2, useSoftTabs: true });
    editor.setShowPrintMargin(false);

    ace.config.loadModule("ace/ext/language_tools", (ext) => {
      //ext.addCompleter(myCompleter);
      editor.setOptions({
        enableSnippets: true,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: myCompleter,
      });
    });
    editor.commands.on("afterExec", doLiveAutocomplete);

    setTimeout(() => {
      registerSnippets(ace, "lua", createSnippets(snippets));
    }, 3000);

    if (tabsContent !== null) {
      const session = ace.createEditSession(tabsContent, "ace/mode/lua");
      editor.setSession(session);
    }
  }
});
</script>

{#if scriptLoaded}
  <div id="editor">
    {tabsContent}
  </div>
{:else}
  Loading editor...
{/if}

<style>
  #editor {
    position: relative;
    min-height: 92.9vh;
  }
</style>
