import React, { useEffect, useRef, useState } from "react";

export default function CommentSection() {
  const [postCount, setPostCount] = useState(null);
  const [animated, setAnimate] = useState(false);
  const sectionRef = useRef(null);

  const fixedPositions = [
    { left: "5%", top: "10%", scale: 0.8 },
    { left: "20%", top: "40%", scale: 1 },
    { left: "2%", top: "30%", scale: 1.1 },
    { left: "15%", top: "25%", scale: 1.03 },
    { left: "30%", top: "40%", scale: 1.8 },
    { left: "50%", top: "55%", scale: 1.3 },
    { left: "65%", top: "35%", scale: 1.4 },
    { left: "80%", top: "15%", scale: 2 },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setAnimate(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      className="flex flex-col"
      ref={sectionRef}
      style={{ opacity: animated ? 1 : 0 }}
    >
      <span className={`title ${animated ? "animate-slideRight" : ""} mr-auto`}>
        You've commented{" "}
        {postCount || (
          <span className="dots">

          </span>
        )}{" "}
        times
      </span>

      <div className="relative min-w-[300px]  h-[200px]">
        <div className="bloom_right size-full absolute"></div>
        <div className="w-full flex flex-row gap-2 p-4 mb-4 h-[300px]">
          {fixedPositions.map((pos, index) => (
            <div
              key={index}
              className={`absolute  ${animated ? "animate-slideUp" : ""}`}
              style={{
                left: pos.left,
                top: pos.top,
                zIndex: index,
              }}
            >
              <div
                className={`absolute h-[15px] w-[40px] md:h-[30px] md:w-[80px] `}
                style={{
                  transform: `scale(${pos.scale})`,
                  filter: `blur(${2 - pos.scale}px)`, // Dynamic blur calculation
                }}
              >
                <div className="size-full relative shadow-none rounded-md bg-secondary-1/50 flex flex-row items-center justify-center p-1 gap-1">
                  <div className="h-full aspect-square rounded-full bg-accent/50"></div>
                  <div className="grow h-2/3 bg-accent rounded-md "></div>
                </div>

                <div
                  className="w-[15%] h-[10%] bg-secondary-1/50 ml-2"
                  style={{
                    borderBottomLeftRadius: "0%",
                    borderBottomRightRadius: "100%",
                  }}
                ></div>
                <div className="shadow "></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
