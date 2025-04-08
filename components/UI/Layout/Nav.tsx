"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import InputBox from "../../Input/InputBox";
import { SetStateAction, useEffect, useReducer, useState } from "react";

import { createContext, Dispatch } from "react";
import ChatBox from "@components/Chat/ChatBox";
import { Category } from "@lib/types";

import { ButtonSet } from "./NavButtonSet";

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
  const pathName = usePathname();
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
      <ChatContext.Provider
        value={{ chatInfo, chatList, setChatInfo, setChatList }}
      >
        <SearchContext.Provider
          value={{
            searchText: searchState.text,
            category: searchState.category,
            handleSetCategory,
            handleSearch,
          }}
        >
          <nav className="Nav_bar">
            <div className="justify-between pointer-events-auto h-full w-full gap-1 px-2 items-center flex relative">
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

              {!pathName.startsWith("/admin") && (
                <InputBox
                  onTextChange={handleSearchTextChange}
                  onKeyDown={handleSearchKeyPress}
                  value={pendingText}
                  type="SearchBox"
                >
                  Search for posts...
                </InputBox>
              )}

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
