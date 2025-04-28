interface PresignedUrlResponse {
  presignedUrl: string;
  key: string;
}

const getPresignedUrl = async (
  id: string,
  toFolder: string,
  name: string,
  type: string,
): Promise<PresignedUrlResponse | null> => {
  
  try {
      const response = await fetch("http://localhost:5000/generate-presigned-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              id,
              toFolder,
              fileName: name,
              fileType: type,
          }),
      });
      console.log(response)
      if (!response.ok) {
          throw new Error(`Failed to get pre-signed URL: ${response.status} ${response.statusText}`);
      }

      return (await response.json()) as PresignedUrlResponse;
  } catch (error) {
      console.error("❌ Error fetching pre-signed URL:", error);
      return null;
  }
};

export default getPresignedUrl;