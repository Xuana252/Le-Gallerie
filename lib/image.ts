import toastError, { toastMessage } from "@components/Notification/Toaster";
import { removeImage, updateImage, uploadImage } from "./upload";
import { UploadImage } from "./types";





export const testImageUrl = (url: string) => {
  return new Promise<boolean>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true); // URL is valid and image loaded
    img.onerror = () => resolve(false); // URL is invalid or image failed to load
    img.src = url;
  });
};

export const handleDownloadImage = (image: string) => {
  const link = document.createElement("a");
  link.href = image;
  link.target = "_blank";
  link.download = "Le_Gallerie";
  link.click();
};

export const handleCopyImage = async (image: string) => {
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image;

    img.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.error("Failed to create canvas context.");
        return;
      }

      ctx.drawImage(img, 0, 0);

      // Convert the image to PNG
      canvas.toBlob(async (blob) => {
        if (!blob || !navigator.clipboard || !window.ClipboardItem) {
          toastError("Clipboard API not supported for images.");
          return;
        }

        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);

        toastMessage("Image copied to clipboard!");
      }, "image/png");
    };
  } catch (error) {
    console.error("Failed to copy image:", error);
  }
};


export const handleUpdateImage = async (
  imageList: UploadImage[],
  imageToUpdate: string[]
) => {
  let imageUrlList: string[] = [];

  const updateUrl = imageToUpdate.filter(
    (url: string) =>
      imageList.findIndex((img: UploadImage) => img.url === url) === -1
  );

  await Promise.all(
    imageList.map(async (img: UploadImage) => {
      if (img.file) {
        if (updateUrl.length > 0) {
          const oldImage = updateUrl.shift();
          const uploadedUrl = await updateImage(img.file, oldImage!);
          imageUrlList.push(uploadedUrl);
        } else {
          const uploadedUrl = await uploadImage(img.file);
          imageUrlList.push(uploadedUrl);
        }
      } else {
        imageUrlList.push(img.url);
      }
    })
  );

  await Promise.all(updateUrl.map(async (img) => await removeImage(img)));

  return imageUrlList;
};


