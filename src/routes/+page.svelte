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
  import {
    Editor,
    DeployBar,
    FileExplorerBar,
    openDatabase,
    listDirectoriesWithFiles,
    addDirectory,
    addFile,
    script,
  } from "$lib";
  import { onMount } from "svelte";

  let isOpen: boolean = $state(true);
  let activeBar: string = $state("files");
  let db: IDBDatabase = $state(null);

  let links = [
    {
      path: "files",
      icon: "files",
    },
    {
      path: "deploy",
      icon: "plugin",
    },
  ];

  let files: DBFileEntry[] = $state([]);

  let tabs: EditorTab[] = $state([
    { fileName: "tab name 1", content: "file 1" },
    { fileName: "tab name 2", content: "file 2" },
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

  onMount(() => {
    if (window && db == null) {
      openDatabase()
        .then((_db: IDBDatabase) => {
          db = _db;

          const transaction = db.transaction(["files"], "readonly");
          const store = transaction.objectStore("files");
          const request = store.openCursor();
          request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest<IDBCursor | null>)
              .result;
            if (!cursor) {
              addDirectory(db, "contracts").then(() =>
                addFile(db, 1, "test.lua", script).then((res) =>
                  console.log("created ", res),
                ),
              );
            }
          };

          request.onerror = (event: IDBRequest) => {
            console.error(
              "Error al verificar la existencia de entradas:",
              (event.target as IDBRequest).error,
            );
          };
        })
        .catch((err: any) => console.error(err));
    }
  });
  $effect(() => {
    if (db) {
      listDirectoriesWithFiles(db).then((res) => {
        files = res;
        console.log(res);
      });
    }
  });
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
              <Icon name={link.icon} />
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
        <FileExplorerBar directories={files} />
      {:else if activeBar == "deploy"}
        <DeployBar />
      {/if}
    </Col>

    <Col>
      <Row class="border border-1">
        <TabContent on:tab={(e) => (activeTab = e.detail)}>
          {#if tabs.length > 0}
            {#each tabs as tab}
              <TabPane tabId={tab.fileName} active={activeTab == tab.fileName}>
                <span
                  slot="tab"
                  onpointerover={() => (hoveredTab = tab.fileName)}
                  onpointerleave={() => (hoveredTab = "")}
                  style="display: inline-flex; cursor: default;"
                >
                  {tab.fileName}
                  <Icon
                    name="x"
                    style="display: {handleTabHover(
                      activeTab == tab.fileName,
                      hoveredTab == tab.fileName,
                    )}; cursor: pointer;"
                  />
                </span>

                <Editor content={tab.content} />
              </TabPane>
            {/each}
          {:else}
            empty tab bar
          {/if}
        </TabContent>
      </Row>
    </Col>
  </Row>
</Container>
