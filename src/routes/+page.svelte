<script lang="ts">
  import {
    Container,
    Col,
    Nav,
    NavItem,
    NavLink,
    Row,
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

  function closeSidebar(isCurrentTab: boolean, newTab: string) {
    isOpen = isCurrentTab ? !isOpen : true;
    activeBar = newTab;
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

    <Col><Editor /></Col>
  </Row>
</Container>
