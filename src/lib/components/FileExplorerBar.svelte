<script lang="ts">
  import { Icon } from "@sveltestrap/sveltestrap";
  import FExpToolbar from "./FExpToolbar.svelte";
  import Tooltip from "./Tooltip.svelte";

  // biome-ignore lint/style/useConst: svelte variable
  let hoveredDirectory: string | null = $state(null);
  // biome-ignore lint/style/useConst: svelte variable
  let hoveredFile: string | null = $state(null);
  // biome-ignore lint/style/useConst: svelte variable
  let {
    directories,
    handleNewFile,
    handleRenameFile,
    handleDeleteFile,
    openFile,
    selectedFile,
  }: {
      directories: DBDirectoryEntry[];
      handleNewFile: (type: string, elem: DBDirectoryEntry | FileEntry)=> void;
      handleRenameFile: (type: string, elem: DBDirectoryEntry | FileEntry)=> void;
      handleDeleteFile: (type: string, elem: DBDirectoryEntry | FileEntry)=> void;
      openFile: (e: HTMLElement) => void;
      selectedFile: string | null
    } = $props();

  let isOpen: string[] = $state([]);

  function handleDirectoryClick(directoryName: string) {
    if (isOpen.includes(directoryName)) {
      const newArray = isOpen.filter((name) => name !== directoryName);
      isOpen = newArray;
    } else {
      isOpen.push(directoryName);
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

  const fileOperationButtons = [
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
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="folder"
    onclick={() => handleDirectoryClick(directory.name)}
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
      <span>
        {directory.name}
      </span>
    </span>

      <div style="display: block;">
        {#if hoveredDirectory === directory.name}
          {#each fileOperationButtons as btnData, i}
            {@render fileOperationButton(btnData.icon, btnData.name, btnData.handler, i, directory, "directory")}
          {/each}
        {/if}
      </div>
  </div>

  {#if isOpen.includes(directory.name)}
      {#each directory.files as file}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <li
          id={`${directory.name}-${file.name}`}
          onmouseenter={() => hoveredFile = file.name}
          onmouseleave={() => hoveredFile = null}
          onclick={(e) => {openFile(e.target as HTMLElement)}}
          style:background={returnLiBackground(file.name, directory.name)}
        >
          <span id={`${directory.name}-${file.name}`}>
            <Icon name="file-code" onclick={(e)=> e.stopPropagation}/>
            {file.name}
          </span>

          <div id="file-buttons">
            {#if hoveredFile === file.name}
              {#each fileOperationButtons as btnData, i}
                {#if i > 0}
                   {@render fileOperationButton(btnData.icon, btnData.name, btnData.handler, i, file, "file")}
                {/if}
              {/each}
            {/if}
          </div>
        </li>
      {/each}
  {/if}

{/each}

<style>
  li {
    list-style-type: none;
    padding-inline-start: 1.2rem;
    border-radius: 6px;
    user-select: none;

    button {
      color: #8c8c8c !important;

      &:hover {
       color: white !important;
      }
    }

    &:hover {
      border: 1px solid #333232a6;
      color: white;
    }
  }

  li, .folder {
    display: inline-flex;
    width: 100%;
    justify-content: space-between;
  }

  .folder {
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
</style>
