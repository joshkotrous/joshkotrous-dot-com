import Link from "next/link";
import Ascii from "./components/ascii";
import HeroBanner from "./components/heroBanner";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { IoLogoGithub } from "react-icons/io";

export default function Home() {
  return (
    <div className="flex justify-center h-screen overflow-hidden pt-[4.5rem]">
      <main className="">
        <div className="flex gap-2 w-full md:justify-center">
          <Ascii className="size-fit" />
          <div className="text-sm w-1/2">
            Engineering leader and hacker at heart.
            <br />
            <br />
            Currently defending the web against vulnerable code @ Pensar.
            <br />
            <br />
            <div className="flex flex-col gap-2">
              Contact me:
              <div className="flex gap-2 text-xl">
                <Link target="_blank" href="https://www.x.com/kotro___">
                  <FaXTwitter />
                </Link>
                <Link
                  target="_blank"
                  href="https://www.linkedin.com/in/joshkotrous"
                >
                  <FaLinkedin />
                </Link>
                <Link target="_blank" href="https://www.github.com/joshkotrous">
                  <IoLogoGithub />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* <HeroBanner /> */}
      </main>
    </div>
  );
}
