import { ChatContext } from "@components/UI/Nav";
import { db } from "@lib/firebase";
import { User } from "@lib/types";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import { useContext } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Reaction } from "@enum/reactionEnum";

const chatRef = collection(db, "chat");
const usersChatRef = collection(db, "usersChat");

export const RenderLog = (type: number, username: String) => {
  switch (type) {
    case 0:
      return `${username} created chat`;
    case 1:
      return `${username} pinned a message`;
    case 2:
      return `${username} left the chat`;
    case 3:
      return `${username} was added to the chat`;
    case 4:
      return `${username} was kicked out`;
    case 5:
      return `${username} changed the theme`;
    case 6:
      return `${username} is the new admin`;
  }
};

export const removeChatFromUserChat = async (
  chatId: string,
  userId: string
) => {
  const userChatDoc = await getDoc(doc(usersChatRef, userId));

  if (userChatDoc.exists()) {
    const userChatData = userChatDoc.data();
    const chatArray = userChatData.chat || [];

    const chatToRemove = chatArray.find((chat: any) => chat.chatId === chatId);

    if (chatToRemove) {
      await updateDoc(doc(chatRef, chatId), {
        memberIds: arrayRemove(userId),
      });
      await updateDoc(doc(usersChatRef, userId), {
        chat: arrayRemove(chatToRemove),
      });
    }
  }
};

export const updateAdmin = async (chatId: string, userId: string) => {
  const chatDocRef = await getDoc(doc(chatRef, chatId));

  if (chatDocRef.exists()) {
    await updateDoc(doc(chatRef, chatId), {
      admin: userId,
    });

    addLog(chatId, 6, userId);
  }
};

export const leaveChat = async (chatId: string, userId: string) => {
  await removeChatFromUserChat(chatId, userId);
  await addLog(chatId, 2, userId);
};

export const kickFromChat = async (chatId: string, userId: string) => {
  await removeChatFromUserChat(chatId, userId);
  await addLog(chatId, 4, userId);
};

export const joinChat = async (chatId: string, userId: string) => {
  const userChatDoc = await getDoc(doc(usersChatRef, userId));
  const chatDoc = await getDoc(doc(chatRef, chatId));

  if (!chatDoc.exists()) return;
  const chatData = chatDoc.data();

  const memberIds = chatData.memberIds || [];
  if (!userChatDoc.exists()) {
    await setDoc(doc(usersChatRef, userId), {
      chat: [
        {
          chatId: chatId,
          lastMessage: "",
          receiverIds: [...memberIds],
          updatedAt: Date.now(),
        },
      ],
    });
  } else {
    const userChatData = userChatDoc.data();

    const userChats = userChatData.chat || [];

    if (userChats.findIndex((chat: any) => chat.chatId === chatId) === -1) {
      await updateDoc(doc(usersChatRef, userId), {
        chat: arrayUnion({
          chatId: chatId,
          lastMessage: "",
          receiverIds: [...memberIds],
          updatedAt: Date.now(),
        }),
      });
    }
  }

  await updateDoc(doc(chatRef, chatId), {
    memberIds: arrayUnion(userId),
  });

  await addLog(chatId, 3, userId);
};

export const changeChatTheme = async (
  chatId: string,
  theme: string,
  userId: string
) => {
  const chatDoc = await getDoc(doc(chatRef, chatId));

  if (chatDoc.exists()) {
    await updateDoc(doc(chatRef, chatId), {
      theme: theme,
    });
  }

  await addLog(chatId, 5, userId);
};

export const addLog = async (chatId: string, type: number, userId: string) => {
  //0: create chat
  //1: pin message
  //2: leave chat
  //3: join chat
  //4: kick user
  //5: change theme
  //6: update admin
  const chatDoc = await getDoc(doc(chatRef, chatId));

  if (chatDoc.exists()) {
    await updateDoc(doc(chatRef, chatId), {
      log: arrayUnion({
        createdAt: new Date(),
        type,
        userId,
      }),
    });
  }
};

export const removeChatItem = async (chatId: string, id: string) => {
  const chatDoc = await getDoc(doc(chatRef, chatId));

  if (chatDoc.exists()) {
    const chatData = chatDoc.data();
    const messageArray = chatData.message || [];

    // Update the message at the specified index
    const updatedMessages = messageArray.map((msg: any) =>
      msg.id === id ? { ...msg, delete: true } : msg
    );

    await updateDoc(doc(chatRef, chatId), {
      message: updatedMessages,
    });
  }
};

