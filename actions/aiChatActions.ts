"use server";

export const getAIResponse = async (
  userMessage: string,
  userId: string | undefined
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/aichat`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          message: { role: "user", content: userMessage },
        }),
      }
    );

    const data = await response.json();

    const reply = data.reply;

    return reply || "Xin lỗi, tôi không hiểu.";

  } catch (error) {
    console.error("Lỗi khi gọi AI:", error);
    return "Xin lỗi, có lỗi xảy ra.";
  }
};

export const getAiMessage = async (chatId: string | undefined) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/aichat/${chatId}`
    );

    if (response.ok) {
      const data = await response.json();
      return data.messages;
    }
    return [];
  } catch (error) {
    console.error("Lỗi khi lấy tin nhắn:", error);
    return [];
  }
};
