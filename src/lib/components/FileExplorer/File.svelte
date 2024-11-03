<script lang="ts">
  import { Icon } from "@sveltestrap/sveltestrap";
  import { onMount, type Snippet } from "svelte";

  // biome-ignore lint/style/useConst: svelte variable
  let {
    file,
    directory,
    hoveredFile,
    openFile,
    fileOperationButtons,
    fileOperationButton,
    returnLiBackground,
    handleRenaming,
  }: {
    file: FileEntry;
    directory: DBDirectoryEntry;
    hoveredFile: string | null;
    openFile: (e: HTMLElement) => void;
    fileOperationButtons: FileOperationButton[];
    fileOperationButton: (
      icon: string,
      text: string,
      clickHandler: (type: string, elem: DBDirectoryEntry | FileEntry) => void,
      index: number,
      element: DBDirectoryEntry | FileEntry,
      type: string,
    ) => ReturnType<Snippet>;
    returnLiBackground: (fileName: string, directoryName: string) => string | string | undefined;
    handleRenaming: (elem: DBDirectoryEntry | FileEntry, e: KeyboardEvent) => void;
  } = $props();

  let itemRef: HTMLElement | null = $state(null)

  onMount(() => {
    if (file.isEditing) {
      itemRef!.focus()
    }
  })
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<li
  id={`${directory.name}-${file.name}`}
  onmouseenter={() => hoveredFile = file.name}
  onmouseleave={() => hoveredFile = null}
  onclick={file.isEditing? null : (e) => {openFile(e.target as HTMLElement)}}
  style:background={returnLiBackground(file.name, directory.name)}
>
  <span id={`${directory.name}-${file.name}`}>
    <Icon name="file-code" onclick={(e)=> e.stopPropagation}/>
    {#if file.isEditing}
      <input bind:this={itemRef} id="plainExample" type="text" value={file.name} onkeydowncapture={(e)=>handleRenaming(file, e)}/>
    {:else}
      <span id={`${directory.name}-${file.name}`}>
        {file.name}
      </span>
    {/if}
  </span>

  <div id="file-buttons">
    {#if hoveredFile === file.name && !file.isEditing}
      {#each fileOperationButtons as btnData, i}
        {#if i > 0}
           {@render fileOperationButton(btnData.icon, btnData.name, btnData.handler, i, file, "file")}
        {/if}
      {/each}
    {/if}
  </div>
</li>


<style>
 input[type="text"] {
    width: 82%;
  }

  li {
    list-style-type: none;
    padding-inline-start: 1.2rem;
    border-radius: 6px;
    user-select: none;
    display: inline-flex;
    width: 100%;
    justify-content: space-between;
    background: local;

    button {
      color: #8c8c8c !important;
    }

    &:hover {
      background: #c5c5c5;
      border: 1px solid #333232a6;
      color: white;
    }
  }
</style>