export const pinMessage = async (
  chatId: string,
  id: string,
  userId: string
) => {
  const chatDoc = await getDoc(doc(chatRef, chatId));

  if (chatDoc.exists()) {
    await updateDoc(doc(chatRef, chatId), {
      pinned: id,
    });

    await addLog(chatId, 1, userId);
  }
};

export const deleteChat = async (userId: string, chatId: string) => {
  const userChatDoc = await getDoc(doc(usersChatRef, userId));

  if (!userChatDoc.exists()) return;

  const userChatData = userChatDoc.data();
  const chatArray = userChatData.chat || [];

  // Find the chat object to get receiverIds
  const chatToRemove = chatArray.find((chat: any) => chat.chatId === chatId);

  if (!chatToRemove) return;

  const receiverIds = chatToRemove.receiverIds || [];

  // Remove chat from the current user
  await updateDoc(doc(usersChatRef, userId), {
    chat: chatArray.filter((chat: any) => chat.chatId !== chatId),
  });

  // Remove chat from all receivers
  await Promise.all(
    receiverIds.map(async (receiverId: string) => {
      const receiverChatDoc = await getDoc(doc(usersChatRef, receiverId));

      if (receiverChatDoc.exists()) {
        const receiverChatData = receiverChatDoc.data();
        const receiverChatArray = receiverChatData.chat || [];

        await updateDoc(doc(usersChatRef, receiverId), {
          chat: receiverChatArray.filter((chat: any) => chat.chatId !== chatId),
        });
      }
    })
  );

  // Delete the chat document
  await deleteDoc(doc(chatRef, chatId));
};

export const addChatItemReaction = async (
  chatId: string,
  id: string,
  reaction: Reaction,
  userId: string
) => {
  const chatDoc = await getDoc(doc(chatRef, chatId));

  if (chatDoc.exists()) {
    const chatData = chatDoc.data();
    const messageArray = chatData.message || [];

    // Update the message at the specified index
    const updatedMessages = messageArray.map((msg: any) => {
      if (msg.id !== id) return msg;

      const existingReactions = msg.reactions || [];

      const existingReactionIndex = existingReactions.findIndex(
        (r: any) => r.userId === userId
      );

      if (existingReactionIndex !== -1) {
        if (existingReactions[existingReactionIndex].reaction === reaction) {
          existingReactions.splice(existingReactionIndex, 1);
        } else {
          existingReactions[existingReactionIndex].reaction = reaction;
        }
      } else {
        existingReactions.push({ userId, reaction });
      }

      return { ...msg, reactions: existingReactions };
    });

    await updateDoc(doc(chatRef, chatId), {
      message: updatedMessages,
    });

    await updateDoc(doc(chatRef, chatId), {
      message: updatedMessages,
    });
  }
};

