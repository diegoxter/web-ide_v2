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

  let isSidebarOpen: boolean = $state(true);
  let files: DBDirectoryEntry[] = $state([]);
  let activeBar: string = $state("files");
  let db: IDBDatabase | null = $state(null);
  let openDirectories: string[] = $state([]);

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
    //{ directory: "", fileName: "tab name 1", content: "file 1" },
    //{ directory: "", fileName: "tab name 2", content: "file 2" },
  ]);

  let activeTab: number = $state(0);
  let activeTabContent: string | null = $state(null);
  // biome-ignore lint/style/useConst: svelte variable
  let hoveredTab = $state("");
  let selectedFile: string | null = $state(null);
  let oldRenamedName: string | null = $state(null);
  let tempNewName: string | null = $state(null);

  function closeSidebar(isCurrentTab: boolean, newTab: string) {
    isSidebarOpen = isCurrentTab ? !isSidebarOpen : true;
    activeBar = newTab;
  }

  function closeTab(tabIndex: number) {
    const newArray = tabs.filter((_, i) => i !== tabIndex);
    tabs = newArray;

    if (
      (activeTab >= newArray.length && newArray.length !== 0) ||
      (newArray.length === 1 && activeTab === 0)
    ) {
      const newIndex = newArray.length - 1;
      activeTab = newIndex;
      activeTabContent = newArray[newIndex].content;
    }
  }

  function openFile(e: HTMLElement) {
    if (e.className === "bi-trash2" || e.className === "bi-pencil-fill") {
      return undefined;
    }

    const element = e.id;
    if (selectedFile === element) {
      selectedFile = null;
      const directoryAndFileNames = element.split("-");
      const fileHasATab = tabs.some(
        (item) =>
          item.directory === directoryAndFileNames[0] &&
          item.fileName === directoryAndFileNames[1],
      );

      if (fileHasATab) {
        const indexOfFiletab = tabs.findIndex(
          (item) =>
            item.directory === directoryAndFileNames[0] &&
            item.fileName === directoryAndFileNames[1],
        );

        activeTab = indexOfFiletab;
      } else {
        const selectedDir = files.find(
          (directory) => directory.name === directoryAndFileNames[0],
        );

        // biome-ignore lint/style/noNonNullAssertion: this file will always exist
        const selectedFile = selectedDir!.files.find(
          (file) => file.name === directoryAndFileNames[1],
        );

        const newTabContent = {
          directory: directoryAndFileNames[0],
          fileName: directoryAndFileNames[1],
          // biome-ignore lint/style/noNonNullAssertion: this file will always exist
          content: selectedFile!.content,
        };

        tabs.push(newTabContent);

        const newTabIndex = tabs.length - 1;
        activeTab = newTabIndex;
        activeTabContent = tabs[newTabIndex].content;
      }
    } else {
      selectedFile = element;
    }
  }

  function changeTab(e: number) {
    console.log("clicked tab: ", e);
    if (e !== activeTab && tabs.length > 0) {
      console.log("tab changed!");
      activeTab = e;
      activeTabContent = tabs[e].content;
    }
  }

  function handleNewFile(_: string, elem: DBDirectoryEntry | FileEntry) {
    const isAnyEditing = files.some((directory) =>
      directory.files.some((file) => file.isEditing),
    );

    if (isAnyEditing) {
      return;
    }

    const directoryIndex = files.findIndex(
      (directory) => directory.name === elem.name && directory.id === elem.id,
    );

    if (!openDirectories.includes(files[directoryIndex].name)) {
      openDirectories.push(files[directoryIndex].name);
    }

    files[directoryIndex].files.push({
      name: "",
      content: "",
      id: 99,
      directoryId: files[directoryIndex].id,
      isEditing: true,
    });
  }

  const isDBDirectoryEntry = (
    file: DBDirectoryEntry | FileEntry,
  ): file is DBDirectoryEntry => {
    return "id" in file && "name" in file && !("directoryId" in file);
  };

  const deleteFile = (file: DBDirectoryEntry | FileEntry) => {
    if (isDBDirectoryEntry(file)) {
      files = files.filter(
        (dir) => dir.name !== file.name && dir.id !== file.id,
      );
    } else {
      // biome-ignore lint/style/noNonNullAssertion: this file will always exist
      const workingDir: number = files.findIndex(
        (dir: DBDirectoryEntry) => dir.id === (file as FileEntry).directoryId,
      )!;

      files[workingDir].files = files[workingDir].files.filter(
        (item: FileEntry) => item.id !== (file as FileEntry).id,
      );
    }
  };

  const modifyOpenDirectories = (newArray: string[]) => {
    openDirectories = newArray;
  };

  function handleDeleteFile(_: string, elem: DBDirectoryEntry | FileEntry) {
    deleteFile(elem);
  }

  function handleRenameFile(_: string, elem: DBDirectoryEntry | FileEntry) {
    elem.isEditing = !elem.isEditing;
  }

  function handleRenaming(
    elem: DBDirectoryEntry | FileEntry,
    e: KeyboardEvent,
  ) {
    if (!oldRenamedName) {
      oldRenamedName = elem.name;
    }

    tempNewName = (e.target as HTMLInputElement).value;

    const stopEditing = (finalName: string) => {
      if (tempNewName === finalName && finalName === "") {
        deleteFile(elem);
      } else {
        elem.name = finalName;
        elem.isEditing = false;
      }
      oldRenamedName = null;
      tempNewName = null;

      return;
    };

    if (e.key === "Escape") {
      stopEditing("");
    }

    if (e.key === "Enter") {
      let existingNames: string[] = [""];

      if ("files" in elem) {
        existingNames = files.map((dir) => dir.name);
      } else {
        // biome-ignore lint/style/noNonNullAssertion: this file will always exist
        const workingDir: DBDirectoryEntry = files.find(
          (dir) => dir.id === elem.directoryId,
        )!;
        existingNames = workingDir.files.map((file) => file.name);
      }

      if (tempNewName === "" || existingNames.includes(tempNewName)) {
        stopEditing(oldRenamedName);
        return;
      }

      stopEditing((e.target as HTMLInputElement).value);
    }
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
                    files = res.map((dbDirectory) => ({
                      ...dbDirectory,
                      isEditing: false,
                    })) as DBDirectoryEntry[];
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
        files = res.map((dbDirectory) => ({
          ...dbDirectory,
          isEditing: false,
        })) as DBDirectoryEntry[];
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
      style={`display: ${isSidebarOpen ? "block" : "none"}`}
    >
      {#if activeBar == "files"}
        <FileExplorerBar
          directories={files}
          {handleNewFile}
          {handleRenameFile}
          {handleDeleteFile}
          {handleRenaming}
          {openFile}
          {openDirectories}
          {modifyOpenDirectories}
          {selectedFile}
        />
      {:else if activeBar == "deploy"}
        <DeployBar />
      {/if}
    </Col>

    <Col>
      <Row class="border border-1">
        <TabContent>
          {#if tabs.length > 0}
            {#each tabs as tab, i}
              <EditorTabComp
                {activeTab}
                {hoveredTab}
                {i}
                {tab}
                {changeTab}
                {closeTab}
              />
            {/each}
          {:else}
            <TabPane active tabId={"Home"}>
              <span slot="tab"> Home </span>
            </TabPane>
          {/if}
        </TabContent>
      </Row>
      <Row>
        {#if tabs.length > 0}
          <Editor tabsContent={activeTabContent} />
        {:else}
          <HomeTab />
        {/if}
      </Row>
    </Col>
  </Row>
</Container>
