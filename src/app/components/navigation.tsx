import Link from "next/link";
import React from "react";

const Navigation = () => {
  return (
    <div className="p-4 flex gap-4 justify-between xl:justify-center w-screen items-center fixed">
      <div className="xl:absolute xl:left-0 xl:pl-4 flex flex-col md:block">
        <span className="bloom-text">Josh Kotrous</span>
        <br className="md:hidden" />
        <span className="text-[10px] md:text-base">
          {" "}
          {
            // eslint-disable-next-line react/jsx-no-comment-textnodes
          }
          // Founding Engineer @{" "}
          <Link
            href="https://pensarai.app"
            target="_blank"
            className="hover:underline"
          >
            Pensar
          </Link>
        </span>
      </div>
      <ul className="flex gap-2">
        <Link href="/">
          <li className="hover:underline cursor-pointer bloom-interactive">
            Home
          </li>
        </Link>
        <Link href="/blog">
          <li className="hover:underline cursor-pointer bloom-interactive">
            Blog
          </li>
        </Link>
        {/* <li>Projects</li> */}
      </ul>
      {/* <div className="flex gap-2 xl:absolute right-4 text-xl">
        <Link target="_blank" href="https://www.x.com/kotro___">
          <FaXTwitter />
        </Link>
        <Link target="_blank" href="https://www.linkedin.com/in/joshkotrous">
          <FaLinkedin />
        </Link>
        <Link target="_blank" href="https://www.github.com/joshkotrous">
          <IoLogoGithub />
        </Link>
      </div> */}
    </div>
  );
};

export default Navigation;
