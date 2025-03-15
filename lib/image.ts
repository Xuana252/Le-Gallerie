import toastError, { toastMessage } from "@components/Notification/Toaster";

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
  
