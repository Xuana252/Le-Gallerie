import { settingRoutes } from "@constant/settingRoutes";
import {
  faKey,
  faUser,
  faUserGear,
  faUserLock,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function Setting() {
  const sections = settingRoutes.slice(1, settingRoutes.length);
  return (
    <section>
      <div className="w-full text-center text-3xl font-bold text-accent">
        Setting
      </div>
      <ul className="flex flex-col gap-6 my-8">
        {sections.map((section: any, index) => (
          <div key={index} className="relative">
            <div className="absolute size-full light_bottom_right z-0"></div>
            <div className="absolute size-full bloom_left z-0"></div>
            <div className="w-fit bg-secondary-1/50 px-2 py-1 rounded-t-xl text-secondary-2 font-bold text-base">{section.section}</div>
            <ul className="flex flex-wrap gap-6 p-4 bg-secondary-1/50 rounded-b-xl rounded-tr-xl">
              {section.items.map((item: any, index: number) => (
                <Link
                  href={item.path}
                  key={index}
                  className="grow min-w-[30%] bg-secondary-2/50 backdrop-blur-sm rounded-xl p-4 flex flex-col items-start gap-3 hover:bg-secondary-2/70 transition-transform duration-200"
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="text-xl sm:text-3xl text-accent/70"
                  />
                  <span className="font-bold text-accent text-xl">
                    {item.name}
                  </span>
                  <p className="text-accent/80 text-base">{item.description}</p>
                </Link>
              ))}
            </ul>
          </div>
        ))}
      </ul>
    </section>
  );
}
