import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface File {
  'id' : bigint,
  'content' : [] | [Uint8Array | number[]],
  'name' : string,
  'createdAt' : Time,
  'size' : bigint,
  'updatedAt' : Time,
  'folderId' : [] | [bigint],
}
export type Time = bigint;
export interface _SERVICE {
  'createFolder' : ActorMethod<[string, [] | [bigint]], bigint>,
  'deleteFile' : ActorMethod<[bigint], boolean>,
  'getFileDetails' : ActorMethod<[bigint], [] | [File]>,
  'getFiles' : ActorMethod<[], Array<[bigint, File]>>,
  'getFilesInFolder' : ActorMethod<[bigint], Array<[bigint, File]>>,
  'uploadFile' : ActorMethod<
    [string, Uint8Array | number[], [] | [bigint]],
    bigint
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
