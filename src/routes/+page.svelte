<script lang="ts">
  import {
    Container,
    Col,
    Icon,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane,
  } from "@sveltestrap/sveltestrap";
  import { Editor, DeployBar, FileExplorerBar } from "$lib";

  let links = [
    {
      path: "files",
      icon: "E",
    },
    {
      path: "deploy",
      icon: "D",
    },
  ];

  let isOpen = $state(true);
  let activeBar = $state("files");
  let tabs: EditorTab[] = $state([
    { fileName: "tab name 1" },
    { fileName: "tab name 2" },
  ]);
  let activeTab: string | number = $state(
    tabs.length > 0 ? tabs[0].fileName : "",
  );
  let hoveredTab = $state("");

  function closeSidebar(isCurrentTab: boolean, newTab: string) {
    isOpen = isCurrentTab ? !isOpen : true;
    activeBar = newTab;
  }
  function handleTabHover(isTabActive: boolean, isHovered: boolean) {
    if (isTabActive) {
      return "block";
    } else {
      return isHovered ? "block" : "none";
    }
  }
</script>

<Container fluid style="height: 100vmin">
  <Row style="height: 100%">
    <Col
      xs="1"
      style="width: 5%; margin-right: 8px; background: rgb(63 63 63);"
      class="border-end p-1"
    >
      <Nav vertical class="nav-pills">
        {#each links as link}
          <NavItem>
            <NavLink
              onclick={() => closeSidebar(activeBar == link.path, link.path)}
              style="margin-right: 1px;"
              class={`${
                activeBar === link.path ? "border-start border-2" : ""
              } rounded-0`}
            >
              {link.icon}
            </NavLink>
          </NavItem>
        {/each}
      </Nav>
    </Col>

    <Col
      class="border-end border-2"
      xs="2"
      style={`display: ${isOpen ? "block" : "none"}`}
    >
      {#if activeBar == "files"}
        <FileExplorerBar />
      {:else if activeBar == "deploy"}
        <DeployBar />
      {/if}
    </Col>

    <Col>
      <Row class="border border-1">
        <TabContent on:tab={(e) => (activeTab = e.detail)}>
          {#if tabs.length > 0}
            {#each tabs as tab, index}
              <TabPane tabId={tab.fileName} active={activeTab == tab.fileName}>
                <span
                  slot="tab"
                  onpointerover={() => (hoveredTab = tab.fileName)}
                  onpointerleave={() => (hoveredTab = "")}
                >
                  {tab.fileName}
                  <Icon
                    name="x"
                    style="display: {handleTabHover(
                      activeTab == tab.fileName,
                      hoveredTab == tab.fileName,
                    )}"
                  />
                </span>
                tab {index}
              </TabPane>
            {/each}
          {:else}
            empty tab bar
          {/if}
        </TabContent>
      </Row>

      <Row>
        <Editor />
      </Row>
    </Col>
  </Row>
</Container>
