<script lang="ts">
  import { TabPane, Icon } from "@sveltestrap/sveltestrap";

  let {
    activeTab,
    hoveredTab,
    tab,
    i,
    closeTab,
  }: {
    activeTab: number;
    hoveredTab: string;
    i: number;
    tab: EditorTab;
    closeTab: (i: number) => void;
  } = $props();

  function handleTabHover(isTabActive: boolean, isHovered: boolean) {
    if (isTabActive) {
      return "block";
    } else {
      return isHovered ? "block" : "none";
    }
  }
</script>

<TabPane tabId={i} active={activeTab == i}>
  <span
    slot="tab"
    onpointerover={() => (hoveredTab = tab.fileName)}
    onpointerleave={() => (hoveredTab = "")}
    style="display: inline-flex; cursor: default;"
  >
    {tab.fileName}
    <button onclick={() => closeTab(i)} type="button" class="tab-close-btn">
      <Icon
        name="x"
        style="display: {handleTabHover(
          activeTab == i,
          hoveredTab == tab.fileName,
        )}; cursor: pointer;"
      />
    </button>
  </span>
</TabPane>

<style>
  .tab-close-btn {
    border: 0;
    background: local;
  }
</style>
