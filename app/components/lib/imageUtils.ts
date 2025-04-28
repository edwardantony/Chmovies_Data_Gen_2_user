// utils/imageUtils.ts
export const resizeImage = (image: HTMLImageElement, height: number, filename: string): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const aspectRatio = image.width / image.height;
      const width = height * aspectRatio;
  
      canvas.width = width;
      canvas.height = height;
  
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not create canvas context'));
        return;
      }
  
      ctx.drawImage(image, 0, 0, width, height);
  
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], filename, { type: 'image/jpeg' });
          resolve(file);
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/jpeg');
    });
  };
  
  export const generateThumbnails = async (image: HTMLImageElement, baseFilename: string, resolutions: string[]) => {
    const thumbnails: { [key: string]: File } = {};
  
    for (const resolution of resolutions) {
      const height = resolution === '720p' ? 720 : resolution === '480p' ? 480 : 360;
      const filename = `${baseFilename}_${resolution}.jpg`;
      try {
        const resizedImage = await resizeImage(image, height, filename);
        thumbnails[resolution] = resizedImage;
      } catch (error) {
        console.error(`Failed to generate thumbnail for ${resolution}:`, error);
      }
    }
  
    return thumbnails;
  };
  
  export const getHeightClass = (resolution: string, isPortrait: boolean) => {
    if (isPortrait) {
      return resolution === '720p' ? 'h-[200px]' : resolution === '480p' ? 'h-[140px]' : 'h-[100px]';
    } else {
      return resolution === '720p' ? 'h-[112.5px]' : resolution === '480p' ? 'h-[90px]' : 'h-[70px]';
    }
  };