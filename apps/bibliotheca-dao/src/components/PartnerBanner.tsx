import Cartridge from '@bibliotheca-dao/ui-lib/icons/cartridge.svg';
import Starkware from '@bibliotheca-dao/ui-lib/icons/starkware.svg';
import Topology from '@bibliotheca-dao/ui-lib/icons/topology.svg';
import Yagi from '@bibliotheca-dao/ui-lib/icons/yagi.svg';
export const PartnerBanner = () => {
  const partners = [
    {
      icon: <Starkware className="w-48" />,
      url: 'https://starkware.co/starknet/',
    },
    {
      icon: <Cartridge className="w-48" />,
      url: 'https://starkware.co/starknet/',
    },
    {
      icon: <Yagi className="w-32" />,
      url: 'https://briq.construction',
    },
    {
      icon: <span className="text-4xl text-orange-600">Briq</span>,
      url: 'https://briq.construction',
    },
    {
      icon: <Topology className="w-48" />,
      url: 'https://briq.construction',
    },
  ];
  return (
    <div className="relative z-20 flex flex-wrap justify-center w-full h-auto p-10 text-gray-900 shadow-inner sm:p-20 sm:space-x-10 bg-off-300/40 text-off-300">
      <h4 className="absolute top-0 self-center -mt-4">We work with</h4>{' '}
      {partners.map((a, index) => {
        return (
          <div key={index} className="self-center p-4">
            {' '}
            <a href={a.url}>{a.icon}</a>{' '}
          </div>
        );
      })}
    </div>
  );
};
