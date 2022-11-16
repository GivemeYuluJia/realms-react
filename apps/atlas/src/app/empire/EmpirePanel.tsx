'use client';

import { Tabs } from '@bibliotheca-dao/ui-lib';
import Bag from '@bibliotheca-dao/ui-lib/icons/bag.svg';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Crown from '@bibliotheca-dao/ui-lib/icons/crown.svg';
import Danger from '@bibliotheca-dao/ui-lib/icons/danger.svg';
import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';
import Sword from '@bibliotheca-dao/ui-lib/icons/loot/sword.svg';
import { useAccount } from '@starknet-react/core';
import { useState, useMemo } from 'react';
import { BasePanel } from '@/app/components/ui/BasePanel';
import { MyActions } from '@/components/panels/Account/MyActions';
import { MyArmies } from '@/components/panels/Account/MyArmies';
import { MyCrypts } from '@/components/panels/Account/MyCrypts';
import { MyGA } from '@/components/panels/Account/MyGA';
import { MyLoot } from '@/components/panels/Account/MyLoot';
import { MyRealms } from '@/components/panels/Account/MyRealms';
import { AccountOverview } from '@/components/panels/Account/Overview';
import { SettleRealmsSideBar } from '@/components/sidebars/SettleRealmsSideBar';
import { CryptProvider } from '@/context/CryptContext';
import { GaProvider } from '@/context/GaContext';
import { LootProvider } from '@/context/LootContext';
import { RealmProvider } from '@/context/RealmContext';
import { useGetRealmsQuery } from '@/generated/graphql';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
import { getAccountHex } from '@/shared/Getters/Realm';

export function EmpirePanel() {
  const { play } = useUiSounds(soundSelector.pageTurn);
  const { address } = useAccount();
  const [isSettleRealmsSideBarOpen, setIsSettleRealmsSideBarOpen] =
    useState(false);

  const filter = {
    OR: [
      { ownerL2: { equals: getAccountHex(address || '0x0') } },
      { settledOwner: { equals: getAccountHex(address || '0x0') } },
    ],
  };
  const { data: realmsData } = useGetRealmsQuery({ variables: { filter } });
  const realmIds = realmsData?.realms?.map((realm) => realm.realmId) ?? [];

  function onSettleRealmsClick() {
    console.log('clik realm');
    setIsSettleRealmsSideBarOpen(!isSettleRealmsSideBarOpen);
  }

  const [selectedTab, setSelectedTab] = useState(0);
  const tabs = useMemo(
    () => [
      {
        label: (
          <div className="flex">
            <Crown className="self-center w-6 h-6 fill-current md:mr-4" />{' '}
            <div className="hidden md:block">Empire</div>
          </div>
        ),
        component: <AccountOverview onSettleRealms={onSettleRealmsClick} />,
      },
      {
        label: (
          <div className="flex no-wrap">
            <Sword className="self-center w-6 h-6 fill-current md:mr-4" />{' '}
            <div className="hidden md:block">Quick Actions</div>
          </div>
        ),
        component: <MyActions onSettleRealms={onSettleRealmsClick} />,
      },
      {
        label: (
          <div className="flex">
            <Castle className="self-center w-6 h-6 fill-current md:mr-4" />{' '}
            <div className="hidden md:block">My Realms</div>
          </div>
        ),
        component: (
          <RealmProvider>
            <MyRealms />
          </RealmProvider>
        ),
      },
      {
        label: (
          <div className="flex no-wrap">
            <Helm className="self-center w-6 h-6 fill-current md:mr-4" />{' '}
            <div className="hidden md:block">My Armies</div>
          </div>
        ),
        component: <MyArmies />,
      },
      {
        label: (
          <div className="flex ">
            <Danger className="self-center w-6 h-6 fill-current md:mr-4" />{' '}
            <div className="hidden md:block">My Crypts</div>
          </div>
        ),
        component: <MyCrypts />,
      },
      {
        label: (
          <div className="flex no-wrap">
            <Bag className="self-center w-6 h-6 fill-current md:mr-4" />{' '}
            <div className="hidden md:block">My Loot</div>
          </div>
        ),
        component: <MyLoot />,
      },
      {
        label: (
          <div className="flex no-wrap">
            <Sword className="self-center w-6 h-6 fill-current md:mr-4" />{' '}
            <div className="hidden md:block">My GA's</div>
          </div>
        ),
        component: <MyGA />,
      },
    ],
    [selectedTab]
  );

  const pressedTab = (index) => {
    play();
    setSelectedTab(index as number);
  };

  return (
    <BasePanel className="w-5/12" open={true}>
      <Tabs
        selectedIndex={selectedTab}
        onChange={(index) => pressedTab(index as number)}
        variant="default"
      >
        <div className="w-full overflow-y-auto pt-14 sm:pt-0 border-white/20">
          <Tabs.List className="">
            {tabs.map((tab, index) => (
              <Tabs.Tab key={index}>{tab.label}</Tabs.Tab>
            ))}
          </Tabs.List>
        </div>
        <Tabs.Panels>
          {tabs.map((tab, index) => (
            <Tabs.Panel key={index}>{tab.component}</Tabs.Panel>
          ))}
        </Tabs.Panels>
      </Tabs>
      <SettleRealmsSideBar
        isOpen={isSettleRealmsSideBarOpen}
        onClose={onSettleRealmsClick}
      />
    </BasePanel>
  );
}
