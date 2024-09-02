import Bool "mo:base/Bool";

import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor FileBox {
  type File = {
    id: Nat;
    name: Text;
    content: ?Blob;
    size: Nat;
    createdAt: Time.Time;
    updatedAt: Time.Time;
    folderId: ?Nat;
  };

  type Folder = {
    id: Nat;
    name: Text;
    createdAt: Time.Time;
    updatedAt: Time.Time;
    parentId: ?Nat;
  };

  stable var nextId: Nat = 0;
  stable var fileEntries: [(Nat, File)] = [];
  stable var folderEntries: [(Nat, Folder)] = [];

  var files : HashMap.HashMap<Nat, File> = HashMap.fromIter(fileEntries.vals(), 10, Nat.equal, Hash.hash);
  var folders : HashMap.HashMap<Nat, Folder> = HashMap.fromIter(folderEntries.vals(), 10, Nat.equal, Hash.hash);

  // Helper function to generate a new ID
  private func generateId() : Nat {
    nextId += 1;
    nextId - 1
  };

  // Get all files and folders
  public query func getFiles() : async [(Nat, File)] {
    Iter.toArray(files.entries())
  };

  // Upload a new file
  public func uploadFile(name: Text, content: Blob, folderId: ?Nat) : async Nat {
    let id = generateId();
    let newFile: File = {
      id;
      name;
      content = ?content;
      size = Blob.toArray(content).size();
      createdAt = Time.now();
      updatedAt = Time.now();
      folderId;
    };
    files.put(id, newFile);
    id
  };

  // Get file details
  public query func getFileDetails(id: Nat) : async ?File {
    files.get(id)
  };

  // Delete a file
  public func deleteFile(id: Nat) : async Bool {
    switch (files.remove(id)) {
      case null { false };
      case (?_) { true };
    }
  };

  // Create a new folder
  public func createFolder(name: Text, parentId: ?Nat) : async Nat {
    let id = generateId();
    let newFolder: Folder = {
      id;
      name;
      createdAt = Time.now();
      updatedAt = Time.now();
      parentId;
    };
    folders.put(id, newFolder);
    id
  };

  // Get files in a specific folder
  public query func getFilesInFolder(folderId: Nat) : async [(Nat, File)] {
    Iter.toArray(Iter.filter(files.entries(), func ((_, file): (Nat, File)) : Bool { file.folderId == ?folderId }))
  };

  system func preupgrade() {
    fileEntries := Iter.toArray(files.entries());
    folderEntries := Iter.toArray(folders.entries());
  };

  system func postupgrade() {
    files := HashMap.fromIter(fileEntries.vals(), 10, Nat.equal, Hash.hash);
    folders := HashMap.fromIter(folderEntries.vals(), 10, Nat.equal, Hash.hash);
  };
}
