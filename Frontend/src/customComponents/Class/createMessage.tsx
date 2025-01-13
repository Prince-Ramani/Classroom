import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/VideoPLayer";
import CustomTooltip from "@/something/CustomTooltip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarIcon, FileText, Image, Video, X } from "lucide-react";
import { memo, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

const CreateMessage = memo(
  ({ profile, classID }: { profile: string; classID: string | undefined }) => {
    const [content, setContent] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [imagesPreview, setImagesPreview] = useState<string[]>([]);
    const [video, setVideo] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string>("");
    const [docs, setDocs] = useState<File[]>([]);
    const [type, setType] = useState<"Assignment" | "Classwork" | "Normal">(
      "Normal"
    );
    const [dueDate, setDueDate] = useState<Date>();

    const queryclient = useQueryClient();

    const resetStates = () => {
      setImages([]);
      setImagesPreview([]);
      setVideo(null);
      setVideoPreview("");
      setDocs([]);
      setContent("");
      setDueDate(undefined);
      setType("Normal");
    };

    const { mutate, isPending } = useMutation({
      mutationFn: async (formData: FormData) => {
        const res = await fetch(`/api/message/sendmessage/${classID}`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        return data;
      },
      onSuccess: (data) => {
        if ("error" in data) return toast.error(data.error);
        resetStates();
        toast.success(data.message);
        queryclient.invalidateQueries({ queryKey: ["messages", classID] });
      },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedImages = Array.from(e.target.files || []);
      if (video || videoPreview) {
        setVideo(null);
        setVideoPreview("");
      }
      if (docs.length > 0) {
        setDocs([]);
      }

      if (selectedImages.length + images.length > 4) {
        return toast.error("Only 4 images can be sent at a time!");
      }

      setImages((prev) => [...prev, ...selectedImages]);
      const previews = selectedImages.map((img) => URL.createObjectURL(img));
      setImagesPreview((prev) => [...prev, ...previews]);
    };

    const handleRemoveImage = (index: number) => {
      setImages((prev) => prev.filter((_, i) => i !== index));
      setImagesPreview((prev) => prev.filter((_, i) => i !== index));
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      //@ts-ignore
      const selectedFile = e.target.files[0];

      if (images.length > 0 || imagesPreview.length > 0) {
        setImages([]);
        setImagesPreview([]);
      }

      if (docs.length > 0) {
        setDocs([]);
      }
      if (selectedFile) {
        setVideo(selectedFile);
        setVideoPreview(URL.createObjectURL(selectedFile));
      }
    };

    const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selecedDocs = Array.from(e.target.files || []);
      if (!selecedDocs) return;
      if (images.length > 0 || imagesPreview.length > 0) {
        setImages([]);
        setImagesPreview([]);
      }
      if (video || videoPreview) {
        setVideo(null);
        setVideoPreview("");
      }
      if (docs.length + selecedDocs.length > 4) {
        toast.error("Only 4 docs can be sent at a time!");
        return;
      }

      setDocs((prev) => [...prev, ...selecedDocs]);
    };

    const handleRemoveDoc = (index: number) => {
      setDocs((prev) => prev.filter((_, i) => i !== index));
    };

    const handleClick = () => {
      const formData = new FormData();

      if (!content) {
        toast.error("Content required for message!");
        return;
      }
      if (content.length < 3 || content.length > 1200) {
        toast.error("Content should have character range betweeen 3 and 1200!");
        return;
      }
      if (images && images.length > 0) {
        images.forEach((f) => formData.append("attachedImages", f));
      }

      if (video) {
        formData.append("attachedVideo", video);
      }
      if (docs.length > 0) {
        docs.forEach((f) => formData.append("attachedPdfs", f));
      }
      if (dueDate && type === "Assignment")
        formData.append("dueDate", dueDate.toString());
      formData.append("content", content);
      formData.append("type", type);

      mutate(formData);
    };

    return (
      <>
        <div
          className={`border w-full bg-white p-4  rounded-lg shadow-md  shadow-gray-500/30 flex items-center ${
            isPending ? "pointer-events-none cursor-not-allowed opacity-50" : ""
          } `}
        >
          <img
            src={profile}
            className="size-10 xl:size-12 rounded-full self-start object-cover"
          />
          <div className=" w-full flex flex-col gap-4">
            <div className="flex items-center pl-3">
              <div className="flex  gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="font-semibold text-sm md:text-base bg-blue-500 text-white  rounded-md   px-2 flex items-center justify-center p-1 cursor-pointer">
                      {type}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className=" relative h-fit w-48 sm:w-52 md:w-56 lg:w-64 left-20  bg-black/90 text-white p-0 border-none shadow-md  shadow-green-600/80  ring-1 ring-green-400/80  ">
                    <div
                      className=" h-full w-full p-2 py-3 hover:bg-white/10 active:bg-green-600/40 transition-colors cursor-pointer select-none font-semibold tracking-wide border-b border-gray-500"
                      onClick={() => setType("Normal")}
                    >
                      Normal
                    </div>

                    <div
                      className=" h-full w-full p-2 py-3 hover:bg-white/10 active:bg-green-600/40 transition-colors cursor-pointer select-none font-semibold tracking-wide border-b border-gray-500"
                      onClick={() => setType("Assignment")}
                    >
                      Assignment
                    </div>
                    <div
                      className=" h-full w-full p-2 py-3 hover:bg-white/10 active:bg-green-600/40 transition-colors cursor-pointer select-none font-semibold tracking-wide"
                      onClick={() => setType("Classwork")}
                    >
                      Classwork
                    </div>
                  </PopoverContent>
                </Popover>

                {type === "Assignment" ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          " justify-start text-left font-normal",
                          !dueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {dueDate ? (
                          format(dueDate, "PPP")
                        ) : (
                          <span>Pick a Due date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                        disabled={type !== "Assignment"}
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  ""
                )}
              </div>
              <div className="flex bg-blue-600 gap-2 ml-2"></div>
            </div>
            <TextareaAutosize
              placeholder="Share something with your class..."
              minRows={2}
              maxRows={5}
              className="w-full focus:outline-none h-full pl-3 md:text-lg resize-none  "
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <input
              type="file"
              className="hidden"
              accept="video/*"
              id="video-upload"
              onChange={handleVideoChange}
            />
            <input
              type="file"
              className="hidden"
              accept=".pdf, .docx, .txt, .pptx"
              id="file-upload"
              multiple
              onChange={handleDocChange}
            />
            <div className="w-full flex  items-center pl-5">
              <div className="flex gap-2">
                <label
                  htmlFor="image-upload"
                  className="h-full w-full cursor-pointer "
                >
                  <CustomTooltip title="Image">
                    <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                      <Image />
                    </div>
                  </CustomTooltip>
                </label>
                <label
                  htmlFor="video-upload"
                  className="h-full w-full cursor-pointer "
                >
                  <CustomTooltip title="Video">
                    <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                      <Video />
                    </div>
                  </CustomTooltip>
                </label>
                <label
                  htmlFor="file-upload"
                  className="h-full w-full cursor-pointer "
                >
                  <CustomTooltip title="File">
                    <div className=" inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                      <FileText />
                    </div>
                  </CustomTooltip>
                </label>
              </div>
              <Button
                size="lg"
                className="ml-auto bg-blue-500  hover:bg-blue-300 active:bg-green-400"
                disabled={isPending}
                onClick={() => handleClick()}
              >
                Post
              </Button>
            </div>
            {isPending ? (
              <div
                className=" w-full  flex
          items-center justify-center p-2"
              >
                <Loading />
              </div>
            ) : (
              ""
            )}
            {imagesPreview.length > 0 ? (
              <div
                className={`flex items-center justify-start flex-wrap gap-2 `}
              >
                {imagesPreview.map((img, index) => (
                  <div className="h-fit w-fit relative">
                    <img
                      src={img}
                      key={index}
                      className="size-32 items-center md:items-start  md:size-36 lg:size-48 select-none  object-cover rounded-md  "
                    />
                    <div
                      className=" flex justify-center items-center w-full  hover:bg-white/20 rounded-full  p-1 cursor-pointer "
                      onClick={() => handleRemoveImage(index)}
                    >
                      <CustomTooltip title="Remove">
                        <X className="shrink-0 text-red-700 active:text-green-600 " />
                      </CustomTooltip>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}
            {videoPreview ? (
              <div className=" flex flex-col gap-2 items-center  ">
                <div className="w-full h-fit">
                  <VideoPlayer source={videoPreview} />
                </div>
                <div className=" h-fit w-fit rounded-full  p-1 hover:bg-white/10">
                  <CustomTooltip title="Remove">
                    <X
                      className="   rounded-full  transition-colors cursor-pointer flex justify-center items-center w-full "
                      onClick={() => {
                        setVideo(null);
                        setVideoPreview("");
                      }}
                    />
                  </CustomTooltip>
                </div>
              </div>
            ) : (
              ""
            )}

            {docs.length > 0 ? (
              <div
                className={`flex items-center flex-col justify-start flex-wrap gap-2 `}
              >
                {docs.map((doc, index) => (
                  <div
                    className="h-fit w-full  flex  items-center "
                    key={index}
                  >
                    <p className="min-w-fit text-sm">{doc.name}</p>
                    <div
                      className=" flex justify-center items-center mx-2 hover:bg-black/20 rounded-full  p-1 cursor-pointer "
                      onClick={() => handleRemoveDoc(index)}
                    >
                      <CustomTooltip title="Remove">
                        <X className="shrink-0 size-6 lg:size-fit text-red-700 active:text-green-600 " />
                      </CustomTooltip>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </>
    );
  }
);

export default CreateMessage;
