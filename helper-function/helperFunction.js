// Helper function to compress and convert image data to a smaller URL
export const generateSmallImageUrl = async (imageData) => {
    if (!imageData) {
      // Return a default URL or handle the case where imageData is missing
      return null;
    }
  
    try {
      const compressedImageData = await compressImage(imageData);
      return `data:image/jpeg;base64,${compressedImageData.toString('base64')}`;
    } catch (error) {
      console.error('Error generating small image URL:', error);
      return null;
    }
  };
  