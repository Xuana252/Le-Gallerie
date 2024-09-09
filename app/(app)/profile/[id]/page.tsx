"use client";
import React, { useContext, useEffect, useState } from "react";
import Feed from "@components/UI/Feed";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faUser } from "@fortawesome/free-solid-svg-icons";
import { User } from "@lib/types";
import {
  checkFollowState,
  fetchUserFollowers,
  fetchUserFollowing,
  fetchUserWithId,
  followUser,
} from "@server/accountActions";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@lib/firebase";
import { useSession } from "next-auth/react";
import { ChatContext } from "@components/UI/Nav";
import toastError, { confirm } from "@components/Notification/Toaster";
import { useRouter } from "next/navigation";
import PopupButton from "@components/Input/PopupButton";
import UserProfileIcon from "@components/UI/UserProfileIcon";
import Image from "@components/UI/Image";

export default function UserProfile({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [interactFlag, setInteractFlag] = useState<number>(0);
  const [followers, setFollowers] = useState<User[]>();
  const [followerCount, setFollowersCount] = useState<number>(0);
  const [following, setFollowing] = useState<User[]>();
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [curUserFollowers, setCurUserFollowers] = useState<User[]>();
  const [curUserFollowing, setCurUserFollowing] = useState<User[]>();
  const [postCount, setPostCount] = useState<number>(0);
  const [isFollowed, setIsFollowed] = useState(false);
  const router = useRouter();
  const { setChatInfo } = useContext(ChatContext);
  const [followType, setFollowType] = useState<"Followers" | "Following">(
    "Followers"
  );
  const [user, setUser] = useState<User>({
    _id: "",
    username: "unknown",
    image: "",
    bio: "",
  });

  const handleUnfollow = async (user: User) => {
    if (!session?.user.id) return;

    const unfollowConfirmation = await confirm(
      `You do want to unfollow ${user.username}?`
    );
    if (unfollowConfirmation) {
      setInteractFlag((c) => c + 1);
    } else {
      return;
    }
    try {
      await followUser(user._id, session.user.id);
    } catch (error) {
      console.log("Failed to update user follows");
    }
  };

  const handleFollow = async (user: User) => {
    if (!session?.user.id) {
      const loginConfirm = await confirm("you need to login first");
      if (loginConfirm) {
        router.push("/sign-in");
      }
      return;
    }

    setInteractFlag((c) => c + 1);

    try {
      await followUser(user._id, session.user.id);
    } catch (error) {
      console.log("Failed to update user follows");
    }
  };

  const handleChangeFollowState = async () => {
    if (!session?.user.id) {
      const loginConfirm = await confirm("you need to login first");
      if (loginConfirm) {
        router.push("/sign-in");
      }
      return;
    }
    if (isFollowed) {
      const unfollowConfirmation = await confirm(
        `You do want to unfollow ${user.username}?`
      );
      if (unfollowConfirmation) {
        setIsFollowed(false);
        setFollowersCount((c) => c - 1);
      } else {
        return;
      }
    } else {
      setIsFollowed(true);
      setFollowersCount((c) => c + 1);
    }

    try {
      await followUser(params.id, session.user.id);
    } catch (error) {
      console.log("Failed to update user follows");
    }
  };

  const fetchUser = async () => {
    try {
      const data = await fetchUserWithId(params.id);
      if (JSON.stringify(data) !== JSON.stringify(user)) setUser(data);
    } catch (error) {
      console.log("Failed to fetch for user info");
    }
  };
  useEffect(() => {
    const fetchFollowers = async () => {
      const response = await fetchUserFollowers(params.id);
      if (session?.user.id) {
        const curUserFollowers = await fetchUserFollowers(session.user.id);
        setCurUserFollowers(curUserFollowers?.users);
      }
      setFollowers(response?.users);
      setFollowersCount(response?.length);
    };
    const fetchFollowing = async () => {
      const response = await fetchUserFollowing(params.id);
      if (session?.user.id) {
        const curUserFollowing = await fetchUserFollowing(session.user.id);
        setCurUserFollowing(curUserFollowing?.users);
      }
      setFollowing(response?.users);
      setFollowingCount(response?.length);
    };
    const fetchFollowState = async () => {
      if (!session?.user.id) return;
      const response = await checkFollowState(params.id, session?.user.id);
      setIsFollowed(response);
    };
    fetchFollowers();
    fetchFollowing();
    fetchFollowState();
  }, [params.id, session, interactFlag]);

  useEffect(() => {
    const storeUser = localStorage.getItem("user");
    if (storeUser) {
      const user = JSON.parse(storeUser);
      setUser(user);
      setIsFollowed(user.followed);
    }
    fetchUser();
  }, []);

  const startChat = async () => {
    if (!session) {
      const loginConfirm = await confirm("you need to login first");
      if (loginConfirm) {
        router.push("/sign-in");
      }
      return;
    }

    const chatRef = collection(db, "chat");
    const usersChatRef = collection(db, "usersChat");

    try {
      const receiverDocRef = doc(usersChatRef, session.user.id);
      const receiverDocSnap = await getDoc(receiverDocRef);
      let existingChat = null;

      if (receiverDocSnap.exists()) {
        const receiverData = receiverDocSnap.data();

        if (receiverData.chat) {
          existingChat = receiverData.chat.find(
            (chat: any) => chat.receiverId === params.id
          );
          existingChat = existingChat ? { ...existingChat, user } : null;
        }
      }

      if (!existingChat) {
        const newChatRef = doc(chatRef);
        await setDoc(newChatRef, {
          createAt: serverTimestamp(),
          message: [],
        });

        await updateDoc(doc(usersChatRef, params.id), {
          chat: arrayUnion({
            chatId: newChatRef.id,
            lastMessage: "",
            receiverId: session.user.id,
            updatedAt: Date.now(),
          }),
        });
        await updateDoc(doc(usersChatRef, session.user.id), {
          chat: arrayUnion({
            chatId: newChatRef.id,
            lastMessage: "",
            receiverId: params.id,
            updatedAt: Date.now(),
          }),
        });

        const currentUserChatData = await getDoc(
          doc(usersChatRef, session.user.id)
        );
        if (currentUserChatData.exists()) {
          const items = currentUserChatData.data()?.chat || [];

          // Fetch additional user data
          const chatItem = items.find(
            (item: any) => item.receiverId === params.id
          );

          if (chatItem) {
            // Add user data to the chat item
            existingChat = { ...chatItem, user };
          }
        }
      }
      setChatInfo(existingChat);
    } catch (error) {
      console.log(error);
    }
  };

  const FollowList = () => {
    const list = (followType === "Followers" ? followers : following) || [];
    return (
      <div className="text-base">
        <div className="grid grid-cols-2">
          <button
            name="Following"
            onClick={() => setFollowType("Following")}
            className={`font-bold ${
              followType === "Following" &&
              "bg-secondary-1 mb-[-10px] text-primary rounded-lg pt-1 pb-3 font-bold"
            }`}
          >
            Following
          </button>
          <button
            name="Followers"
            onClick={() => setFollowType("Followers")}
            className={`font-bold ${
              followType === "Followers" &&
              "bg-secondary-1 mb-[-10px] text-primary rounded-lg pt-1 pb-3 font-bold"
            }`}
          >
            Followers
          </button>
        </div>
        <ul className="bg-secondary-1 w-[300px] h-[400px] sm:w-[400px] sm:h-[500px] rounded-lg py-4 px-2 flex flex-col gap-2">
          {list.map((item) => (
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                {item._id === session?.user.id ? (
                  <UserProfileIcon currentUser={true} />
                ) : (
                  <UserProfileIcon currentUser={false} user={item} />
                )}
                {item.username}
              </label>
              {item._id === session?.user.id ? null : curUserFollowing?.find(
                  (follow) => follow._id === item._id
                ) ? (
                <button
                  className="Button_variant_1 ml-auto"
                  onClick={() => handleUnfollow(item)}
                >
                  Unfollow
                </button>
              ) : curUserFollowers?.find(
                  (follow) => follow._id === item._id
                ) ? (
                <button
                  className="Button_variant_1 ml-auto"
                  onClick={() => handleFollow(item)}
                >
                  Follow back
                </button>
              ) : (
                <button
                  className="Button_variant_1 ml-auto"
                  onClick={() => handleFollow(item)}
                >
                  Follow
                </button>
              )}
            </div>
          ))}
        </ul>
      </div>
    );
  };
  return (
    <section className="text-accent">
      <div className="User_Profile_Layout">
        <div className=" User_Profile_Page_Picture ">
          {user.image ? (
            <Image
              src={user.image}
              alt={"profile picture"}
              className="size-full"
              width={0}
              height={0}
              style={{ objectFit: "cover" }}
              transformation={[{ quality: 80 }]}
              lqip={{ active: true, quality: 20 }}
            />
          ) : (
            <FontAwesomeIcon icon={faUser} size="xl" className="size-full" />
          )}
        </div>
        <div>
          <div className="flex">
            <h1 className="User_Profile_Page_Username">{user.username}</h1>
          </div>
          <br />
          <h2 className="User_Profile_Page_Bio">{user.bio}</h2>
        </div>
        <div className="User_Profile_Page_Stat_Bar">
          <PopupButton popupItem={<FollowList />}>
            <h1
              className="flex flex-col items-center justify-start"
              onClick={() => setFollowType("Followers")}
            >
              <span className="font-semibold">{followerCount}</span>
              Followers
            </h1>
          </PopupButton>
          <PopupButton popupItem={<FollowList />}>
            <h1
              className="flex flex-col items-center justify-start"
              onClick={() => setFollowType("Following")}
            >
              <span className="font-semibold">{followingCount}</span>
              Following
            </h1>
          </PopupButton>
          <h1 className="flex flex-col items-center justify-start">
            <span className="font-semibold">{postCount}</span>Posts
          </h1>
        </div>
      </div>
      <div className="User_Profile_Page_Interactive_Bar">
        <button
          className={`${
            isFollowed ? "Button_variant_1" : "Button_variant_1_5"
          }`}
          onClick={handleChangeFollowState}
        >
          {isFollowed ? "Unfollow" : "Follow"} {user.username}
        </button>
        <button className="Button_variant_1" onClick={startChat}>
          Message {user.username} <FontAwesomeIcon icon={faComment} />
        </button>
      </div>
      <h1 className="text-center text-xl my-4 ">See {user.username}'s posts</h1>
      <div className="shadow-inner bg-secondary-2/20 rounded-xl">
        {user._id && (
          <Feed
            userIdFilter={user._id}
            showCateBar={false}
            setPostCount={setPostCount}
          ></Feed>
        )}
      </div>
    </section>
  );
}