export const startChat = async (
  user: User,
  setChatInfo: (chat: any) => void,
  router: any
) => {
  const session = await getSession();
  if (!session) {
    const loginConfirm = await confirm("you need to login first");
    if (loginConfirm) {
      router.push("/sign-in");
    }
    return;
  }

  let existingChat = null;

  try {
    const myUserChatDocRef = doc(usersChatRef, session.user.id);
    const myUserChatDocSnap = await getDoc(myUserChatDocRef);

    const otherUserChatDocRef = doc(usersChatRef, user._id);
    const otherUserChatDocSnap = await getDoc(otherUserChatDocRef);

    if (myUserChatDocSnap.exists()) {
      const receiverData = myUserChatDocSnap.data();

      if (receiverData.chat) {
        for (const chat of receiverData.chat) {
          const chatData = await getDoc(doc(chatRef, chat.chatId));
          if (
            chatData.exists() &&
            chatData.data()?.type === "single" &&
            chat.receiverIds.some((id: string) => id === user._id)
          ) {
            existingChat = {
              ...chat,
              type: "single",
              users: [
                user,
                {
                  _id: session.user.id,
                  username: session.user.name,
                  image: session.user.image,
                },
              ],
            };
            break; // Stop the loop once a match is found
          }
        }
      }
    } else {
      await setDoc(doc(usersChatRef, session.user.id || ""), {
        chat: [],
      });
    }

    if (!otherUserChatDocSnap.exists()) {
      await setDoc(doc(usersChatRef, user._id || ""), {
        chat: [],
      });
    }

    if (!existingChat) {
      const newChatRef = doc(chatRef);
      const newChat = await setDoc(newChatRef, {
        createAt: serverTimestamp(),
        message: [],
        type: "single",
        admin: "",
        pinned: "",
        log: [
          { createdAt: new Date(), type: 0, userId: session.user.id || "" },
        ],
        theme: "theme1",
      });

      await updateDoc(doc(usersChatRef, user._id), {
        chat: arrayUnion({
          chatId: newChatRef.id,
          isSeen: false,
          lastMessage: "",
          receiverIds: [session.user.id],
          updatedAt: Date.now(),
        }),
      });
      await updateDoc(doc(usersChatRef, session.user.id), {
        chat: arrayUnion({
          chatId: newChatRef.id,
          isSeen: false,
          lastMessage: "",
          receiverIds: [user._id],
          updatedAt: Date.now(),
        }),
      });

      const currentUserChatData = await getDoc(
        doc(usersChatRef, session.user.id)
      );
      if (currentUserChatData.exists()) {
        const chatItems = currentUserChatData.data()?.chat || [];
        const chatInfo = chatItems.find(
          (chat: any) =>
            chat.receiverIds[0] === user._id && chat.receiverIds.length === 1
        );
        if (chatInfo) {
          const chatData = await getDoc(doc(chatRef, chatInfo.chatId));
          if (chatData.exists()) {
            existingChat = {
              ...chatInfo,
              type: "single",
              users: [
                user,
                {
                  _id: session.user.id,
                  username: session.user.name,
                  image: session.user.image,
                },
              ],
            };
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    setChatInfo(existingChat);
  }
};

export const createGroupChat = async (
  users: User[],
  setChatInfo: (chat: any) => void,
  router: any,
  name: string,
  image: string
) => {
  const session = await getSession();
  if (!session) {
    const loginConfirm = await confirm("you need to login first");
    if (loginConfirm) {
      router.push("/sign-in");
    }
    return;
  }

  try {
    const myUserChatDocRef = doc(usersChatRef, session.user.id);
    const myUserChatDocSnap = await getDoc(myUserChatDocRef);

    if (!myUserChatDocSnap.exists()) {
      await setDoc(doc(usersChatRef, session.user.id || ""), {
        chat: [],
      });
    }

    users.map(async (user: User) => {
      const userChatDocRef = doc(usersChatRef, user._id);
      const userChatDocSnap = await getDoc(userChatDocRef);

      if (!userChatDocSnap.exists()) {
        await setDoc(doc(usersChatRef, user._id || ""), {
          chat: [],
        });
      }
    });

    const newChatRef = doc(chatRef);
    const newChat = await setDoc(newChatRef, {
      createAt: serverTimestamp(),
      memberIds: [...users.map((user: User) => user._id), session.user.id],
      name: name,
      message: [],
      type: "group",
      admin: session.user.id || "",
      pinned: "",
      log: [{ createdAt: new Date(), type: 0, userId: session.user.id || "" }],
      theme: "theme1",
      image: image,
    });

    await Promise.all(
      users.map(async (user: User) => {
        await updateDoc(doc(usersChatRef, user._id), {
          chat: arrayUnion({
            chatId: newChatRef.id,
            isSeen: false,
            lastMessage: "",
            receiverIds: [
              session.user.id,
              ...users.filter((u) => u._id !== user._id).map((u) => u._id),
            ],
            updatedAt: Date.now(),
          }),
        });
      })
    );

    await updateDoc(doc(usersChatRef, session.user.id), {
      chat: arrayUnion({
        chatId: newChatRef.id,
        isSeen: false,
        lastMessage: "",
        receiverIds: [...users.map((u) => u._id)],
        updatedAt: Date.now(),
      }),
    });

    const currentUserChatData = await getDoc(
      doc(usersChatRef, session.user.id)
    );
    if (currentUserChatData.exists()) {
      const chats = currentUserChatData.data()?.chat || [];
      const chatData = await getDoc(doc(chatRef, newChatRef.id));
      const chatItem = chats.find((chat: any) => chat.chatId === newChatRef.id);

      if (chatData.exists()) {
        const chatInfo = {
          ...chatItem,
          type: "group",
          image: image,
          name: name,
          users: [
            ...users,

            {
              _id: session.user.id,
              username: session.user.name,
              image: session.user.image,
            },
          ],
        };
        setChatInfo(chatInfo);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
