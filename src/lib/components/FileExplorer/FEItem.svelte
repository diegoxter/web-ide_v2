<script lang="ts">
  import { Icon } from "@sveltestrap/sveltestrap";
  import { onMount, type Snippet } from "svelte";

  // biome-ignore lint/style/useConst: svelte variable
  let {
    fileType,
    entryElem,
    parentDirectoryName = null,
    hoveredFile = null,
    hoveredDirectory = null,
    openFile,
    openDirectories = null,
    fileOperationButtons,
    handleDirectoryClick,
    fileOperationButton,
    returnLiBackground,
    handleRenaming,
  }: {
    fileType: string;
    entryElem: DBDirectoryEntry | FileEntry;
    parentDirectoryName?: string | null;
    hoveredDirectory?: string | null;
    hoveredFile?: string | null;
    openFile?: (e: HTMLElement) => void | null;
    openDirectories?: string[] | null;
    fileOperationButtons: FileOperationButton[];
    handleDirectoryClick?: (
      directoryName: string,
      e: HTMLElement,
      isEditing: boolean
    ) => void | null;
    fileOperationButton: (
      icon: string,
      text: string,
      clickHandler: (
        type: string,
        elem: DBDirectoryEntry | FileEntry
      ) => void,
      index: number,
      element: DBDirectoryEntry | FileEntry,
      type: string,
    ) => ReturnType<Snippet>;
    returnLiBackground?: (
      fileName: string,
      directoryName: string
    ) => string | string | undefined | null;
    handleRenaming: (
      elem: DBDirectoryEntry | FileEntry,
      e: KeyboardEvent
    ) => void;
  } = $props();

  let itemRef: HTMLElement | null = $state(null)

  onMount(() => {
    if (entryElem.isEditing) {
      itemRef!.focus()
    }
  })

  const returnEntryElemclickHandler = (e: Event | MouseEvent) => {
    if (fileType === "file") {
      entryElem.isEditing? null : openFile!(e.target as HTMLElement)
    } else {
      handleDirectoryClick!(entryElem.name, e.target as HTMLElement, entryElem.isEditing)
    }
  }

  const returnEntryElemBackground = () => {
    if (fileType === "file") {
      return returnLiBackground!(entryElem.name, parentDirectoryName as string)
    } else {
      return openDirectories!.includes(entryElem.name)? "#333232a6":""
    }
  }

  const returnEntryElemOnMouseEnter = () => {
    if (fileType === "file") {
      hoveredFile = entryElem.name
    } else {
      hoveredDirectory = entryElem.name
    }
  }

  const returnEntryElemOnMouseLeave = () => {
    if (fileType === "file") {
      hoveredFile = null
    } else {
      hoveredDirectory = null
      console.log("directory")
    }
  }

  const returnEntryElemIcon = () => {
    if (fileType === "file") {
      return "file-code"
    } else {
      return openDirectories!.includes(entryElem.name) ? "folder2-open" : "folder"
    }
  }

  const returnEntryElemFileOperationBoolean = () => {
    if (fileType === "file") {
      return hoveredFile === entryElem.name && !entryElem.isEditing
    } else {
      return hoveredDirectory === entryElem.name && !entryElem.isEditing
    }

  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<li
  id={fileType === "file"? `${parentDirectoryName}-${entryElem.name}`: null}
  class={fileType === "file"? "file":"folder"}
  onmouseenter={returnEntryElemOnMouseEnter}
  onmouseleave={returnEntryElemOnMouseLeave}
  onclick={returnEntryElemclickHandler}
  style:background={returnEntryElemBackground() as String | Number | null | undefined}
>
  <span id={fileType === "file"? `${parentDirectoryName}-${entryElem.name}`: null}>
    <Icon name={returnEntryElemIcon()}  onclick={(e)=> e.stopPropagation}/>
    {#if entryElem.isEditing}
      <input bind:this={itemRef} id="plainExample" type="text" value={entryElem.name} onkeydowncapture={(e)=>handleRenaming(entryElem, e)}/>
    {:else}
      <span id={fileType === "file"? `${parentDirectoryName}-${entryElem.name}`: null}>
        {entryElem.name}
      </span>
    {/if}
  </span>

  <div id="file-buttons">
    {#if returnEntryElemFileOperationBoolean()}
      {#each fileOperationButtons as btnData, i}
        {#if fileType === "file"}
          {#if  i > 0}
            {@render fileOperationButton(btnData.icon, btnData.name, btnData.handler, i, entryElem, "file")}
          {/if}
          {:else}
            {@render fileOperationButton(btnData.icon, btnData.name, btnData.handler, i, entryElem, "directory")}
        {/if}
      {/each}
    {/if}
  </div>
</li>


<style>
 input[type="text"] {
    width: 82%;
  }

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

 .file {
    list-style-type: none;
    padding-inline-start: 1.16rem;
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
