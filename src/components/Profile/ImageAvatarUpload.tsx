
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../pages/Authentication-page/components/Firebase";

export const ImageUpload = async (file: File, userID: number): Promise<string> => { 

    if (!file) throw new Error("No file provided");

  const storageRef = ref(storage, `AvatarImgs/${userID}/${file.name}`); 
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      null,
      (error) => reject(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log("File available at", downloadURL);
        resolve(downloadURL);
      }
    );
  });
};