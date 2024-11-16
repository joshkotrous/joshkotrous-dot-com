import Image from "next/image";
import React from "react";

const Ascii = ({ className }: { className?: string }) => {
  return (
    <div
      className={`
    relative inline-block
    before:absolute before:content-[''] 
    before:inset-0 before:-z-10 
    before:bg-[url('/Asset%201.svg')] 
    before:bg-no-repeat before:bg-contain
    before:blur-xl before:opacity-50
    ${className}
  `}
    >
      <Image width={300} height={100} src="/Asset 1.svg" alt="Glowing SVG" />
    </div>
  );
};

export default Ascii;
