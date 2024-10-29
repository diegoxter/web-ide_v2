<script lang="ts">
  import { Icon } from "@sveltestrap/sveltestrap";
  import FExpToolbar from "./FExpToolbar.svelte";

  // biome-ignore lint/style/useConst: svelte variable
  let hoveredFile: string | null = $state(null)
  // biome-ignore lint/style/useConst: svelte variable
  let { directories, openFile, selectedFile }: {directories: DBDirectoryEntry[], openFile: (e: string)=> void, selectedFile: string | null } = $props();

  let isOpen: string[] = $state([]);

  function handleDirectoryClick(directoryName: string) {
    if (isOpen.includes(directoryName)) {
      const newArray = isOpen.filter(name => name !== directoryName)
      isOpen = newArray
    } else {
      isOpen.push(directoryName);
    }
  }

  function returnLiBackground(fileName: string, directoryName: string) {
    if (hoveredFile === fileName) {
      return "#858585a6"
    }

    const thisFile = `${directoryName}-${fileName}`
    if (selectedFile === thisFile) {
      return "#b7b7b785"
    }
  }

</script>

<h6>File Explorer</h6>

<FExpToolbar />

{#each (directories as DBDirectoryEntry[]) as directory}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="folder"
    onclick={() => handleDirectoryClick(directory.name)} 
    style:background={isOpen.includes(directory.name)? "#333232a6":""}
    style:color={isOpen.includes(directory.name)? "white":""}
  >
    <Icon
      name={isOpen.includes(directory.name) ? "folder2-open" : "folder"}
      style="cursor: pointer;"
    />
    &nbsp;
    <span>
      {directory.name}
    </span>
  </div>

  {#if isOpen.includes(directory.name)}
      {#each directory.files as file}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <li
          id={`${directory.name}-${file.name}`}
          onmouseenter={() => hoveredFile = file.name}
          onmouseleave={() => hoveredFile = null}
          onclick={(e) => openFile((e.target as HTMLElement).id)}
          style:border={hoveredFile === file.name? "1px solid #333232a6":""}
          style:background={returnLiBackground(file.name, directory.name)}
          style:color={hoveredFile === file.name? "white":""}
        >
          <Icon name="file-code" style=" cursor: pointer;" />
          {file.name}
        </li>
      {/each}
  {/if}

{/each}

<style>
  li {
    list-style-type: none;
    padding-inline-start: 0.8rem;
    border-radius: 6px;
    user-select: none;
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
</style>
