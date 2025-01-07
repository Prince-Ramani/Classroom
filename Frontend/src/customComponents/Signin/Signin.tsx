import { Button } from "@/components/ui/button";
import { validateEmail } from "@/lib/func";
import { useMutation } from "@tanstack/react-query";
import { Lock, Mail, OctagonAlert } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signin = () => {
  const navigate = useNavigate();
  const [info, setInfo] = useState({
    email: "",
    password: "",
  });

  const {
    mutate: signUp,
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

    signUp();
  };

  return (
    <div className="min-h-screen w-full bg-slate-100   border flex justify-center items-center  ">
      <div className="flex flex-col  p-2 gap-2 lg:gap-7 w-full max-w-xs md:max-w-sm lg:max-w-lg ">
        <div>
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            {" "}
            Signin
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
                placeholder="password"
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
            <div className="flex flex-col gap-1">
              <Button
                className="w-full"
                disabled={isPending}
                onClick={handleClick}
              >
                Sign up
              </Button>
              <p
                className="cursor-pointer group hover:text-blue-400 w-fit text-sm sm:text-base "
                onClick={() => navigate("/signup")}
              >
                Don't have an account?{" "}
                <span className="text-primary underline group-hover:text-blue-400">
                  Sign up
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
