import Image from "next/image";
import React from "react";

const Ascii = ({ className }: { className?: string }) => {
  return (
    <div
      className={`
        relative 
        w-full
        h-full

        ${className}
      `}
    >
      <div className="relative w-full aspect-square">
        <Image
          blurDataURL="/Asset 4.svg"
          src="/Asset 4.svg"
          alt="Glowing SVG"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
};

export default Ascii;

// before:absolute before:content-['']
// before:inset-0 before:-z-10
// before:bg-[url('/Asset%201.svg')]
// before:bg-no-repeat before:bg-contain before:bg-center
// before:blur-xl before:opacity-50
