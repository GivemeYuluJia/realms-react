import { Button } from '@bibliotheca-dao/ui-lib';
import Ethereum from '@bibliotheca-dao/ui-lib/icons/eth.svg';
import StarkNet from '@bibliotheca-dao/ui-lib/icons/starknet-logo.svg';
import { useStarknet } from '@starknet-react/core';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { FaqBlock } from '@/components/Faqs';

import Tourus from '@/components/Tourus';

function Hack() {
  const { account, error: starknetConnectionError } = useStarknet();

  const [content, setContent] = useState<string[]>([]);

  const time = () => {
    const END = 1664418839000;
    const NOW_IN_MS = new Date().getTime();
    const MS_UNTIL = END - NOW_IN_MS;

    return (NOW_IN_MS + MS_UNTIL).toString();
  };

  const items = [
    {
      title: 'Blockchain games are due their ‘broadband moment’',
      description:
        'Most web3 games are rubbish. Hardly fun and barely on-chain. Join our hack and help us build rich and enjoyable on-chain games. Games that push the boundaries of the new design space opened by ZK roll ups and STARK proofs.',
    },
    {
      title: 'On-chain games',
      description:
        'All state and logic exist on the blockchain. There is no central server where game information is stored. Players, developers and producers become one in a permissionless game environment. These are ‘eternal games’ that will last for the length of the blockchain itself.   Interoperability at the function level.',
    },
    {
      title: 'Realms Gaming Ecosystem',
      description:
        'For the past 9 months we have been laying the foundation for an ever expanding on-chain gaming reality.  We have two game modules for you to hack (details in the FAQs). ',
    },
    {
      title: 'Why StarkNet',
      description:
        'The EVM is a limiting factor for game design.  Fun games require rich computation.  For true on-chain realities and worlds to emerge we require a new technology, and we believe that STARKS show the greatest promise to achieve this.',
    },
  ];

  return (
    <div className="h-full bg-black">
      <div className="fixed z-0 w-screen h-screen">
        <Tourus />
      </div>
      <div className="relative z-20">
        {/* <div className="relative w-full bg-bottom bg-cover h-screen-30 bg-hero "></div> */}
        <div className="container flex flex-wrap justify-center mx-auto text-center">
          <div className="w-full p-8 sm:w-1/2 sm:py-20">
            <h4 className="font-semibold text-green-200">
              on-chain gaming Hackathon
            </h4>
            <h1>
              Build the next generation of web3 games with a $20,000 bounty
            </h1>
            <p className="mt-8 font-display sm:text-2xl">
              Hack the planet... One game at a time.
            </p>
          </div>
        </div>

        {/* <div className="container flex flex-wrap py-20 mx-auto text-center">
        <ProjectBlock />
      </div> */}

        <div className="container flex flex-wrap p-10 mx-auto sm:p-20">
          <div className="w-full sm:w-1/2">
            <div className="mb-20">
              <h4 className="mb-8 text-green-200">
                the hack: Choose your adventurer
              </h4>
              <ol className="text-3xl list-decimal list-inside sm:text-5xl font-display">
                <li>Build a module</li>
                <li>Build an adventurer</li>
                <li>Build a tool</li>
              </ol>
            </div>
            <hr />
            {items.map((a, index) => {
              return (
                <div key={index} className="my-20">
                  <h4 className="mb-8">{a.title}</h4>
                  <p className="mb-8 text-3xl sm:text-2xl font-display">
                    {a.description}
                  </p>
                </div>
              );
            })}

            <hr />
          </div>
          {/* <div className="w-full px-8 sm:w-1/2 sm:px-12">
          <div className="sticky top-10">
            <h4>
              Time left in <br /> competition submission
            </h4>
            <CountdownTimer date={time()} />
            <EntryCTA />
          </div>
        </div> */}
        </div>
        {/* <div className="flex w-full h-auto py-8 bg-green-700 shadow-inner">
          <h4 className="mx-auto tracking-widest uppercase">how to enter</h4>
        </div> */}
        {/* <div className="container justify-center mx-auto">
        <div className="self-start p-16 mx-auto sm:w-2/3">
          <ol className="space-y-4 text-xl leading-loose list-decimal list-inside sm:text-3xl font-display">
            <li>
              Connect your Argent X StarkNet Wallet <br />{' '}
              <span className="text-lg text-gray-700 sm:text-2xl">
                (create one{' '}
                <a
                  className="hover:underline"
                  href="https://chrome.google.com/webstore/detail/argent-x-starknet-wallet/dlcobpjiigpikoobohmabehhmhfoodbb"
                >
                  here
                </a>{' '}
                if you don’t have one and install the browser extension)
              </span>
            </li>
            <li>
              Complete the form <br />{' '}
              <span className="text-lg text-gray-700 sm:text-2xl">
                {account ? (
                  <a
                    target={'_blank'}
                    href={`https://docs.google.com/forms/d/e/1FAIpQLSc66txDM8Ei3w83p3kLJL30VoBS6P7Xep4cIDVACZAbLY05mg/viewform?usp=pp_url&entry.2005620554=${account}`}
                    className=" hover:underline"
                    rel="noreferrer"
                  >
                    Sign up and & build
                  </a>
                ) : (
                  <a
                    rel="noreferrer"
                    target="_blank"
                    className="hover:underline"
                    href="https://chrome.google.com/webstore/detail/argent-x-starknet-wallet/dlcobpjiigpikoobohmabehhmhfoodbb"
                  >
                    First download and install Argent
                  </a>
                )}
              </span>
            </li>
            <li>
              20k Briqs will be airdropped to your address (within 24 hours)
            </li>
            <li>
              Choose one of the{' '}
              <a className="underline" href="#wonders">
                16 Wonders
              </a>{' '}
            </li>
            <li>
              Head to{' '}
              <a
                className="hover:underline text-[#eb5600]"
                href="https://realms.briq.construction/"
              >
                briq
              </a>{' '}
            </li>
            <li>
              Build your chosen Wonder with briqs <br />
              <a
                className="text-lg text-gray-700 hover:underline sm:text-2xl"
                target={'_blank'}
                href="https://briqnft.notion.site/Help-center-4a4958337970483dbfc2c1184290b42f"
                rel="noreferrer"
              >
                (how to build guide)
              </a>{' '}
            </li>
            <li>Mint your masterpiece on briq (no fees)</li>
            <li>
              Tweet your masterpiece with the following text: <br />{' '}
              <div className="py-8">
                "I built the @lootrealms Wonder [NAME] with @briqNFT. We’re
                trailblazing the way to layer 2 #StarkNet @starkwareLTD. View it
                on @PlayOasisXYZ.”
              </div>
            </li>
            <li> View your entry on PlayOasis</li>
          </ol>
          <hr className="my-10" />
          <h3 className="my-4">Voting</h3>
          <ul>
            <li>
              Voting will be done via a quadratic snapshot vote by the Realm
              holders
            </li>
            <li>
              There will be a snapshot per 16 submissions (one from each Order)
            </li>
            <li>Voting will be open for 7 days</li>
          </ul>
          <h3 className="my-4">Conditions</h3>
          <ul>
            <li>Open to everyone</li>
            <li>Should you need more briqs send a DM to the team</li>
            <li>Unlimited entries</li>
            <li>One creator can win more than once with multiple entries</li>
          </ul>
        </div>
      </div> */}

        {/* <FaqBlock /> */}
        <hr className="mt-10" />
        {/* <FooterBlock /> */}
      </div>
    </div>
  );
}

export default Hack;
