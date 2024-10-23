<script lang="ts">
  import { onMount } from "svelte";
  import {
    doLiveAutocomplete,
    myCompleter,
    snippets,
    createSnippets,
    registerSnippets,
  } from "$lib";

  let scriptLoaded = $state(false);

  onMount(() => {
    if (typeof window !== "undefined" && (window as any).ace) {
      scriptLoaded = true;
    } else {
      const script = document.createElement("script");
      script.src = "/ace/ace.js";
      script.type = "text/javascript";

      script.onload = () => {
        scriptLoaded = true;
      };

      document.head.appendChild(script);
    }
  });

  $effect(() => {
    if (scriptLoaded) {
      const ace = (window as any).ace;

      const editor = ace.edit("editor");
      editor.session.setMode("ace/mode/lua");
      editor.setTheme("ace/theme/tomorrow_night_bright");
      editor.setFontSize(18);
      editor.session.setOptions({ tabSize: 2, useSoftTabs: true });
      editor.setShowPrintMargin(false);

      ace.config.loadModule("ace/ext/language_tools", function () {
        editor.setOptions({
          enableSnippets: true,
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: myCompleter,
        });
      });
      editor.commands.on("afterExec", doLiveAutocomplete);

      setTimeout(function () {
        registerSnippets(ace, "lua", createSnippets(snippets));
      }, 3000);
    }
  });
</script>

<!--svelte:head>
  <script src="/ace/ace.js" type="text/javascript"></script>
</svelte:head-->

{#if scriptLoaded}
  <div id="editor">
  function test()
    return 'Hello World!'
end

abi.register(test)

--[[

Available Lua modules:
  string math table bit

Available Aergo modules:
  system contract db crypto bignum json

]]
  </div>
{:else}
  Loading editor...
{/if}

<style>
  #editor {
    position: relative;
    min-height: 100vh;
  }
</style>
