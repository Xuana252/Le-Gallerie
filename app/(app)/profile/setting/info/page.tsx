"use client";
import CustomImage from "@components/UI/Image/Image";
import { UserRole } from "@enum/userRolesEnum";
import { faCheck, faHammer, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatTimeAgo } from "@lib/dateFormat";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Info() {
  const { data: session } = useSession();
  return (
    <section className="flex flex-col gap-4 w-full">
      <div className="bg-secondary-1/70 rounded-lg p-4 flex flex-col gap-4 w-full">
        <h1 className="text-primary font-bold text-2xl bg-accent/30 rounded-md px-2 py-1">
          User information
        </h1>
        <div className="flex items-center justify-center my-2">
          <div className="relative">
            <div
              className={`${
                session?.user.role?.includes(UserRole.ADMIN)
                  ? "User_Profile_Page_Picture_Admin"
                  : "User_Profile_Page_Picture"
              }`}
            >
              {session?.user?.image ? (
                <CustomImage
                  src={session.user.image}
                  alt={"profile picture"}
                  className="size-full"
                  width={0}
                  height={0}
                  style={{ objectFit: "cover" }}
                  transformation={[{ quality: 80 }]}
                  lqip={{ active: true, quality: 20 }}
                />
              ) : (
                <FontAwesomeIcon icon={faUser} className="grow" />
              )}
            </div>
            {session?.user?.role?.includes(UserRole.ADMIN) ? (
              <div className="absolute bottom-0 right-0 z-50 text-white rounded-full bg-blue-500 p-[1px] aspect-square w-[30%] flex items-center justify-center">
                <FontAwesomeIcon icon={faHammer} className="size-[70%]" />
              </div>
            ) : session?.user?.role?.includes(UserRole.CREATOR) ? (
              <div className="absolute bottom-0 right-0 z-50 text-white rounded-full bg-blue-500 p-[1px] aspect-square w-[30%] flex items-center justify-center">
                <FontAwesomeIcon icon={faCheck} className="size-[70%]" />
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col text-xl bg-secondary-2/40 py-2 px-1 text-accent rounded-lg">
          <div className="w-full py-2 flex flex-row">
            <div className="w-[30%] text-left px-2 font-semibold text-sm sm:text-lg break-words">
              Username
            </div>
            <p className="break-words w-[70%]">{session?.user.name}</p>
          </div>
          <div className="w-full py-2 flex flex-row">
            <div className="w-[30%] text-left px-2 font-semibold text-sm sm:text-lg break-words">
              Bio
            </div>
            <p className="whitespace-pre-wrap w-[70%] text-xs">
              {session?.user.bio}
            </p>
          </div>
          <div className="w-full py-2 flex flex-row">
            <div className="w-[30%] text-left px-2 font-semibold text-sm sm:text-lg break-words">
              Fullname
            </div>
            <p className="break-words w-[70%]">{session?.user.fullname}</p>
          </div>
          <div className="w-full py-2 flex flex-row">
            <div className="w-[30%] text-left px-2 font-semibold text-sm sm:text-lg break-words">
              Birth
            </div>
            <p className="break-words w-[70%]">{session?.user.birthdate}</p>
          </div>
        </div>
        <div className="User_Profile_Page_Interactive_Bar">
          <Link href="/profile/setting/edit-profile">
            <button className="Button_variant_1">Edit information</button>
          </Link>
        </div>
      </div>
      <div className="bg-secondary-1/70 rounded-lg p-4 flex flex-col gap-4">
        <h1 className="text-primary font-bold text-2xl bg-accent/30 rounded-md px-2 py-1">
          Account information
        </h1>
        <div className="grid sm:grid-cols-2 grid-cols-1 p-2 sm:text-2xl text-md gap-4">
          <h1 className="text-accent font-semibold">
            joined:{" "}
            <span className="text-accent/90 font-bold">
              {session?.user?.createdAt
                ?.toString()
                .split("T")[0]
                .split("-")
                .reverse()
                .join("-")}
            </span>
          </h1>
          <h1 className="text-accent font-semibold">
            email:{" "}
            <span className="text-accent/90 font-bold break-words">
              {session?.user?.email}
            </span>
          </h1>
          <div className="flex gap-2">
            <h1 className="text-accent font-semibold">
              password: <span className="font-bold">*******</span>
            </h1>
            <Link
              href={"/profile/setting/change-password"}
              className="text-sm text-secondary-2/80 hover:font-bold underline"
            >
              change password
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
