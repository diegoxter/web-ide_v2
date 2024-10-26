<script lang="ts">
  import { Icon } from "@sveltestrap/sveltestrap";
  import FExpToolbar from "./FExpToolbar.svelte";

  let { directories } = $props();

  let isOpen = $state([]);

  function handleDirectoryClick(directoryName: string) {
    if (isOpen.includes(directoryName)) {
      const newArray = isOpen.filter(name => name != directoryName)
      isOpen = newArray
    } else {
      isOpen.push(directoryName);
    }
  }

</script>

<h6>File Explorer</h6>

<FExpToolbar />

{#each (directories as DBFileEntry) as directory}
  <div type="button" class="folder" onclick={() => handleDirectoryClick(directory.name)} >
    <Icon
      name={isOpen.includes(directory.name) ? "folder2-open" : "folder"}
      style="cursor: pointer;"
    />
    &nbsp;
    <span 
      style:background={isOpen.includes(directory.name)? "#333232a6":""}
      style:color={isOpen.includes(directory.name)? "white":""}
    >{directory.name}</span>
  </div>

  {#if isOpen.includes(directory.name)}
      {#each directory.files as file}
        <li>
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

    user-select: none;
  }

  .folder {
    background: white;
    margin-block-start: 0;
    padding-inline-start: 0;
    user-select: none;
    cursor:default;

    span {
      border: 1px solid white;
      border-radius: 6px;
      padding: 0 6px;
    }


    &:hover {
      span {
        background: #595959;
        color: white;
      }
    }
  }

  
</style>
