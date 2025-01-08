import { Button } from "@/components/ui/button";
import { validateEmail } from "@/lib/func";
import { useMutation } from "@tanstack/react-query";
import { Lock, Mail, OctagonAlert, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [info, setInfo] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [verifyPass, setVerifyPass] = useState("");

  const {
    mutate: signUp,
    isPending,
    data,
  } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/signup", {
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
    if (!info.username || info.username.trim() === "") {
      return toast.error("Name required!");
    }
    if (!info.email || info.email.trim() === "") {
      return toast.error("Email required!");
    }
    if (!info.password || info.password.trim() === "") {
      return toast.error("Password required!");
    }

    if (info.username.length < 3) {
      return toast.error("Name must have minimum 3 characters!");
    }

    if (info.username.length > 12) {
      return toast.error("Name must not exceed 12 characters!");
    }

    const isValidEmail = validateEmail(info.email);

    if (!isValidEmail) {
      return toast.error("Invalid email format!");
    }

    if (info.password !== verifyPass) {
      return toast.error("Verification password doesn't match!");
    }

    signUp();
  };

  return (
    <div className="min-h-screen w-full    border flex justify-center items-center   ">
      <div className="flex flex-col  p-2 gap-2 lg:gap-7 w-full max-w-xs md:max-w-sm lg:max-w-lg ">
        <div>
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            {" "}
            Signup
          </h1>
        </div>
        <div className="flex gap-3 flex-col">
          <label htmlFor="username">
            <div className=" border gap-2 w-full group    p-2 flex items-center bg-white rounded-sm hover:border-green-400 ">
              <User className="text-gray-400/90  size-5  shrink-0 group-hover:text-primary  " />
              <input
                className="focus:outline-none w-full text-black  "
                id="username"
                placeholder="Name"
                onChange={(e) =>
                  setInfo((prev) => ({ ...prev, username: e.target.value }))
                }
              />
            </div>
          </label>
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
          <label htmlFor="confirmpassword">
            <div className=" border gap-2 w-full group    p-2 flex items-center bg-white rounded-sm hover:border-green-400  ">
              <Lock className="text-gray-400/90 size-5 shrink-0 group-hover:text-primary   " />
              <input
                className="focus:outline-none group  w-full text-black"
                type="password"
                id="confirmpassword"
                placeholder="Confirm password"
                onChange={(e) => setVerifyPass(() => e.target.value)}
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
                onClick={() => navigate("/signin")}
              >
                Already have an account?{" "}
                <span className="text-primary underline group-hover:text-blue-400">
                  Sign in
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
