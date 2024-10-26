<script lang="ts">
  import { Button, Icon, Tooltip } from "@sveltestrap/sveltestrap";
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
      tip: "Upload a file",
      id: "upload-file",
    },
    {
      icon: "upload",
      tip: "Upload a folder",
      id: "upload-folder",
    },
  ];
</script>

<div class="toolbar">
  {#each buttons as b}
    <Button
      class="f-btn"
      id={b.id}
      style="background: rgb(229 0 125 / 58%); color: black"
    >
      <Icon name={b.icon} />
    </Button>
    <Tooltip target={b.id} placement="bottom">test</Tooltip>
  {/each}
</div>

<style>
  .toolbar {
    min-height: 5%;
    margin-bottom: 12px;

    border: 1px solid black;
    border-radius: 7px;
  }
</style>
