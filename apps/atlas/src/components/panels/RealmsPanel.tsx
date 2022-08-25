import { Button, Tabs } from '@bibliotheca-dao/ui-lib';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import { useStarknet } from '@starknet-react/core';
import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { RealmsFilter } from '@/components/filters/RealmsFilter';
import { RealmOverviews } from '@/components/tables/RealmOverviews';
import { RealmsMax } from '@/constants/index';
import { useRealmContext } from '@/context/RealmContext';
import type { RealmTraitType } from '@/generated/graphql';
import { useGetRealmsQuery } from '@/generated/graphql';
import { useAtlasContext } from '@/hooks/useAtlasContext';
import { useWalletContext } from '@/hooks/useWalletContext';
import { SearchFilter } from '../filters/SearchFilter';
import { BasePanel } from './BasePanel';

const TABS = [
  { key: 'Your', name: 'Your Realms' },
  { key: 'All', name: 'All Realms' },
  { key: 'Favourite', name: 'Favourite Realms' },
];

function useRealmsQueryVariables(
  selectedTabIndex: number,
  page: number,
  limit: number
) {
  const { account } = useWalletContext();
  const { account: starkAccount } = useStarknet();

  const { state } = useRealmContext();
  const starknetWallet = starkAccount
    ? BigNumber.from(starkAccount).toHexString()
    : '';
  return useMemo(() => {
    const resourceFilters = state.selectedResources.map((resource) => ({
      resources: { some: { resourceId: { equals: resource } } },
    }));

    const filter = {} as any;
    const orderBy = {} as any;

    if (state.searchIdFilter) {
      filter.realmId = { equals: parseInt(state.searchIdFilter) };
    } else {
      // Your realms
      if (selectedTabIndex === 0) {
        filter.OR = [
          { owner: { equals: account?.toLowerCase() } },
          { bridgedOwner: { equals: account?.toLowerCase() } },
          { ownerL2: { equals: starknetWallet } },
          { settledOwner: { equals: starknetWallet } },
        ];
      } else if (selectedTabIndex === 2) {
        filter.realmId = { in: [...state.favouriteRealms] };
      }

      if (state.hasWonderFilter) filter.wonder = { not: null };
      if (state.isSettledFilter) filter.settledOwner = { not: null };
      if (state.isRaidableFilter) {
        filter.lastVaultTime = { not: null };
        orderBy.lastVaultTime = 'asc';
      }
      if (
        state.rarityFilter.rank.min > 0 ||
        state.rarityFilter.rank.max < RealmsMax.Rank
      ) {
        filter.rarityRank = {
          gte: state.rarityFilter.rank.min,
          lte: state.rarityFilter.rank.max,
        };
      }
      if (
        state.rarityFilter.score.min > 0 ||
        state.rarityFilter.score.max < RealmsMax.Score
      ) {
        filter.rarityScore = {
          gte: state.rarityFilter.score.min,
          lte: state.rarityFilter.score.max,
        };
      }

      const traitsFilters = Object.keys(state.traitsFilter)
        // Filter 0 entries
        .filter((key: string) => state.traitsFilter[key])
        .map((key: string) => ({
          traits: {
            some: {
              type: { equals: key as RealmTraitType },
              qty: {
                gte: state.traitsFilter[key].min,
                lte: state.traitsFilter[key].max,
              },
            },
          },
        }));
      filter.orderType =
        state.selectedOrders.length > 0
          ? { in: [...state.selectedOrders] }
          : undefined;
      filter.AND = [...resourceFilters, ...traitsFilters];
    }

    return {
      filter,
      take: limit,
      orderBy,
      skip: limit * (page - 1),
    };
  }, [account, state, page, selectedTabIndex, starknetWallet]);
}

function useRealmsPanelPagination() {
  const limit = 20;
  const [page, setPage] = useState(1);
  const goBack = () => setPage(page - 1);
  const goForward = () => setPage(page + 1);

  return {
    page,
    setPage,
    limit,
    goBack,
    goForward,
  };
}

function useRealmsPanelTabs() {
  const router = useRouter();
  const selectedTabKey = (router.query['tab'] as string) ?? TABS[1].key;
  const selectedTabIndex = TABS.findIndex(
    ({ key }) => key.toLowerCase() === selectedTabKey.toLowerCase()
  );

  function onTabChange(index: number) {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        tab: TABS[index].key,
      },
    });
  }

  return {
    selectedTabIndex,
    onTabChange,
  };
}

