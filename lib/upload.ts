"use client";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@lib/firebase";

const extractFilePathFromUrl = (url: string): string => {
  try {
    // Decode the URL and split to get the path
    const decodedUrl = decodeURIComponent(url);
    const parts = decodedUrl.split('/o/');
    if (parts.length < 2) {
      throw new Error('Invalid URL format');
    }

    // The file path is before the query parameters
    const filePath = parts[1].split('?')[0];

    return filePath;
  } catch (error) {
    console.error('Error extracting file path from URL:', error);
    return '';
  }
};


export const uploadImage = async (file: File): Promise<string> => {
  const date = new Date();
  const storageRef = ref(storage, `images/${date.getTime()}_${file.name}`);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, rejects) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Optionally, you can handle upload progress here
        // Example: console.log((snapshot.bytesTransferred / snapshot.totalBytes) * 100 + '% done');
      },
      (error) => {
        console.error("Error while upload image" + error);
        rejects("Error while upload image" + error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};

export const  updateImage = async (file: File,url:string): Promise<string> => {
  const filePath:string = extractFilePathFromUrl(url)
  const fileRef = ref(storage, filePath);

  const uploadTask = uploadBytesResumable(fileRef, file);

  return new Promise((resolve, rejects) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Optionally, you can handle upload progress here
        // Example: console.log((snapshot.bytesTransferred / snapshot.totalBytes) * 100 + '% done');
      },
      (error) => {
        console.error("Error while upload image" + error);
        rejects("Error while upload image" + error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};


export const removeImage = async (url: string) => {
  try {
    // Extract the file path from the download URL
    const filePath = extractFilePathFromUrl(url);

    // Create a reference to the file
    const fileRef = ref(storage, filePath);

    // Delete the file
    await deleteObject(fileRef);

    console.log({ message: "File deleted successfully" });
  } catch (error) {
    console.log({ error: "Error deleting file", details: error });
  }
};

