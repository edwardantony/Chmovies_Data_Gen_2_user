"use client";
import React, { useState, useEffect, forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { Box, Select, MenuItem, SelectChangeEvent, TextField, Slider } from "@mui/material";
import DatePicker from "../ui/DatePicker";
import TimePicker from "../ui/TimePicker";
import MultiSelectInput from "../ui/MultiSelectInput";
import MultiTagInput from "../ui/MultiTagInput";
import MultiInputMaker from "../ui/MultiInputMaker";
import MultiRentalInputMaker from "../ui/MultiRentalInputMaker";
import dayjs, { Dayjs } from "dayjs";
import MovieIcon from "@mui/icons-material/Movie";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import TheatersIcon from "@mui/icons-material/Theaters";
import TvIcon from "@mui/icons-material/Tv";
import { toast } from "react-hot-toast";
import { TitleFormData, FormDataFile, RentalEntry } from "./types";

interface TitleFormProps {
  onFormDataUpdate: (formData: TitleFormData) => void;
  onValidationError: (errors: { [key: string]: string }) => void;
  initialFormData?: TitleFormData;
}


interface SearchResponse {
  exactMatch: boolean;
  similarTitles: string[];
}

const TitleForm = forwardRef(({ onFormDataUpdate, onValidationError, initialFormData }: TitleFormProps, ref) => {
  // Initialize state with values from initialFormData
  const [title, setTitle] = useState<string>(initialFormData?.title || "");  
  const [localTitle, setLocalTitle] = useState<string>(initialFormData?.localTitle || "");
  const [description, setDescription] = useState<string>(initialFormData?.description || "");
  const [formattedDescription, setFormattedDescription] = useState<string>(initialFormData?.descriptionFormatted || "");
  const [isFeatured, setIsFeatured] = useState<boolean>(initialFormData?.isFeatured || false);
  const [contentType, setContentType] = useState<string>(initialFormData?.type || "");
  const [contentStatus, setContentStatus] = useState<string>(initialFormData?.status || "");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    initialFormData?.releaseDate ? dayjs(initialFormData.releaseDate) : dayjs()
  );
  const [selectedDuration, setSelectedDuration] = useState<Dayjs | null>(
    initialFormData?.duration ? dayjs().startOf("day").add(initialFormData.duration, "second") : dayjs().startOf("day").add(2, "hour")
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFormData?.categories || []);
  const [contentDuration, setContentDuration] = useState<number | "">(initialFormData?.duration || 7200);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(initialFormData?.genres || []);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(initialFormData?.countries || []);
  const [selectedSubtitles, setSelectedSubtitles] = useState<FormDataFile[]>(initialFormData?.subtitles || []);
  const [selectedAudioTracks, setSelectedAudioTracks] = useState<FormDataFile[]>(initialFormData?.audioTracks || []);
  const [selectedVODPlans, setSelectedVODPlans] = useState<string[]>(initialFormData?.vodPlans || []);
  const [selectedRentalPlans, setSelectedRentalPlans] = useState<RentalEntry[]>(initialFormData?.rentalPlans || []);
  const [selectedAudienceRating, setSelectedAudienceRating] = useState<number>(initialFormData?.audienceRating || 1);
  const [selectedMaturityRating, setSelectedMaturityRating] = useState<string>(initialFormData?.maturityRating || "");
  const [extraTags, setExtraTags] = useState<string[]>(initialFormData?.extraTags || []);
  const [filteredTitles, setFilteredTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [exactMatch, setExactMatch] = useState<boolean>(false);
  const toastIdRef = useRef<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const formData = useMemo(() => ({
    title: title,
    localTitle: localTitle,
    isFeatured: isFeatured,
    description: description,
    descriptionFormatted: formattedDescription,
    releaseDate: selectedDate ? selectedDate.format("YYYY-MM-DD") : "",
    duration: contentDuration,
    status: contentStatus,
    type: contentType,
    categories: selectedCategories,
    genres: selectedGenres,
    countries: selectedCountries,
    subtitles: selectedSubtitles,
    audioTracks: selectedAudioTracks,
    vodPlans: selectedVODPlans,
    rentalPlans: selectedRentalPlans,
    maturityRating: selectedMaturityRating,
    audienceRating: selectedAudienceRating,
    extraTags: extraTags,
  }), [
    title, isFeatured, formattedDescription, selectedDate, contentDuration, contentStatus, contentType,
    selectedCategories, selectedGenres, selectedCountries, selectedSubtitles, selectedAudioTracks,
    selectedVODPlans, selectedRentalPlans, selectedMaturityRating, selectedAudienceRating, extraTags, 
  ]);

  useEffect(() => {
    onFormDataUpdate(formData);
  }, [formData, onFormDataUpdate]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!title) errors.title = "Title is required";
    else if (!description) errors.description = "Description is required";
    else if (!contentStatus) errors.status = "Status is required";
    else if (!contentType) errors.type = "Title type is required";
    else if (!selectedDate) errors.releaseDate = "Release date is required";
    else if (!contentDuration) errors.duration = "Duration is required";
    else if (!selectedMaturityRating) errors.maturityRating = "Maturity Rating is required";
    else if (selectedCategories.length === 0) errors.categories = "At least one category is required";
    else if (selectedGenres.length === 0) errors.genres = "At least one genre is required";
    else if (selectedVODPlans.length === 0) errors.vodPlans = "At least one VOD Plan is required";

  onValidationError(errors);
    return Object.keys(errors).length === 0;
  };

  useImperativeHandle(ref, () => ({ validateForm }));

  // Event handlers
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    onFormDataUpdate({ ...formData, title: event.target.value });
  };

  const handleLocalTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTitle(event.target.value);
    onFormDataUpdate({ ...formData, localTitle: event.target.value });
  };

  const setFormatDescription = (text: string): string => {
    return text
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line !== "")
      .map(line => `<p>${line}</p>`)
      .join("\n");
  };
  
  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const formttedDesc = setFormatDescription(event.target.value);
    setDescription(event.target.value);
    setFormattedDescription(formttedDesc);
    onFormDataUpdate({ ...formData, description: event.target.value, descriptionFormatted: formttedDesc });
  };

  const handleFeaturedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsFeatured(event.target.checked);
    onFormDataUpdate({ ...formData, isFeatured: event.target.checked });
  };

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    onFormDataUpdate({ ...formData, releaseDate: date ? date.format("YYYY-MM-DD") : "" });
  };

  const handleTimeChange = (value: Dayjs | null) => {
    const convertedDuration = value ? value.hour() * 3600 + value.minute() * 60 + value.second() : "";
    setContentDuration(convertedDuration);
    setSelectedDuration(value);
    onFormDataUpdate({ ...formData, duration: convertedDuration });
  };

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
    onFormDataUpdate({ ...formData, categories });
  };

  const handleGenreChange = (genres: string[]) => {
    setSelectedGenres(genres);
    onFormDataUpdate({ ...formData, genres });
  };

  const handleCountryChange = (countries: string[]) => {
    setSelectedCountries(countries);
    onFormDataUpdate({ ...formData, countries });
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setContentStatus(event.target.value);
    onFormDataUpdate({ ...formData, status: event.target.value });
  };

  const handleTypeChange = (event: SelectChangeEvent) => {
    setContentType(event.target.value);
    onFormDataUpdate({ ...formData, type: event.target.value });
  };

  const handleSubtitlesChange = (
  subtitles: FormDataFile[] | ((prev: FormDataFile[]) => FormDataFile[])
) => {
  setSelectedSubtitles((prev) => {
    const updatedSubtitles = typeof subtitles === "function" ? subtitles(prev) : subtitles;

    return updatedSubtitles.map((subtitle, index) => ({
      ...subtitle,
      file: subtitle.file instanceof File ? subtitle.file : prev[index]?.file || null, 
    }));
  });

  // Directly pass the updated object to onFormDataUpdate
  const updatedSubtitles = typeof subtitles === "function" ? subtitles(selectedSubtitles) : subtitles;

  onFormDataUpdate({
    ...formData, // Ensure you're spreading the existing formData
    subtitles: updatedSubtitles,
  });
};

  const handleAudioTracksChange = (audioTracks: FormDataFile[] | ((prev: FormDataFile[]) => FormDataFile[])) => {
    setSelectedAudioTracks((prev) => (typeof audioTracks === "function" ? audioTracks(prev) : audioTracks));
    onFormDataUpdate({ ...formData, audioTracks: typeof audioTracks === "function" ? audioTracks(selectedAudioTracks) : audioTracks });
  };

  const handleVODChange = (plans: string[]) => {
    setSelectedVODPlans(plans);
    onFormDataUpdate({ ...formData, vodPlans: plans });
  };

  const handleMaturityRating = (event: SelectChangeEvent) => {
    setSelectedMaturityRating(event.target.value);
    onFormDataUpdate({ ...formData, maturityRating: event.target.value });
  };

  const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (value >= 1 && value <= 10) {
      setSelectedAudienceRating(value);
      onFormDataUpdate({ ...formData, audienceRating: value });
    }
  };

  const handleSliderChange = (event: Event, value: number | number[]) => {
    setSelectedAudienceRating(value as number);
    onFormDataUpdate({ ...formData, audienceRating: value as number });
  };

  const handleExtraTags = (tags: string[]) => {
    setExtraTags(tags);
    onFormDataUpdate({ ...formData, extraTags: tags });
  };

  const handleRentType = (updatedRentalPlans: RentalEntry[]) => {
    setSelectedRentalPlans(updatedRentalPlans);
    onFormDataUpdate({ ...formData, rentalPlans: updatedRentalPlans });
  };

  useEffect(() => {
    if (isFocused && title.length > 3) {
      fetchTitles();
    } else if (!isFocused) {
      setFilteredTitles([]);
      setExactMatch(false);
    }
  }, [title, isFocused]);

  const fetchTitles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/content/search?title=${encodeURIComponent(title)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch titles");
      }
      const data: SearchResponse = await response.json();
      setExactMatch(data.exactMatch);
      setFilteredTitles(data.similarTitles);

      // Show toast error if exact match exists
      if (data.exactMatch) {
        if (!toastIdRef.current) {
          toastIdRef.current = toast.error(`Title "${title}" is already available!`, {
            duration: Infinity,
          });
        }
      } else {
        if (toastIdRef.current) {
          toast.dismiss(toastIdRef.current);
          toastIdRef.current = null; // Reset toast ID
        }
      }
    } catch (error) {
      console.error("Error fetching titles:", error);
      toast.error("Error fetching titles. Please try again.");
      setFilteredTitles([]);
      setExactMatch(false);
    }
    setLoading(false);
  };



  const countryLabels = {
    IN: "India",
    US: "United States",
    UK: "United Kingdom",
    CA: "Canada",
    AU: "Australia",
  };
  const categoriesLabels = {
    Malayalam: "Malayalam", 
    Super_Star: "Super Star", 
    Super_Hits: "Super Hits", 
    English: "English",
    Black_And_White: "Black & White",
    Classic: "Classic",
    Dubbed: "Dubbed",
    Tamil: "Tamil",
    Hindi: "Hindi", 
    Movies: "Movies",    
    Series: "Series",
    TV_Shows: "TV Shows",
    Web_Series: "Web Series",
    Documentaries: "Documentaries",
    Short_Films: "Short Films",
    News: "News",
    Sci_Fi: "Sports",
    Romance: "New Releases",
    Trending_Now: "Trending Now",
    Family_Entertainment: "Family Entertainment",
    Bollywood: "Bollywood",
  };

  const genresLabels = {
    Action: "Action",
    Adventure: "Adventure",
    Comedy: "Comedy",
    Drama: "Drama",
    Thriller: "Thriller",
    Horror: "Horror",
    Sci_Fi: "Sci-Fi",
    Fantasy: "Fantasy",
    Romance: "Romance",
    Mystery: "Mystery",
  };

  const vodLabels = {
    Subscription: "Subscription",
    Rent: "Rental",
    Purchase: "Purchase",
    Advertising: "Advertising",
  };

  const languageOptions = [
    { code: "English", label: "English" },
    { code: "Malayalam", label: "Malayalam" },
    { code: "Tamil", label: "Tamil" },
    { code: "Hindi", label: "Hindi" },
    { code: "Kannada", label: "Kannada" },
    { code: "Telugu", label: "Telugu" },
  ];

  const rentalOptions = ["SD", "HD", "UHD", "ALL"];

  

  return (
    <div>
          <h2 className="text-2xl font-bold mb-6">Step 1: Title Meta Details</h2>
          <div className="space-y-6">
            
          <div className="flex flex-col gap-4">
            {/* Row 1: Title Input Section */}
            <div className="flex items-center gap-4">
              <div className="flex-1 flex flex-col">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <div className="bg-white p-2 rounded-lg border border-gray-300">
                  <TextField
                    type="text"
                    name="title"
                    value={title}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={handleTitleChange}
                    placeholder="Enter Movie Title"
                    fullWidth
                    variant="outlined"
                    className="block w-full min-h-[55px] bg-white rounded-lg border border-gray-300 focus:ring-blue-300 focus:border-blue-300 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {filteredTitles.length > 0 && (
              <div className="flex-1 flex flex-col">
                {loading && <p className="text-gray-500">Loading...</p>}
                <ul className="border rounded-lg p-1 h-full overflow-y-auto bg-white">
                  {filteredTitles.map((movieTitle, index) => {
                    const cleanTitle = title.trim(); // Remove leading/trailing spaces
                    const escapedTitle = cleanTitle.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"); // Escape special characters for RegExp
                    const regex = new RegExp(`(${escapedTitle})`, "gi"); // Case-insensitive matching

                    const parts = movieTitle.split(regex);

                    return (
                      <li key={index} className="p-1 text-xs">
                        {parts.map((part, i) =>
                          part.toLowerCase() === cleanTitle.toLowerCase() ? (
                            <span key={i} className="text-red-600 font-bold">{part}</span>
                          ) : (
                            part
                          )
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

          </div>

          <div className="flex items-center gap-4">
            {/* Title (Vertically Aligned) */}
            <div className="w-[85%]">
              <label className="block text-sm font-medium text-gray-700">Local Title <span className="extra-small">(മലയാളം)</span></label>
              <div className="flex-1 bg-white p-2 rounded-lg border border-gray-300">
              <TextField
                type="text"
                name="title"
                value={localTitle}
                onChange={handleLocalTitleChange}
                placeholder="Enter Movie Title"
                fullWidth
                variant="outlined"
                className="block w-full min-h-[55px] bg-white rounded-lg border border-gray-300 focus:ring-blue-300 focus:border-blue-300 focus:outline-none"
              />
              </div>
            </div>

            {/* Is Featured (Centered to Title) */}
            <div className="w-[15%] bg-white flex p-2 items-center border border-gray-300 rounded-lg mt-4">
            <div className="flex-1 bg-white rounded-lg border border-gray-300 h-[55px] flex items-center justify-center">
              <input
                id="isFeatured"
                type="checkbox"
                name="isFeatured"
                checked={isFeatured}
                onChange={handleFeaturedChange}
                className="h-5 w-5 rounded border border-gray-400"
              />
              <label
                htmlFor="isFeatured"
                className="ml-2 text-sm font-medium text-gray-700 cursor-pointer select-none text-center"
              >
                Featured?
              </label>
            </div>
            </div>
          </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <div className="flex-1 bg-white p-2 rounded-lg border border-gray-300">
              <TextField
                  name="description"
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Enter description of movie title"
                  fullWidth
                  multiline
                  minRows={5}
                  variant="outlined"
                  className="block w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 focus:outline-none"                  
                />
                </div>
            </div>

            <div className="flex space-x-4">
              {/* Release Date */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Release Date</label>
                <div className="flex-1 bg-white p-2 rounded-lg border border-gray-300">
                  <DatePicker label="" value={selectedDate} onChange={handleDateChange} />
                </div>
              </div>

              {/* Duration */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Duration (HH:MM:SS)</label>
                <div className="flex-1 bg-white p-2 rounded-lg border border-gray-300">
                  <TimePicker label="" value={selectedDuration} onChange={handleTimeChange} />
                </div>
              </div>
              
            </div>
            <div className="flex items-center space-x-4">
              {/* Status */}
              <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <div className="flex-1 bg-white p-2 rounded-lg border border-gray-300">
                <Select
                  name="status"
                  value={contentStatus}
                  onChange={handleStatusChange}
                  displayEmpty
                  className="block w-full min-h-[55px] bg-white rounded-lg shadow-sm border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                >
                  <MenuItem value="" disabled>
                      <span className="text-gray-400">Select Status</span>
                    </MenuItem>
                  <MenuItem value="Active">
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-green-500 rounded-full"></span> Active
                      </span>
                  </MenuItem>
                  <MenuItem value="Inactive">
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-red-500 rounded-full"></span> Inactive
                      </span>
                  </MenuItem>
                  <MenuItem value="Draft">
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-gray-500 rounded-full"></span> Draft
                      </span>
                  </MenuItem>
                </Select>
              </div>
              </div>

              {/* Type */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Title Type</label>
                <div className="flex-1 bg-white p-2 rounded-lg border border-gray-300">
                  <Select
                    name="type"
                    value={contentType}
                    onChange={handleTypeChange}
                    displayEmpty
                    className="block w-full min-h-[55px] bg-white rounded-lg border border-gray-300 focus:outline-none"
                    
                  >
                    <MenuItem value="" disabled>
                      <span className="text-gray-400">Select Type</span>
                    </MenuItem>
                    <MenuItem value="Movie">
                      <MovieIcon className="mr-2 text-blue-500" /> Movie
                    </MenuItem>
                    <MenuItem value="TV Show">
                      <TvIcon className="mr-2 text-green-500" /> TV Show
                    </MenuItem>
                    <MenuItem value="Web Series">
                      <TheatersIcon className="mr-2 text-purple-500" /> Web Series
                    </MenuItem>
                    <MenuItem value="Live">
                      <LiveTvIcon className="mr-2 text-red-500" /> Live
                    </MenuItem>
                  </Select>
                </div>
              </div>
            </div>

            {/* Ratings & Censorship  */}
            <div className="flex items-center space-x-4">
              {/* Regulatory Rating */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Maturity Rating</label>
                <div className="bg-white p-2 rounded-lg border border-gray-300">
                  <Select
                    name="type"
                    value={selectedMaturityRating}
                    onChange={handleMaturityRating}
                    displayEmpty
                    className="block w-full min-h-[55px] rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-300 focus:border-blue-300 focus:outline-none"
                    
                  >
                    <MenuItem value="" disabled>
                      <span className="text-gray-700">Select Maturity Rating</span>
                    </MenuItem>
                    
                    {/* Censor Rating Options */}
                    <MenuItem value="U">
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-blue-500 rounded-full"></span> U (Universal) – Safe for all
                      </span>
                    </MenuItem>

                    <MenuItem value="UA7">
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-green-500 rounded-full"></span> U/A 7+ – Light action or mild scary scenes
                      </span>
                    </MenuItem>

                    <MenuItem value="UA13">
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-yellow-500 rounded-full"></span> U/A 13+ – Moderate violence, mild strong language
                      </span>
                    </MenuItem>

                    <MenuItem value="UA16">
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-orange-500 rounded-full"></span> U/A 16+ – Strong language, mature themes
                      </span>
                    </MenuItem>

                    <MenuItem value="A">
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-red-500 rounded-full"></span> A (Adults Only) – Explicit content, strong violence
                      </span>
                    </MenuItem>
                  </Select>
                </div>
              </div>

              {/* Regulatory Rating */}
              <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Audience Rating</label>
              <Box className="w-full min-h-[55px] flex items-center justify-between gap-4 border border-gray-400 rounded-lg bg-white p-2">
                  <div className="flex-1 bg-white p-2 rounded-lg border border-gray-300">
                    <TextField
                      type="number"
                      value={selectedAudienceRating}
                      onChange={handleRatingChange}
                      inputProps={{ min: 1, max: 10, step: 0.1 }}
                      className="w-[30%] text-center"
                      variant="standard" // Removes border
                      sx={{ "& fieldset": { border: "none" } }} // Ensures no border
                    />

                    
                    <Slider
                      value={selectedAudienceRating}
                      onChange={handleSliderChange}
                      step={0.1}
                      min={1}
                      max={10}
                      valueLabelDisplay="auto"
                      className="w-[70%]"
                      sx={{
                        color: "#1E40AF", // Custom Blue Color
                        "& .MuiSlider-thumb": { backgroundColor: "#1E40AF" }, // Thumb color
                        "& .MuiSlider-track": { backgroundColor: "#1E40AF" }, // Track color
                        "& .MuiSlider-rail": { backgroundColor: "#93C5FD" }, 
                      }}
                    />
                  </div>
              </Box>
              </div>
            </div>

            {/* Country Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Category</label>
              <MultiSelectInput 
                labelInput="Category"
                predefinedOptions={categoriesLabels} 
                selectedValues={selectedCategories} 
                setSelectedValues={handleCategoryChange} 
              />
            </div>

            {/* Country Genres */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Genre</label>
              <MultiSelectInput 
                labelInput="Genre"
                predefinedOptions={genresLabels} 
                selectedValues={selectedGenres} 
                setSelectedValues={handleGenreChange} 
              />
            </div>

            {/* Country Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Listed Country</label>
              <MultiSelectInput 
                labelInput="Country"
                predefinedOptions={countryLabels} 
                selectedValues={selectedCountries} 
                setSelectedValues={handleCountryChange} 
              />
            </div>
            

            {/* Subtitles */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Subtitles</label>
              <MultiInputMaker 
                label="" 
                labelInput="Subtitle"
                mediaList={selectedSubtitles} 
                setMediaList={handleSubtitlesChange} 
                languageOptions={languageOptions} 
              />
            </div>

            {/* Audios */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Audio Track</label>
              <MultiInputMaker 
                label="" 
                labelInput="Audio" 
                mediaList={selectedAudioTracks} 
                setMediaList={handleAudioTracksChange} 
                languageOptions={languageOptions}
              />
            </div>

            {/* VOD Plans */}
            <div>
              <label className="block text-sm font-medium text-gray-700">VOD Plans</label>
              <MultiSelectInput 
                labelInput="Category"
                predefinedOptions={vodLabels} 
                selectedValues={selectedVODPlans} 
                setSelectedValues={handleVODChange} 
              />
            </div>

            {/* Rental Plans */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Add Rental Plans</label>
              <MultiRentalInputMaker
                rentalList={selectedRentalPlans}
                handleRentType={handleRentType}
                rentalOptions={rentalOptions}
              />
            </div>

            {/* Ttle Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Add Tags</label>
              <MultiTagInput 
                label="" 
                extraTags={extraTags} 
                setExtraTags={handleExtraTags} 
              />
            </div>

          </div>
          
          
        </div>
  );
});

export default TitleForm;
