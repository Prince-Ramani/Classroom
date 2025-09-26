import { Button } from "@/components/ui/button";
import { validateEmail } from "@/lib/func";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Lock, Mail, OctagonAlert } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import studyImage from "../../assets/boy-studying-on-table.png";

const Signin = () => {
  const navigate = useNavigate();
  const [info, setInfo] = useState({
    email: "",
    password: "",
  });
  const queryclient = useQueryClient();

  const {
    mutate: signin,
    isPending,
    data,
  } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/signin", {
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
        return toast.error(data.error, {
          position: "top-center",
        });
      }
      toast.success(data.message);
      queryclient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleClick = () => {
    if (!info.email || info.email.trim() === "") {
      return toast.error("Email required!");
    }
    if (!info.password || info.password.trim() === "") {
      return toast.error("Password required!");
    }

    const isValidEmail = validateEmail(info.email);

    if (!isValidEmail) {
      return toast.error("Invalid email format!");
    }

    signin();
  };

  return (
    <div className="min-h-screen w-full    border flex justify-center items-center  ">
      <div
        className="flex flex-col   gap-1 lg:gap-5 w-full max-w-[90%] p-5 sm:p-7 lg:p-10 md:max-w-sm lg:max-w-lg bg-white  rounded-lg  shadow-black shadow-sm
      "
      >
        <img
          src={studyImage}
          className="max-h-48 object-cover rounded-sm"
          alt="boy-studying"
        />
        <div className="flex items-start  flex-col sm:gap-2">
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-blue-600">
            {" "}
            Welcom back!
          </h1>
          <h1 className="font-semibold  lg:text-xl text-gray-700">
            Sign in to continue learning.
          </h1>
        </div>
        <div className="flex gap-3 flex-col">
          <label htmlFor="email">
            <div className=" border gap-2 w-full group    p-2 flex items-center bg-white rounded-sm hover:border-green-400 ">
              <Mail className="text-gray-400/90 size-5 shrink-0 group-hover:text-primary   " />
              <input
                className="focus:outline-none w-full text-black"
                id="email"
                placeholder="Email"
                onChange={(e) =>
                  setInfo((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
          </label>
          <label htmlFor="password">
            <div className=" border gap-2 w-full group    p-2 flex items-center bg-white rounded-sm hover:border-green-400 ">
              <Lock className="text-gray-400/90 size-5 shrink-0 group-hover:text-primary   " />
              <input
                className="focus:outline-none w-full text-black"
                type="password"
                id="password"
                placeholder="Password"
                onChange={(e) =>
                  setInfo((prev) => ({ ...prev, password: e.target.value }))
                }
              />
            </div>
          </label>

          <div className="flex flex-col h-fit ">
            {data && "error" in data ? (
              <div className="text-red-700 text-sm sm:text-base   cursor-default px-1 flex gap-2 items-center pb-2">
                <OctagonAlert className="size-5" />
                {data.error}
              </div>
            ) : (
              ""
            )}
            <div className="flex flex-col gap-1 mt-2">
              <Button
                className="w-full"
                disabled={isPending}
                onClick={handleClick}
              >
                Sign in
              </Button>
              <button
                className="cursor-pointer group hover:text-blue-400 w-fit text-sm sm:text-base mt-3 "
                onClick={() => navigate("/signup")}
              >
                Don't have an account?{" "}
                <span className="text-primary underline group-hover:text-blue-400">
                  Sign up
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
