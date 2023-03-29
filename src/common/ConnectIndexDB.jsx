const DB_NAME = 'Myceph_Index_Database';
const DB_VERSION = 1;
const DB_STORE_NAME = 'encryptionKey';

export const onOpenIndexDB = () =>{
  return new Promise((resolve, reject) => {
    let db;
    const request = window.indexedDB.open(DB_NAME,DB_VERSION);
    request.onupgradeneeded = (event) => {
      db = event.target.result;
      db.createObjectStore(DB_STORE_NAME, { keyPath: 'id', autoIncrement: true });
    };
    request.onerror = (event) => {
      reject(event.target.errorCode);
    }
    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    }
  }) 
}

export const disConnectIndexDB = (db) => {
  db.close();
}

export const addData = (db,data) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([DB_STORE_NAME],"readwrite");
    const store = transaction.objectStore(DB_STORE_NAME);
    let request = store.add(data);
    request.onsuccess = () => {
      resolve('Create encrypt key successfully');
    }
    request.onerror = () => {
      reject('Error adding data to store');
    }
  })
}

export const getData = (db,id) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([DB_STORE_NAME],"readwrite");
    const store = transaction.objectStore(DB_STORE_NAME);
    let request = store.get(id);
    request.onerror = (event) => {
      reject(event.target.errorCode);
    }
    request.onsuccess = (event) => {
      const data = event.target.result;
      resolve(data);
    }
  })
}

export const deleteData = (db,id) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([DB_STORE_NAME],"readwrite");
    const store = transaction.objectStore(DB_STORE_NAME);
    let request = store.delete(id);
    request.onerror = (event) => {
      reject(event.target.errorCode);
    }
    request.onsuccess = (event) => {
      resolve('Delete encrypt key successfully');
    }
  })
}
