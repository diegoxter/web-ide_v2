<script lang="ts">
  import { Icon } from "@sveltestrap/sveltestrap";
  import FExpToolbar from "./FExpToolbar.svelte";
  import File from "./File.svelte";
  import Tooltip from "../Tooltip.svelte";

  // biome-ignore lint/style/useConst: svelte variable
  let {
    directories,
    handleNewFile,
    handleRenameFile,
    handleDeleteFile,
    handleRenaming,
    openFile,
    openDirectories,
    modifyOpenDirectories,
    selectedFile,
  }: {
    directories: DBDirectoryEntry[];
    handleNewFile: (type: string, elem: DBDirectoryEntry | FileEntry) => void;
    handleRenameFile: (type: string, elem: DBDirectoryEntry | FileEntry) => void;
    handleDeleteFile: (type: string, elem: DBDirectoryEntry | FileEntry) => void;
    handleRenaming: (elem: DBDirectoryEntry | FileEntry, e: KeyboardEvent) => void;
    openFile: (e: HTMLElement) => void;
    openDirectories: string[];
    modifyOpenDirectories: (newArray: string[]) => void;
    selectedFile: string | null;
  } = $props();

  
  // biome-ignore lint/style/useConst: svelte variable
  let hoveredDirectory: string | null = $state(null);
  // biome-ignore lint/style/useConst: svelte variable
  let hoveredFile: string | null = $state(null);

  function handleDirectoryClick(directoryName: string, e: HTMLElement, isEditing: boolean) {
    if (
      e.className === "bi-trash2" ||
      e.className === "bi-pencil-fill" ||
      e.className === "bi-file-earmark"
    ) {
      return;
    }

    if (isEditing) {
      return;
    }

    if (openDirectories.includes(directoryName)) {
      modifyOpenDirectories(openDirectories.filter((name) => name !== directoryName));
    } else {
      const newArray = [...openDirectories]
      newArray.push(directoryName);

      modifyOpenDirectories(newArray)
    }
  }

  function returnLiBackground(fileName: string, directoryName: string) {
    if (hoveredFile === fileName) {
      return "#858585a6";
    }

    const thisFile = `${directoryName}-${fileName}`;
    if (selectedFile === thisFile) {
      return "#b7b7b785";
    }
  }

  const fileOperationButtons: FileOperationButton[] = [
    {
      icon: "file-earmark",
      name: "Create new file",
      handler: handleNewFile,
    },
    {
      icon: "trash2",
      name: "Delete",
      handler: handleDeleteFile,
    },
    {
      icon: "pencil-fill",
      name: "Rename",
      handler: handleRenameFile,
    },
  ];
</script>

{#snippet fileOperationButton(icon: string, text: string, clickHandler: (type: string, elem: DBDirectoryEntry | FileEntry)=> void, index: number, element: DBDirectoryEntry | FileEntry, type: string)}
  <button
    type="button"
    class={`tooltip-${index}-file-button file-button`}
    onclick={()=>clickHandler(type, element)}
  >
    <Icon
      name={icon}
    />

    <Tooltip tooltipText={text} index={`${index}-file-button`} />
  </button>
{/snippet}

<h6>File Explorer</h6>

<FExpToolbar />

{#each (directories as DBDirectoryEntry[]) as directory}

  <File
    entryElem={directory}
    fileType={"directory"}
    {hoveredDirectory}
    {openDirectories}
    {fileOperationButtons}
    {handleDirectoryClick}
    {fileOperationButton}
    {handleRenaming}
  />

  {#if openDirectories.includes(directory.name)}
    {#each directory.files as file}
      <File
        entryElem={file}
        fileType={"file"}
        parentDirectoryName={directory.name}
        {hoveredFile}
        {openFile}
        {fileOperationButtons}
        {fileOperationButton}
        {returnLiBackground}
        {handleRenaming}
      />
    {/each}
  {/if}

{/each}


<style>
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
</style>
