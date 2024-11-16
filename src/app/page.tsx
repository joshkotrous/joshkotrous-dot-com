import Link from "next/link";
import Ascii from "./components/ascii";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { IoLogoGithub } from "react-icons/io";

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden pt-[4.5rem]">
      <main className="flex justify-center px-4">
        <div className="grid grid-cols-2 gap-2 w-full max-w-3xl">
          <div className="aspect-square">
            <Ascii />
          </div>

          <div className="aspect-square border-[1px] border-green-500 bg-green-950/25 flex flex-col">
            <div className="text-[8px] w-full text-center items-center flex relative py-1 px-1">
              <div className="flex gap-1">
                <div className="size-[6px] bg-green-600 rounded-full"></div>
                <div className="size-[6px] bg-green-600 rounded-full"></div>
                <div className="size-[6px] bg-green-600 rounded-full"></div>
              </div>
              <div className="absolute w-full">0.0.0</div>
            </div>

            <div className="flex-1 px-1 pb-1">
              <div className="h-full border-[1px] border-green-500 p-2">
                <div className="text-xs md:text-base flex flex-col h-full">
                  <div className="space-y-4">
                    <p>Engineering leader and hacker at heart.</p>
                    <p>
                      Currently defending the web against vulnerable code @
                      Pensar.
                    </p>
                    <div className="flex flex-col gap-2">
                      <span>Contact me:</span>
                      <div className="flex gap-2 text-xl">
                        <Link
                          target="_blank"
                          href="https://www.x.com/kotro___"
                          className="hover:text-green-500 transition-colors"
                        >
                          <FaXTwitter />
                        </Link>
                        <Link
                          target="_blank"
                          href="https://www.linkedin.com/in/joshkotrous"
                          className="hover:text-green-500 transition-colors"
                        >
                          <FaLinkedin />
                        </Link>
                        <Link
                          target="_blank"
                          href="https://www.github.com/joshkotrous"
                          className="hover:text-green-500 transition-colors"
                        >
                          <IoLogoGithub />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
