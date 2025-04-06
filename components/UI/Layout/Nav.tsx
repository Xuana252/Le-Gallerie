"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCommentDots,
  faCircleHalfStroke,
  faRightFromBracket,
  faImage,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import InputBox from "../../Input/InputBox";
import DropDownButton from "../../Input/DropDownButton";
import { signOut, useSession } from "next-auth/react";
import { SetStateAction, useEffect, useReducer, useState } from "react";
import UserProfileIcon from "../Profile/UserProfileIcon";
import { createContext, Dispatch } from "react";
import ThemeList from "@theme/ThemesList";
import NotificationButton from "@components/Notification/NotificationButton";
import ChatButton from "@components/Chat/ChatButton";
import ChatBox from "@components/Chat/ChatBox";
import { Category } from "@lib/types";

export const ButtonSet = () => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const [windowSize, setSize] = useState(0);
  const [unseenMessageCount, setUnseenMessageCount] = useState(0);
  const [unseenNotificationCount, setUnseenNotificationCount] = useState(0);

  useEffect(() => {
    const handleResize = () => setSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setSize(window.innerWidth);
  }, []);

  const ButtonSet = (
    <>
      {session?.user && (
        <>
          <Link href={"/post/create"}>
            <button className="Icon">
              <FontAwesomeIcon icon={faImage} />
            </button>
          </Link>
          <ChatButton returnUnseenCount={setUnseenMessageCount} />
          <NotificationButton returnUnseenCount={setUnseenNotificationCount} />
        </>
      )}
      <DropDownButton dropDownList={<ThemeList />}>
        <div className="Icon">
          <FontAwesomeIcon icon={faCircleHalfStroke} />
        </div>
      </DropDownButton>
      {pathName === "/profile" ? (
        <button className="Icon relative" onClick={() => signOut()}>
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      ) : (
        <UserProfileIcon currentUser={true} />
      )}
    </>
  );
  return (
    <>
      {windowSize >= 640 ? (
        <div className="Buttons_container">{ButtonSet}</div>
      ) : (
        <DropDownButton dropDownList={ButtonSet} Zindex={10}>
          <div className="Icon relative">
            <div
              className={`${
                unseenMessageCount + unseenNotificationCount > 0 ? "" : "hidden"
              } absolute top-1 right-1 rounded-full size-4 bg-primary text-accent text-xs font-bold `}
            >
              {unseenMessageCount + unseenNotificationCount}
            </div>
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </div>
        </DropDownButton>
      )}
    </>
  );
};
type SearchContextType = {
  category: Category[];
  searchText: string;
  handleSetCategory: (category: Category) => void;
  handleSearch: (text: string) => void;
};

type ChatContextType = {
  chatInfo: any;
  chatList: any[];
  setChatList: Dispatch<SetStateAction<any[]>>;
  setChatInfo: Dispatch<SetStateAction<any>>;
};

export const SearchContext = createContext<SearchContextType>({
  category: [],
  searchText: "",
  handleSetCategory: () => {},
  handleSearch: () => {},
});

export const ChatContext = createContext<ChatContextType>({
  chatInfo: null,
  chatList: [],
  setChatList: () => {},
  setChatInfo: () => {},
});

type SearchState = {
  text: string;
  category: Category[];
};

type SearchAction =
  | { type: "Search"; payload: string }
  | { type: "Select_Category"; payload: Category[] };

const reducer = (state: SearchState, action: SearchAction): SearchState => {
  switch (action.type) {
    case "Search":
      return { ...state, text: action.payload };
    case "Select_Category":
      return { ...state, category: action.payload };
    default:
      return state;
  }
};

const initialState = { text: "", category: [] };

export default function Nav({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const textParams = searchParams.get("text") || "";
  const router = useRouter();

  const [searchState, dispatch] = useReducer(reducer, initialState);

  const [chatList, setChatList] = useState<any[]>([]);

  const [pendingText, setPendingText] = useState(textParams);

  const [chatInfo, setChat] = useState(null);

  const handleSetCategory = (category: Category) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("category", category.name);

    router.push(`/search?${newParams.toString()}`);
    dispatch({ type: "Select_Category", payload: [category] });
  };
  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPendingText(e.target.value);
  };

  const setChatInfo = (chat: any) => {
    setChat(chat);
  };

  const handleSearch = (text: string) => {
    if (!text) return;
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("text", text);

    router.push(`/search?${newParams.toString()}`);
    dispatch({ type: "Search", payload: text });
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const finalText = pendingText
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      handleSearch(finalText);
    }
  };

  useEffect(() => {
    textParams !== "" && handleSearch(textParams);
  }, [textParams]);

  return (
    <>
      <ChatContext.Provider value={{ chatInfo,chatList, setChatInfo,setChatList }}>
        <SearchContext.Provider
          value={{
            searchText: searchState.text,
            category: searchState.category,
            handleSetCategory,
            handleSearch,
          }}
        >
          <nav className="Nav_bar">
            <div className="justify-between pointer-events-auto h-full w-full gap-1 px-2 items-center flex">
              <div className="flex items-center">
                <button
                  className="flex gap-2 items-center px-2"
                  onClick={() => {
                    router.push("/home");
                    setPendingText("");
                  }}
                >
                  <div className="font-AppLogo text-3xl">AppLogo</div>
                  <div className="hidden lg:block font-AppName h-full">
                    Le Gallerie
                  </div>
                </button>
              </div>

              {
                <InputBox
                  onTextChange={handleSearchTextChange}
                  onKeyDown={handleSearchKeyPress}
                  value={pendingText}
                  type="SearchBox"
                >
                  Search for posts...
                </InputBox>
              }

              <ButtonSet />
            </div>
          </nav>
          {children}
          {chatInfo && <ChatBox />}
        </SearchContext.Provider>
      </ChatContext.Provider>
    </>
  );
}
