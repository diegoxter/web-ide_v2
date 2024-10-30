<script lang="ts">
  import { TabPane, Icon } from "@sveltestrap/sveltestrap";

  // biome-ignore lint/style/useConst: svelte variable
  let {
    activeTab,
    hoveredTab,
    tab,
    i,
    changeTab,
    closeTab,
  }: {
    activeTab: number;
    hoveredTab: string;
    i: number;
    tab: EditorTab;
    changeTab: (i: number) => void;
    closeTab: (i: number) => void;
  } = $props();

  function handleTabHover(isTabActive: boolean, isHovered: boolean) {
    if (isTabActive) {
      return "block";
    }

    return isHovered ? "block" : "none";
  }
</script>

<TabPane tabId={i} active={activeTab == i}>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <span
    slot="tab"
    onpointerover={() => (hoveredTab = tab.fileName)}
    onpointerleave={() => (hoveredTab = "")}
    id={i.toString()}
    style="display: inline-flex; cursor: default;"
    onclick={(e) => changeTab(Number((e.target as HTMLElement).id))}
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
