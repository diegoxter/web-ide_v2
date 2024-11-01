<script lang="ts">
  import { Icon } from "@sveltestrap/sveltestrap";
  import type { Snippet } from "svelte";

  // biome-ignore lint/style/useConst: svelte variable
  let {
    directory,
    handleDirectoryClick,
    hoveredDirectory,
    isOpen,
    fileOperationButtons,
    fileOperationButton,
    handleRenaming,
  }: {
    directory: DBDirectoryEntry;
    handleDirectoryClick: (directoryName: string, e: HTMLElement, isEditing: boolean) => void;
    hoveredDirectory: string | null;
    isOpen: string[];
    fileOperationButtons: FileOperationButton[];
    fileOperationButton: (
      icon: string,
      text: string,
      clickHandler: (type: string, elem: DBDirectoryEntry | FileEntry) => void,
      index: number,
      element: DBDirectoryEntry | FileEntry,
      type: string,
    ) => ReturnType<Snippet>;
    handleRenaming: (elem: DBDirectoryEntry | FileEntry, e: KeyboardEvent) => void;
  } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="folder"
  onclick={(e) => handleDirectoryClick(directory.name, e.target as HTMLElement, directory.isEditing)}
  onmouseenter={() => hoveredDirectory = directory.name}
  onmouseleave={() => hoveredDirectory = null}
  style:background={isOpen.includes(directory.name)? "#333232a6":""}
  style:color={isOpen.includes(directory.name)? "white":""}
>
  <span>
    <Icon
      name={isOpen.includes(directory.name) ? "folder2-open" : "folder"}
      style="cursor: pointer;"
    />
    &nbsp;
    {#if directory.isEditing}
      <input id="plainExample" type="text" value={directory.name} onkeydowncapture={(e)=>handleRenaming(directory, e)}/>
    {:else}
      <span>
        {directory.name}
      </span>
    {/if}
  </span>

    <div style="display: block;">
      {#if hoveredDirectory === directory.name && !directory.isEditing}
        {#each fileOperationButtons as btnData, i}
          {@render fileOperationButton(btnData.icon, btnData.name, btnData.handler, i, directory, "directory")}
        {/each}
      {/if}
    </div>
</div>

<style>
  input[type="text"] {
    width: 82%;
  }

  :global {
    .folder {
      display: inline-flex;
      width: 100%;
      justify-content: space-between;
      background: white;
      margin-block-start: 0;
      padding-inline-start: 0;
      user-select: none;
      cursor:default;
      border: 1px solid white;
      border-radius: 6px;
      padding: 0 6px;

      &:hover {
        background: #595959;
        color: white;
      }
    }

    .file-button {
      border: 0;
      background: local !important;
      color: #aaaaaa;
      padding: 0 1px;

      &:hover {
        background: #595959;
        color: white;
      }
    }
  }
</style>
