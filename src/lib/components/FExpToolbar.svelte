<script lang="ts">
import { Icon } from "@sveltestrap/sveltestrap";
import Tooltip from "./Tooltip.svelte";

interface FileToolbarButtonData {
  icon: string;
  tip: string;
  id: string;
}

const buttons = [
  //{
  //  icon: "file-earmark",
  //  tip: "Create File",
  //  id: "create-file",
  //},
  //{
  //  icon: "folder",
  //  tip: "Create Folder",
  //  id: "create-folder",
  //},
  {
    icon: "file-arrow-up",
    tip: "Upload file",
    id: "upload-file",
  },
  {
    icon: "upload",
    tip: "Upload folder",
    id: "upload-folder",
  },
];
</script>

{#snippet fileButton(buttonData: FileToolbarButtonData, i: number)}
  <button
    type="button"
    class={`tooltip-${i} btn btn-outline-light`}
    id={buttonData.id}
    color="black"
    style="background: rgb(229 0 125 / 58%)"
  >
    <Icon name={buttonData.icon} />
    <Tooltip tooltipText={buttonData.tip} index={i}/>
  </button>
  {/snippet}

<div class="toolbar border border-1">
    {#each buttons as b, i}
        {@render fileButton(b, i)}
    {/each}
</div>

<style>
  .toolbar {
    display: flex;
    justify-content: space-around;
    min-height: 5%;
    margin-bottom: 12px;
    border: 1px solid black;
    border-radius: 7px;
  }
</style>
