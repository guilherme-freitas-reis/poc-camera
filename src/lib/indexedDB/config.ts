export const idbConfig = {
  databaseName: "inventory",
  version: 3,
  stores: [
    {
      name: "photos",
      id: { keyPath: "id", autoIncrement: true },
      indices: [{ name: "photo", keyPath: "photo" }],
    },
  ],
};
