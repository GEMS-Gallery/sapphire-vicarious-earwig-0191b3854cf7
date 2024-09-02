export interface File {
  id: number;
  name: string;
  size: number;
  createdAt: bigint;
  updatedAt: bigint;
  folderId: number | null;
}
