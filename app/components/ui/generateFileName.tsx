type OrientationType = "subtitle" | "audioTrack" | "video";

const generateFileName = (
  title: string,
  type?: string,
  orientation?: OrientationType | string,
  resolution?: string
): string => {
  if (!title.trim()) throw new Error("Title cannot be empty.");

  const formattedTitle = title.toLowerCase().replace(/\s+/g, "_");
  const timestamp = `${Date.now()}_${Math.floor(performance.now() * 1000)}`;

  switch (orientation) {
    case "subtitle":
      return `${timestamp}_${formattedTitle}_${type ?? "unknown"}_original_subtitle`;
    case "audioTrack":
      return `${timestamp}_${formattedTitle}_original_${type ?? "unknown"}_audiotrack`;
    case "video":
      return `${timestamp}_${formattedTitle}_original_file`;
    default:
      return resolution
        ? `${timestamp}_${formattedTitle}_${type ?? "unknown"}_${orientation ?? "default"}_${resolution}`
        : `${timestamp}_${formattedTitle}_${type ?? "unknown"}_${orientation ?? "default"}`;
  }
};

export default generateFileName;
