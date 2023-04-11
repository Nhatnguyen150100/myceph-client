import { toast } from "react-toastify";

const DB_NAME = 'Myceph_Index_Database';
const DB_VERSION = 1;
export const DB_ENCRYPTION_DOCTOR = 'encryptionKeyForDoctor';
export const DB_ENCRYPTION_CLINIC = 'encryptionKeyForClinic';
export const DB_ENCRYPTION_SHAREPATIENT = 'encryptionKeyForSharePatient';

export const onOpenIndexDB = () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    let db;
    request.onupgradeneeded = (event) => {
      db = event.target.result;
      db.createObjectStore(DB_ENCRYPTION_DOCTOR, { keyPath: 'id' });
      db.createObjectStore(DB_ENCRYPTION_CLINIC, { keyPath: 'id' });
      db.createObjectStore(DB_ENCRYPTION_SHAREPATIENT, { keyPath: 'id' });
    };
    request.onerror = (event) => {
      reject(event.target.error);
    }
    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    }
  });
};

export const disConnectIndexDB = (db) => {
  try {
    db.close();
  } catch (error) {
    toast.error(error);
  }
}

export const addData = (db,data,dbName) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([dbName],"readwrite");
    const store = transaction.objectStore(dbName);
    let request = store.add(data);
    request.onsuccess = () => {
      resolve('Create encrypt key successfully');
    }
    request.onerror = () => {
      reject('Error adding data to store');
    }
  })
}

export const getData = (db,id,dbName) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([dbName],"readwrite");
    const store = transaction.objectStore(dbName);
    let request = store.get(id);
    request.onerror = (event) => {
      reject(event.target.error);
    }
    request.onsuccess = (event) => {
      const data = event.target.result;
      resolve(data);
    }
  })
}

export const getAllData = (db,dbName) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([dbName],"readwrite");
    const store = transaction.objectStore(dbName);
    let request = store.getAll();
    request.onerror = (event) => {
      reject(event.target.error);
    }
    request.onsuccess = (event) => {
      const data = event.target.result;
      resolve(data);
    }
  })
}

export const deleteData = (db,id,dbName) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([dbName],"readwrite");
    const store = transaction.objectStore(dbName);
    let request = store.delete(id);
    request.onerror = (event) => {
      reject(event.target.error);
    }
    request.onsuccess = (event) => {
      resolve('Delete encrypt key successfully');
    }
  })
}
