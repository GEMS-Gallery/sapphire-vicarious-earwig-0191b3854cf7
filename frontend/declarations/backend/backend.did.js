export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const File = IDL.Record({
    'id' : IDL.Nat,
    'content' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'name' : IDL.Text,
    'createdAt' : Time,
    'size' : IDL.Nat,
    'updatedAt' : Time,
    'folderId' : IDL.Opt(IDL.Nat),
  });
  return IDL.Service({
    'createFolder' : IDL.Func([IDL.Text, IDL.Opt(IDL.Nat)], [IDL.Nat], []),
    'deleteFile' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'getFileDetails' : IDL.Func([IDL.Nat], [IDL.Opt(File)], ['query']),
    'getFiles' : IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat, File))], ['query']),
    'getFilesInFolder' : IDL.Func(
        [IDL.Nat],
        [IDL.Vec(IDL.Tuple(IDL.Nat, File))],
        ['query'],
      ),
    'uploadFile' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Nat8), IDL.Opt(IDL.Nat)],
        [IDL.Nat],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
