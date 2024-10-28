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
    TabPane
  } from "@sveltestrap/sveltestrap";
  import {
    Editor,
    EditorTabComp,
    DeployBar,
    FileExplorerBar,
    HomeTab,
    openDatabase,
    listDirectoriesWithFiles,
    addDirectory,
    addFile,
    script,
  } from "$lib";
  import { onMount } from "svelte";

  let isOpen: boolean = $state(true);
  let files: DBDirectoryEntry[] = $state([]);
  let activeBar: string = $state("files");
  let db: IDBDatabase | null = $state(null);

  // biome-ignore lint/style/useConst: svelte variable
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

  let tabs: EditorTab[] = $state([
    { fileName: "tab name 1", content: "file 1" },
    { fileName: "tab name 2", content: "file 2" },
  ]);

  let activeTab: number = $state(0);
  // biome-ignore lint/style/useConst: svelte variable
  let activeTabContent = $derived.by(() => {
    const tabsContent = tabs.map((tab) => {
      return tab.content;
    });

    return tabsContent;
  });
  // biome-ignore lint/style/useConst: svelte variable
  let hoveredTab = $state("");

  function closeSidebar(isCurrentTab: boolean, newTab: string) {
    isOpen = isCurrentTab ? !isOpen : true;
    activeBar = newTab;
  }

  function closeTab(tabIndex: number) {
    const newArray = tabs.filter((_, i) => i !== tabIndex);

    tabs = newArray;
    activeTab = tabIndex - 1 < 0 ? 0 : tabIndex - 1;
  }

  onMount(() => {
    if (window && db == null) {
      openDatabase()
        .then((_db: IDBDatabase | null) => {
          if (!_db) {
            return;
          }
          db = _db;

          const transaction = db.transaction(["files"], "readonly");
          const store = transaction.objectStore("files");
          const request = store.openCursor();
          request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest<IDBCursor | null>)
              .result;
            if (!cursor) {
              addDirectory(db as IDBDatabase, "contracts").then(() =>
                addFile(db as IDBDatabase, 1, "test.lua", script).then(() => {
                  listDirectoriesWithFiles(db as IDBDatabase).then((res) => {
                    files = res;
                  });
                }),
              );
            }
          };

          request.onerror = (event) => {
            console.error(
              "Error al verificar la existencia de entradas:",
              (event.target as IDBRequest).error,
            );
          };
        })
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        .catch((err: any) => console.error(err));
    }
  });

  $effect(() => {
    if (db && files.length === 0) {
      listDirectoriesWithFiles(db).then((res) => {
        files = res;
      });
    }
  });
</script>

<Container fluid style="height: 100vmin">
  <Row style="height: 100%">
    <Col
      xs="1"
      style="width: 5%; margin-right: 2px; background: rgb(63 63 63);"
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
        <TabContent on:tab={(e) => (activeTab = Number(e.detail))}>
          {#if tabs.length > 0}
            {#each tabs as tab, i}
              <EditorTabComp {activeTab} {hoveredTab} {i} {tab} {closeTab} />
            {/each}
          {:else }
            <TabPane active tabId={"Home"}>
              <span slot="tab">
                Home
              </span>
            </TabPane>
          {/if}
        </TabContent>
      </Row>
      <Row>
        {#if tabs.length > 0}
          <Editor tabsContent={activeTabContent} {activeTab} />
        {:else}
          <HomeTab />
        {/if}
      </Row>
    </Col>
  </Row>
</Container>
