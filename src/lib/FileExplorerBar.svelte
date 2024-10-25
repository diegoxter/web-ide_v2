<script lang="ts">
  import { Icon } from "@sveltestrap/sveltestrap";
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

{#each (directories as DBFileEntry) as directory}
  <div type="button" class="folder" onclick={() => handleDirectoryClick(directory.name)} >
    <Icon
      name={isOpen.includes(directory.name) ? "folder2-open" : "folder"}
      style=" cursor: pointer;"
    />
    &nbsp;
    <span style={`background: ${isOpen.includes(directory.name)? "black":"white"}; color : ${isOpen.includes(directory.name)? "white":"black"}`}>{directory.name}</span>
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
    border: 0;
    background: white;
    margin-block-start: 0;
    padding-inline-start: 0;
    user-select: none;
    cursor:default;

    &:hover {
      span {
        background: black;
        color: white;
      }
    }
  }
</style>
