<script lang="ts">
  import { Col, Container, Icon, Row } from "@sveltestrap/sveltestrap";

  interface FileToolbarButtonData {
    icon: string;
    tip: string;
    id: string;
  }

  const buttons = [
    {
      icon: "file-earmark",
      tip: "Create File",
      id: "create-file",
    },
    {
      icon: "folder",
      tip: "Create Folder",
      id: "create-folder",
    },
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
    <span class={`tooltiptext-${i}`}>{buttonData.tip}</span>
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
    justify-content: space-between;
    min-height: 5%;
    margin-bottom: 12px;
    border: 1px solid black;
    border-radius: 7px;
  }

  [class^="tooltip-"] {
    color: black;
    position: relative;
    display: inline-block;
    border-bottom: 1px dotted black;

    &:hover {
      color: white;
    }
  }

  [class^="tooltiptext-"] {
    font-size: 9.5px;
  }

  [class^="tooltip-"] [class^="tooltiptext-"] {
    visibility: hidden;
    width: 68px;
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 0;
    top: 125%;
    left: 50%;
    margin-left: -35px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  [class^="tooltip-"] [class^="tooltiptext-"]::after {
    content: "";
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent #555 transparent;
  }

  [class^="tooltip-"]:hover [class^="tooltiptext-"] {
    visibility: visible;
    opacity: 1;
  }
</style>