export const RealmsPanel = () => {
  const { isDisplayLarge, selectedId, selectedPanel, openDetails } =
    useAtlasContext();
  const { state, actions } = useRealmContext();
  const pagination = useRealmsPanelPagination();

  const { selectedTabIndex, onTabChange } = useRealmsPanelTabs();

  // Reset page on filter change. UseEffect doesn't do a deep compare
  useEffect(() => {
    pagination.setPage(1);
  }, [
    state.favouriteRealms,
    state.selectedOrders,
    state.searchIdFilter,
    state.hasWonderFilter,
    state.rarityFilter.rank,
    state.rarityFilter.score,
    state.traitsFilter.City,
    state.traitsFilter.Harbor,
    state.traitsFilter.Region,
    state.traitsFilter.River,
    selectedTabIndex,
  ]);

  const isRealmPanel = selectedPanel === 'realm';

  const variables = useRealmsQueryVariables(
    selectedTabIndex,
    pagination.page,
    pagination.limit
  );

  const { data, loading, startPolling, stopPolling } = useGetRealmsQuery({
    variables,
    skip: !isRealmPanel,
  });

  useEffect(() => {
    if (loading) stopPolling();
    else startPolling(5000);

    return stopPolling;
  }, [loading, data]);

  const shouldOpenPage =
    !selectedId &&
    isDisplayLarge &&
    pagination.page === 1 &&
    (data?.realms?.length ?? 0) > 0;

  useEffect(() => {
    if (shouldOpenPage) {
      openDetails('realm', data?.realms[0].realmId + '');
    }
  }, [data, pagination.page, selectedId]);

  const showPagination = () =>
    selectedTabIndex === 1 &&
    (pagination.page > 1 || (data?.realms?.length ?? 0) === pagination.limit);

  const hasNoResults = () => !loading && (data?.realms?.length ?? 0) === 0;

  return (
    <BasePanel open={isRealmPanel} style="lg:w-12/12">
      <div className="flex flex-wrap justify-between px-3 pt-20 sm:px-6 bg-black/90">
        <h2>Loot Realms</h2>
        <div className="w-full my-1 sm:w-auto">
          <SearchFilter
            placeholder="SEARCH BY ID"
            onSubmit={(value) => {
              actions.updateSearchIdFilter(parseInt(value) ? value : '');
            }}
            defaultValue={state.searchIdFilter + ''}
          />
        </div>
      </div>
      <Tabs
        key={selectedTabIndex}
        selectedIndex={selectedTabIndex}
        onChange={onTabChange as any}
      >
        <Tabs.List>
          {TABS.map((tab) => (
            <Tabs.Tab key={tab.key} className="uppercase">
              {tab.name}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
      <div>
        <RealmsFilter isYourRealms={selectedTabIndex === 0} />

        {loading && (
          <div className="flex flex-col items-center w-20 gap-2 mx-auto my-40 animate-pulse">
            <Castle className="block w-20 fill-current" />
            <h2>Loading</h2>
          </div>
        )}
        <RealmOverviews
          key={selectedTabIndex}
          realms={data?.realms ?? []}
          isYourRealms={selectedTabIndex === 0}
        />
      </div>

      {hasNoResults() && (
        <div className="flex flex-col items-center justify-center gap-8 py-8 bg-black">
          <h2>No results... Try remove some filters</h2>
          <div className="flex gap-4">
            <Button
              className="whitespace-nowrap"
              onClick={actions.clearFilters}
            >
              Clear Filters
            </Button>
            {selectedTabIndex !== 1 && (
              <Button
                className="whitespace-nowrap"
                onClick={() => onTabChange(1)}
              >
                See All Realms
              </Button>
            )}
          </div>
        </div>
      )}

      {showPagination() && (
        <div className="flex justify-center w-full gap-2 py-8 bg-black">
          <Button
            variant="outline"
            onClick={pagination.goBack}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={pagination.goForward}
            disabled={data?.realms?.length !== pagination.limit}
          >
            Next
          </Button>
        </div>
      )}
    </BasePanel>
  );
};
