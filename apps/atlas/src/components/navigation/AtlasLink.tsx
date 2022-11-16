'use client';

import { IconButton } from '@bibliotheca-dao/ui-lib';
import Globe from '@bibliotheca-dao/ui-lib/icons/globe.svg';
import Link from 'next/link';

export const AtlasLink = () => {
  return (
    <div className="absolute z-20 bottom-0 mx-auto left-0 right-0 flex justify-center">
      <Link href="/">
        <IconButton
          className={`mx-auto left-0 right-0 border bg-black  border-l-2 border-transparent w-10 h-6 lg:w-10 lg:h-8 hover:bg-cta-100 shadow-2xl rounded-t-lg hover:shadow-purple-500 transition-all duration-450 transform hover:-translate-y-1 hover:border-yellow-200/40 hover:fill-yellow-600 hover:bg-cta-100 hover:bg-gradient-to-r hover:from-orange-500 background-animate slow transition-all shimmer paper`}
          aria-label="Atlas"
          variant="unstyled"
          texture={false}
          icon={<Globe className="lg:w-4 mx-auto w-3 fill-gray-300" />}
          size="md"
        />
      </Link>
    </div>
  );
};
