import { useQuery } from "@tanstack/react-query";
import { memo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Wrapper from "../Wrapper";
import PeopleDisplayer from "./PeoplDisplayer";
import { useAuthUser } from "@/Context/authUserContext";

const People = memo(() => {
  const { classID } = useParams();
  const navigate = useNavigate();
  const [isHimselfAdmin, setHimselfAdmin] = useState(false);
  const { authUser } = useAuthUser();

  if (!classID || !authUser) {
    navigate("/");
    return;
  }

  const { data: peoples } = useQuery({
    queryKey: [classID, "people"],
    queryFn: async () => {
      const res = await fetch(`/api/class/getmembers/${classID}`);
      const data = await res.json();
      if ("error" in data) toast.error(data.error);

      setHimselfAdmin(() =>
        data.admins.some((a: any) => a._id === authUser._id),
      );

      return data;
    },
  });

  return (
    <Wrapper>
      <div className="w-full h-full flex gap-6 lg:gap-8 flex-col">
        {!!peoples && peoples?.admins.length > 0 ? (
          <div className="w-full h-full">
            <div className="font-semibold text-2xl md:text-3xl text-blue-600 border-b-2 border-blue-600 p-2 sm:p-3 md:p-4  w-full ">
              Teachers
            </div>
            <div className="p-3 lg:px-4">
              {peoples.admins.map(
                (
                  member: {
                    username: string;
                    _id: string;
                    profilePicture: string;
                  },
                  index: number,
                ) => {
                  return (
                    <PeopleDisplayer
                      classID={classID}
                      isHimselfAdmin={isHimselfAdmin}
                      key={member._id}
                      member={member}
                      isHimself={member._id === authUser._id}
                      isAdmin={true}
                      className={`${
                        peoples.admins.length - 1 === index ? "" : "border-b-2"
                      }`}
                    />
                  );
                },
              )}
            </div>
          </div>
        ) : (
          ""
        )}

        {peoples ? (
          <div className="w-full h-full">
            <div className="flex justify-between items-center font-semibold text-2xl md:text-3xl text-blue-600 border-b-2 border-blue-600 w-full  p-2 sm:p-3 md:p-4  ">
              Classmates
              <span className="text-sm sm:text-base md:text-lg lg:text-xl">
                {peoples.members.length} students
              </span>
            </div>
            <div className="p-3 lg:px-4">
              {peoples.members.map(
                (
                  member: {
                    username: string;
                    _id: string;
                    profilePicture: string;
                  },
                  index: number,
                ) => {
                  return (
                    <PeopleDisplayer
                      isHimselfAdmin={isHimselfAdmin}
                      key={member._id}
                      classID={classID}
                      isHimself={member._id === authUser?._id}
                      member={member}
                      className={`${
                        peoples.members.length - 1 === index ? "" : "border-b-2"
                      }`}
                    />
                  );
                },
              )}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </Wrapper>
  );
});

export default People;
