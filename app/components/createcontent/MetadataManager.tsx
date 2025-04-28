import generateFileName from "../ui/generateFileName";

const BASE_URL = "https://chmovies-gen-2-file-upload.s3.ap-south-1.amazonaws.com/";

type FileType = "original" | "thumbnail";
type Orientation = "portrait" | "landscape";
type PresignedUrlData = { key: string };
type Metadata = {
  fileName: string;
  s3Key: string;
  url: string;
  resolution?: string;
  orientation?: Orientation;
  language?: string;
};

/**
 * Generates metadata for an image upload.
 */
export const buildImageMetadata = (
  title: string,
  imageKey: string,
  presignedUrlData: PresignedUrlData,
  type: FileType,
  orientation: Orientation,
  resolution: string = "1080p"
): Metadata => ({
  fileName: generateFileName(title, type, orientation, resolution),
  s3Key: presignedUrlData.key,
  url: `${BASE_URL}${presignedUrlData.key}`,
  resolution,
  orientation,
});

/**
 * Generates metadata for a subtitle file.
 */
export const buildSubtitleMetadata = (
  title: string,
  presignedUrlData: PresignedUrlData,
  language: string
): Metadata => ({
  fileName: generateFileName(title, language, "subtitle"),
  url: `${BASE_URL}${presignedUrlData.key}`,
  s3Key: presignedUrlData.key,
  language,
});

/**
 * Generates metadata for an audio track.
 */
export const buildAudioTrackMetadata = (
  title: string,
  presignedUrlData: PresignedUrlData,
  language: string
): Metadata => ({
  fileName: generateFileName(title, language, "audioTrack"),
  url: `${BASE_URL}${presignedUrlData.key}`,
  s3Key: presignedUrlData.key,
  language,
});
