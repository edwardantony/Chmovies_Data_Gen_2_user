// ----------------------
// 🎬 Title Form Data
// ----------------------
export interface TitleFormData {
    title?: string;
    localTitle?: string;
    isFeatured?: boolean;
    description?: string;
    descriptionFormatted?: string;
    unFormattedDescription?: string;
    releaseDate?: string;
    duration?: number | "";
    status?: string;
    type?: string;
    categories?: string[];
    genres?: string[];
    countries?: string[];
    subtitles?: FormDataFile[];
    audioTracks?: FormDataFile[];
    vodPlans?: string[];
    rentalPlans?: RentalEntry[];
    maturityRating?: string;
    audienceRating?: number;
    extraTags?: string[];
  }
  
  // ----------------------
  // 📂 File Data for Uploads
  // ----------------------
  export interface FormDataFile {
    language: string | "";
    labelInput?: string | "";
    file: File | null;
  }
  
  // ----------------------
  // 💰 Rental Plan Entry
  // ----------------------
  export interface RentalEntry {
    type: string;
    price: string;
    currency: string;
  }
  
  // ----------------------
  // 🖼️ Image Data Structure
  // ----------------------
  
  
  export interface ImageData {
    orientation: string | "";
    original: File | null;
    thumbnails: { [key: string]: File };
  }
  
  
  export interface ImagesDataType {
    images: {
      portrait?: ImageData;
      landscape?: ImageData;
    };
  }

  export interface ImageFiles {
    portrait: ImageData | undefined;
    landscape: ImageData | undefined;
}
  
  // ----------------------
  // 🎥 Video Data Structure
  // ----------------------
  export interface VideoDataType {
    video: {
      videoFile: File | null;
      videoUrl?: string;
    };
  }

  export interface VideoFileData {
    videoFile: File | null;
  }
  
  // ----------------------
  // 📊 Upload Progress Tracking
  // ----------------------
export interface ProgressType {
    subtitles: number;
    audiotracks: number;
    images: number;
    video: number;
    [key: string]: number;
  }
  
export type ProgressKey = keyof ProgressType;

  // ----------------------
  // 📊 Upload Progress Tracking
  // ----------------------

export type UploadFiles = FormDataFile[] |  VideoFileData[] | ImageData[];

export interface UploadResult {
  url: string;
  progress: number;
}
  