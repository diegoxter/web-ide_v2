interface FileEntry {
	name: string;
	content: string;
	id: number;
	directoryId: number;
}

interface DBDirectoryEntry {
	id: number;
	name: string;
	files: FileEntry[];
}

export function openDatabase(): Promise<IDBDatabase | null> {
	return new Promise((resolve, reject) => {
		const request: IDBOpenDBRequest = indexedDB.open("Aergo-Web-IDE-DB", 1);

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;

			if (!db.objectStoreNames.contains("directories")) {
				const dirStore = db.createObjectStore("directories", {
					keyPath: "id",
					autoIncrement: true,
				});
				dirStore.createIndex("name", "name", { unique: true });
			}

			if (!db.objectStoreNames.contains("files")) {
				const fileStore = db.createObjectStore("files", {
					keyPath: "id",
					autoIncrement: true,
				});
				fileStore.createIndex("directory_name", ["directoryId", "name"], {
					unique: true,
				});
			}
		};

		request.onsuccess = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;
			resolve(db);
		};

		request.onerror = (event) => {
			console.error(
				"Error al abrir la base de datos:",
				(event.target as IDBOpenDBRequest).error,
			);
			reject((event.target as IDBOpenDBRequest).error); // Rechazamos la promesa en caso de error
		};
	});
}

export async function addDirectory(
	db: IDBDatabase,
	directoryName: string,
): Promise<boolean> {
	const transaction = db.transaction(["directories"], "readwrite");
	const dirStore = transaction.objectStore("directories");

	const request = dirStore.add({ name: directoryName });

	request.onsuccess = () => {
		console.log(`Directorio "${directoryName}" añadido correctamente.`);
	};

	request.onerror = (event) => {
		console.error(
			`Error al añadir el directorio "${directoryName}":`,
			(event.target as IDBRequest).error,
		);
		return false;
	};

	return true;
}

// Función para añadir un archivo
export async function addFile(
	db: IDBDatabase,
	directoryId: number,
	fileName: string,
	fileContent: string,
): Promise<boolean> {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(["files"], "readwrite");
		const fileStore = transaction.objectStore("files");

		const fileData = {
			directoryId,
			name: fileName,
			content: fileContent,
		};

		const request = fileStore.add(fileData);

		request.onsuccess = () => {
			console.log(
				`Archivo "${fileName}" añadido correctamente al directorio ${directoryId}.`,
			);
			resolve(true); // Resuelve la promesa con true si tiene éxito
		};

		request.onerror = (event) => {
			console.error(
				`Error al añadir el archivo "${fileName}":`,
				(event.target as IDBRequest).error,
			);
			reject(false); // Resuelve la promesa con false si ocurre un error
		};
	});
}

export async function listDirectoriesWithFiles(
	db: IDBDatabase,
): Promise<DBDirectoryEntry[]> {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(["directories", "files"], "readonly");
		const dirStore = transaction.objectStore("directories");
		const fileStore = transaction.objectStore("files");

		const directories: DBDirectoryEntry[] = [];

		const dirRequest = dirStore.openCursor();

		dirRequest.onsuccess = (event) => {
			const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>)
				.result;

			if (cursor) {
				const dirId = cursor.value.id;
				const dirName = cursor.value.name;

				const currentDirectory: DBDirectoryEntry = {
					name: dirName,
					files: [],
					id: dirId,
				};
				const fileRequest = fileStore
					.index("directory_name")
					.getAll(IDBKeyRange.bound([dirId, ""], [dirId, "\uffff"]));

				fileRequest.onsuccess = (event) => {
					const files = (event.target as IDBRequest<FileEntry[]>).result;
					currentDirectory.files = files;
					directories.push(currentDirectory);

					cursor.continue();
				};

				fileRequest.onerror = (event) => {
					console.error(
						"Error al recuperar archivos:",
						(event.target as IDBRequest).error,
					);
					reject((event.target as IDBRequest).error);
				};
			} else {
				resolve(directories);
			}
		};

		dirRequest.onerror = (event) => {
			console.error(
				"Error al listar los directorios:",
				(event.target as IDBRequest).error,
			);
			reject((event.target as IDBRequest).error);
		};
	});
}
