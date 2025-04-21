import PostCard from "@components/UI/Post/PostCard";
import { extractDomain } from "./chat";
import { fetchPostWithId } from "@actions/postActions";

export const renderAppLink = async (text: string, index = 1) => {
  try {

    const cleanedText = text.endsWith('.') ? text.slice(0, -1) : text;

    const url = new URL(cleanedText);
    const pathname = url.pathname;

    const postRegex = /^\/post\/[a-zA-Z0-9_-]+$/;
    if (postRegex.test(pathname)) {
      const postId = pathname.split("/")[2];
      const post = await fetchPostWithId(postId);
      if (post.data !== null) {
        return <div className="max-w-[200px]">
          <PostCard key={index} isLoading={false} post={post.data} />
        </div>;
      }
    }
  } catch (error) {
    console.error("Error in renderAppLink:", error);
  }

  return (
    <a
      key={index}
      href={text}
      target="_blank"
      rel="noopener noreferrer"
      className={` inline-block whitespace-pre-line word-normal break-all text-xs  my-2 bg-primary text-accent rounded-lg  `}
    >
      <div className="underline m-1">{text}</div>
      <div className="flex flex-row gap-2 items-center text-sm mt-2 bg-accent/50 p-1 text-primary">
        <span className="font-AppLogo text-base">AppLogo</span>
        <span className="font-AppName text-xs">Le Gallerie</span>
      </div>
    </a>
  );
};

export const renderLink = (link: string, index = 1) => {
  return (
    <a
      key={index}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={` inline-block whitespace-pre-line word-normal break-all text-xs  my-2 bg-primary text-accent rounded-lg  `}
    >
      <div className="underline m-1">{link}</div>
      <div className="text-sm mt-2 bg-accent/50 p-1 text-primary">
        {extractDomain(link)}
      </div>
    </a>
  );
};

export const renderTextWithLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  const currentDomain = extractDomain(
    process.env.NEXT_PUBLIC_DOMAIN_NAME || "http://localhost:3000"
  );

  return parts.map((part) => {
    if (urlRegex.test(part)) {
      const domain = extractDomain(part);

      if (domain === currentDomain) {
        // App-specific link
        return { type: "appLink", content: part };
      } else {
        // Regular external link
        return { type: "link", content: part };
      }
    }

    // Plain text
    return { type: "text", content: part };
  });
};

export const RenderBackground = (theme: string) => {
  switch (theme) {
    case "theme-spiderman-classic":
      return (
        <div
          className="size-full"
          style={{
            background: `url(/backgrounds/Games/Spiderman.png)`,
            backgroundSize: "auto 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      );
    case "theme-spiderman-miles":
      return (
        <div
          className="size-full"
          style={{
            background: `url(/backgrounds/Games/MilesMorales.jpg)`,
            backgroundSize: "100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      );
    case "theme-spiderman-2099":
      return (
        <div
          className="size-full"
          style={{
            background: `url(/backgrounds/Games/Spiderman2099.jpg)`,
            backgroundSize: "100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      );
    case "theme-spiderman-symbiote":
      return (
        <div
          className="size-full"
          style={{
            background: `url(/backgrounds/Games/Venom.jpg)`,
            backgroundSize: "100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      );
    case "theme-spiderman-gwen":
      return <div
      className="size-full"
      style={{
        background: `url(/backgrounds/Games/SpiderGwen.jpg)`,
        backgroundSize: "auto 100%",
        backgroundPosition: "60% 0%",
        backgroundRepeat: "no-repeat",
      }}
    ></div>;
    case "theme-playstation":
      return (
        <div
          className="size-full"
          style={{
            background: `url(/backgrounds/Games/Playstation.jpg)`,
            backgroundSize: "auto 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      );
    case "theme-the-witcher-3":
      return (
        <div
          className="size-full"
          style={{
            background: `url(/backgrounds/Games/TheWitcher3.jpg)`,
            backgroundSize: "100%",
            backgroundPosition: "0% 60%",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      );
    case "theme-legend-of-zelda":
      return (
        <div
          className="size-full"
          style={{
            background: `url(/backgrounds/Games/BOTW.jpg)`,
            backgroundSize: "100%",
            backgroundPosition: "0% 50%",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      );
    case "theme-animal-crossing":
      return (
        <div
          className="size-full"
          style={{
            background: `url(/backgrounds/Games/Animal_Crossing.jpg)`,
            backgroundSize: "auto 100%",
            backgroundPosition: "right",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      );
    case "theme-red-dead-redemption":
      return (
        <div
          className="size-full"
          style={{
            background: `url(/backgrounds/Games/Red_Dead_Redemption_2.jpg)`,
            backgroundSize: "100%",
            backgroundPosition: "bottom",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      );
    case "theme-cyberpunk2077":
      return (
        <div
          className="size-full"
          style={{
            background: `url(/backgrounds/Games/Cyberpunk_2077.png)`,
            backgroundSize: "auto 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      );
    case "theme-max-caulfield":
      return (
        <div
          className="size-full"
          style={{
            background: `url(/backgrounds/Games/LifeisStrange.jpg)`,
            backgroundSize: "auto 100%",
            backgroundPosition: "35% 0%",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      );
    case "theme-god-of-war":
      return (
        <div
          className="size-full"
          style={{
            background: `url(/backgrounds/Games/GodofWar.jpg)`,
            backgroundSize: "auto 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      );
    case "theme-elden-ring":
      return (
        <div
          className="size-full"
          style={{
            background: `url(/backgrounds/Games/EldenRing.png)`,
            backgroundSize: "100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      );
    case "theme-final-fantasy-vii":
      return (
        <div
          className="size-full"
          style={{
            background: `url(/backgrounds/Games/FFVII.png)`,
            backgroundSize: "100%",
            backgroundPosition: "bottom",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      );
    case "theme-dark-souls":
      return (
        <div className="size-full bg-black">
          <div
            className="size-full"
            style={{
              background: `url(/backgrounds/Games/DarkSouls.jpg)`,
              backgroundSize: "auto 100%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
        </div>
      );
    case "theme-minecraft":
      return (
        <div
          className="size-full"
          style={{
            background: `url(/backgrounds/Games/Minecraft.jpg)`,
            backgroundSize: "auto 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      );
    default:
      return <div className="size-full bg-secondary-1"></div>;
  }
};

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
