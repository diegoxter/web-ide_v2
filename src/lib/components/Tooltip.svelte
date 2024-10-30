<script lang="ts">
  let { tooltipText, index }: { tooltipText: string; index: number | string } =
    $props();
</script>

<span class={`tooltiptext-${index}`}>{tooltipText}</span>

<style>
  :global {
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
  }
</style>
