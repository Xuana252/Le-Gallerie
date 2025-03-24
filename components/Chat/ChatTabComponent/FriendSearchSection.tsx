
import InputBox from "@components/Input/InputBox";
import { faUser } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { useSession } from "@node_modules/next-auth/react";

import { User } from "@lib/types";
import React, { useContext, useEffect, useRef, useState } from "react";

import CustomImage from "@components/UI/Image/Image";
import { fetchUserFollowers } from "@actions/followsActions";

export default function FriendSearchSection({
  onSelected,
  filter = []
}: {
  onSelected: (user: User) => any;
  filter?: string[] ;
}) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [followers, setFollowers] = useState<User[]>([]);

  const [searchText, setSearchText] = useState("");

  const fetchFollowers = async () => {
    setIsLoading(true);
    const response = await fetchUserFollowers(session?.user.id || "");
    setFollowers(response?.users.filter((user:User)=>filter.findIndex(id=>id===user._id)===-1) || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFollowers();
  }, []);

  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
  return (
    <div className="bg-secondary-1 rounded-lg p-1 flex flex-col gap-2 w-full">
      <InputBox
        name="searchFriendInput"
        showName={false}
        value={searchText}
        onTextChange={handleSearchTextChange}
        type="SearchBox"
        styleVariant="Input_box_variant_2"
        style={{ fontSize: "1em" }}
      />
      <ul className="flex flex-row gap-2 px-2 overflow-x-scroll items-center no-scrollbar ">
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col h-fit  gap-1 items-center justify-between p-1"
              >
                <div className="Icon_big animate-pulse bg-secondary-2"></div>
                <span className="w-[50px] bg-accent animate-pulse h-2 rounded-lg"></span>
              </div>
            ))
          : followers
              .filter((follower) =>
                follower.username
                  ?.toLowerCase()
                  .includes(searchText?.toLowerCase() || "")
              )
              .map((follower) => (
                <label
                  key={follower._id}
                  className="flex flex-col h-fit  gap-1 items-center justify-between hover:bg-primary rounded-lg p-1"
                >
                  <button
                    className={`bg-secondary-2 relative Icon `}
                    onClick={(e) =>{e.preventDefault(), onSelected(follower)}}
                  >
                    {follower.image ? (
                      <CustomImage
                        src={follower.image}
                        alt="profile picture"
                        className="size-full"
                        width={0}
                        height={0}
                        transformation={[{ quality: 10 }]}
                        style={{ objectFit: "cover" }}
                      ></CustomImage>
                    ) : (
                      <FontAwesomeIcon icon={faUser} className="m-0" />
                    )}
                  </button>
                  <span className="text-xs text-accent whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[100px]">
                    {follower.username}
                  </span>
                </label>
              ))}

              
      </ul>
    </div>
  );
}
