import Link from "next/link";
import Ascii from "./components/ascii";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { IoLogoGithub } from "react-icons/io";

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden flex flex-col">
      <div className="pt-[4.5rem]"></div>
      <main className="flex-1 flex justify-center items-center px-2 pb-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:w-fit max-w-3xl">
          <div className="aspect-square">
            <Ascii />
          </div>

          <div className="aspect-square border-2 border-green-500 bg-green-950/25 flex flex-col">
            <div className="w-full text-center items-center flex relative py-1 px-1">
              <div className="flex gap-1">
                <div className="size-2 bg-green-600 rounded-full"></div>
                <div className="size-2 bg-green-600 rounded-full"></div>
                <div className="size-2 bg-green-600 rounded-full"></div>
              </div>
              <div className="absolute w-full text-xs">0.0.0</div>
            </div>
            <div className="pb-2 pr-2 pl-2 overflow-scroll flex-1">
              <div className="h-full border-2 border-green-500 p-2 flex-1 overflow-scroll">
                <div className="text-lg flex flex-col h-fit">
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
