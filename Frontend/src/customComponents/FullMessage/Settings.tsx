import { useMutation, useQuery } from "@tanstack/react-query";
import { memo, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Wrapper from "../Class/Wrapper";
import { Clipboard, ClipboardCheck } from "lucide-react";
import CustomTooltip from "@/something/CustomTooltip";
import TextareaAutosize from "react-textarea-autosize";

const Settings = memo(() => {
  const { classID } = useParams();
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);

  const [settings, setSettings] = useState({
    name: "",
    teacherName: "",
    description: "",
    classID: "",
  });

  if (!classID) {
    navigate("/");
    return;
  }

  const { data, isPending } = useQuery({
    queryKey: [classID, "settings"],
    queryFn: async () => {
      const res = await fetch(`/api/class/getclass/settings/${classID}`);
      const data = await res.json();
      if ("error" in data) toast.error(data.error);
      return data;
    },
    enabled: !!classID,
  });

  useEffect(() => {
    if (data && !data.error) {
      setSettings(() => ({
        description: data.description,
        name: data.name,
        teacherName: data.teacherName,
        classID: data._id,
      }));
    }
  }, [data]);

  const { mutate, isPending: pendingSave } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/class/editclass`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      if ("error" in data) return toast.error(data.error);
      navigate("/");

      return toast.success(data.message);
    },
  });

  const handleCopyClick = () => {
    if (!isCopied) {
      window.navigator.clipboard.writeText(data.uniqueAddress);
      toast.success("Code copied!");
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 5000);
    }
  };

  const handleClick = () => {
    if (!settings.name || settings.name.trim() === "") {
      return toast.error("Class name required!");
    }
    if (settings.name.length > 30 || settings.name.length < 3) {
      return toast.error(
        "Class name must be of minimum 3 and maximum 30 characters!"
      );
    }
    if (!settings.teacherName || settings.teacherName.trim() === "") {
      return toast.error("Teacher name required!");
    }

    if (settings.teacherName.length > 30 || settings.teacherName.length < 3) {
      return toast.error(
        "Teacher name must be of minimum 3 and maximum 30 characters!"
      );
    }

    if (settings.description && settings.description.length > 100) {
      return toast.error("Description must not exceed 100 charaters");
    }

    if (
      settings.description.trim() === data.description &&
      settings.name.trim() === data.name &&
      settings.teacherName.trim() === data.teacherName
    ) {
      return toast.error("No changes made!");
    }
    mutate();
  };

  return (
    <Wrapper className="">
      <div className="w-full">
        <div className="font-semibold text-2xl md:text-3xl  text-blue-600 border-b-2 border-blue-600 p-2 sm:p-3 md:p-4  w-full ">
          Class details
        </div>{" "}
        <div className="p-2 md:p-3 flex flex-col    gap-5">
          <label htmlFor="name">
            <div className="flex gap-2  flex-col  group  md:items-center  ">
              <div className="font-semibold text-sm min-w-fit group group-hover:text-blue-500 xl:text-lg ">
                Class name (required) :{" "}
              </div>

              <div className=" rounded-md w-full group  max-w-xl  ">
                <input
                  placeholder="Class name"
                  value={settings.name}
                  id="name"
                  onChange={(e) =>
                    setSettings((p) => ({ ...p, name: e.target.value }))
                  }
                  className="text-black bg-transparent group group-hover:border-blue-500 p-1.5 border-black border rounded-md focus:outline-blue-500 w-full max-w-xl "
                />
              </div>
            </div>
          </label>
          <label htmlFor="decription">
            <div className="flex gap-2  flex-col  group  md:items-center  ">
              <div className="font-semibold text-sm min-w-fit group group-hover:text-blue-500 xl:text-lg ">
                Class decription :{" "}
              </div>

              <div className=" rounded-md w-full group  max-w-xl  ">
                <TextareaAutosize
                  placeholder="Class decription"
                  value={settings.description}
                  id="decription"
                  onChange={(e) =>
                    setSettings((p) => ({ ...p, description: e.target.value }))
                  }
                  minRows={2}
                  maxRows={4}
                  className="text-black bg-transparent resize-none group group-hover:border-blue-500 p-1.5 border-black border rounded-md focus:outline-blue-500 w-full max-w-xl "
                />
              </div>
            </div>
          </label>

          <label htmlFor="Teacher">
            <div className="flex gap-2  flex-col  group  md:items-center  ">
              <div className="font-semibold text-sm min-w-fit group group-hover:text-blue-500 xl:text-lg ">
                Teacher name (required) :{" "}
              </div>

              <div className=" rounded-md w-full group  max-w-xl  ">
                <input
                  placeholder="Teacher name"
                  value={settings.teacherName}
                  id="Teacher"
                  onChange={(e) =>
                    setSettings((p) => ({ ...p, teacherName: e.target.value }))
                  }
                  className="text-black bg-transparent group group-hover:border-blue-500 p-1.5 border-black border rounded-md focus:outline-blue-500 w-full max-w-xl "
                />
              </div>
            </div>
          </label>

          <div className="flex flex-col gap-2 justify-center items-center">
            <div className="font-bold text-xl tracking-wide">Class code:</div>
            <div className="text-5xl font-bold flex items-center text-blue-600 gap-5 tracking-widest">
              {data?.uniqueAddress}
              <div className="">
                <CustomTooltip title="Copy code">
                  {isCopied ? (
                    <ClipboardCheck className="size-10  hover:text-gray-600 transition-all cursor-pointer   " />
                  ) : (
                    <Clipboard
                      className="size-10  hover:text-gray-600 ease-in-out transition-all cursor-pointer  "
                      onClick={handleCopyClick}
                    />
                  )}
                </CustomTooltip>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              className="bg-blue-600 p-2 w-6/12 max-w-sm border rounded-md text-white font-semibold text-lg hover:bg-blue-400 transition-colors disabled:bg-blue-300 active:bg-green-400  "
              onClick={handleClick}
              disabled={pendingSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
});

export default Settings;
