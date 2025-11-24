import Image from 'next/image';
import React from 'react'

const EmptyService = () => {
  return (
    <div className="w-full h-[350px] lg:h-[360px] flex items-center justify-center">
      <div className="w-[439px] h-[206px] flex flex-col gap-[2rem] items-center justify-center">
        <Image
          alt="service"
          src={"/empty/empty-state.svg"}
          width={150}
          height={150}
          className="w-[150px] lg:h-[150px] object-cover"
        />
        <div className="flex flex-col gap-4 items-center">
          <h2 className="font-bold text-[16px] leading-[140%] text-[#171417]">
            No New Suggestions Yet
          </h2>
          <h2 className="text-[16px] leading-[140%] text-[#6B6969] text-center">
            Sellers haven’t submitted any service suggestions at the moment.
          </h2>
        </div>
      </div>
    </div>
  );
}

export default EmptyService