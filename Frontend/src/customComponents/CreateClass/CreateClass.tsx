import { Button } from "@/components/ui/button";
import Bar from "@/something/Bar";
import { useMutation } from "@tanstack/react-query";
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateClass = memo(() => {
  const navigate = useNavigate();
  const [info, setInfo] = useState({
    name: "",
    teacherName: "",
    description: "",
  });
  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/class/createclass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      });
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      if ("error" in data) {
        return toast.error(data.error);
      }
      toast.success(data.message);
      navigate("/");
    },
  });

  const handleClick = () => {
    if (!info.name || info.name.trim() === "") {
      return toast.error("Class name required!");
    }
    if (info.name.length > 30 || info.name.length < 3) {
      return toast.error(
        "Class name must be of minimum 3 and maximum 30 characters!"
      );
    }
    if (!info.teacherName || info.teacherName.trim() === "") {
      return toast.error("Teacher name required!");
    }

    if (info.teacherName.length > 30 || info.teacherName.length < 3) {
      return toast.error(
        "Teacher name must be of minimum 3 and maximum 30 characters!"
      );
    }

    if (info.description && info.description.length > 100) {
      return toast.error("Description must not exceed 100 charaters");
    }
    mutate();
  };

  return (
    <div className="  min-h-screen  border border-black  flex flex-col">
      <Bar title="Create class" />
      <div className="  flex flex-grow items-center justify-center m-2">
        <div className="flex flex-col  items-center justify-center w-full   p-2 max-w-3xl gap-4  ">
          <label htmlFor="classname" className="w-full cursor-pointer group">
            <div className=" md:gap-2  group border-2 p-2 md:p-0  flex flex-col md:flex-row  md:items-center bg-white rounded-md  hover:border-green-400 hover:text-green-600  ">
              <div className="min-w-fit font-medium md:px-2  ">
                Class name (required) :{" "}
              </div>
              <input
                className="focus:outline-none w-full md:rounded-r-md  pr-1 text-black  group-hover:placeholder:text-green-600 h-10 border-b-2 focus:border-green-600 md:border-none "
                id="classname"
                placeholder="Class name"
                onChange={(e) =>
                  setInfo((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
          </label>
          <label htmlFor="teacherName" className="w-full cursor-pointer group">
            <div className=" md:gap-2  group border-2 p-2 md:p-0  flex flex-col md:flex-row  md:items-center bg-white rounded-md hover:border-green-400 hover:text-green-600  ">
              <div className="min-w-fit font-medium md:px-2  ">
                Teacher name (required) :{" "}
              </div>
              <input
                className="focus:outline-none w-full md:rounded-r-md  pr-1 text-black group-hover:placeholder:text-green-600 h-10 border-b-2 focus:border-green-600 md:border-none "
                id="teacherName"
                placeholder="Teacher name"
                onChange={(e) =>
                  setInfo((prev) => ({ ...prev, teacherName: e.target.value }))
                }
              />
            </div>
          </label>
          <label htmlFor="description" className="w-full cursor-pointer group">
            <div className=" md:gap-2  group border-2 p-2 md:p-0  flex flex-col md:flex-row  md:items-center bg-white rounded-md hover:border-green-400 hover:text-green-600  ">
              <div className="min-w-fit font-medium md:px-2  ">
                Description :{" "}
              </div>
              <input
                className="focus:outline-none w-full md:rounded-r-md  pr-1 text-black group-hover:placeholder:text-green-600 h-10 border-b-2 focus:border-green-600 md:border-none "
                id="description"
                placeholder="Description"
                onChange={(e) =>
                  setInfo((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </div>
          </label>
          <Button
            className="w-[50%]"
            disabled={isPending}
            onClick={handleClick}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
});

export default CreateClass;
