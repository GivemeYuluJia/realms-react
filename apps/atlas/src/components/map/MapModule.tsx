/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@bibliotheca-dao/ui-lib';
import Ouroboros from '@bibliotheca-dao/ui-lib/icons/ouroboros.svg';

import { ScatterplotLayer, ArcLayer, IconLayer } from '@deck.gl/layers';
import DeckGL from '@deck.gl/react';
import { Popover, Transition } from '@headlessui/react';
import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Map from 'react-map-gl';

const ChatComponent = dynamic(() => import('@/components/ui/Chat'), {
  ssr: false,
});

import { useTravelTripsLayer } from '@/components/map/useTravelTripLayers';
import { resourcesToString } from '@/components/realms/RealmsGetters';
import { SearchFilter } from '@/components/ui/filters/SearchFilter';
import { Annotation } from '@/components/ui/Icons';

import { useAtlasContext } from '@/context/AtlasContext';
import { useRealmContext } from '@/context/RealmContext';
import crypts from '@/geodata/crypts.json';
/* import ga_bags from '@/geodata/ga.json';
import loot_bags from '@/geodata/loot.json'; */
import realms from '@/geodata/realms_resources.json';
import type { AssetType } from '@/hooks/useAtlasMap';

import { useLayers } from './Layers/useLayers';

export const ItemViewLevel = 5;

export function MapModule() {
  const {
    travelContext,
    mapContext: {
      navigateToAsset,
      selectedAsset,
      setViewState,
      viewState,
      setIsMapLoaded,
      isMapLoaded,
    },
  } = useAtlasContext();

  const {
    state,
    actions: { updateSearchIdFilter },
  } = useRealmContext();

  const selectedId = selectedAsset?.id ?? '0';

  const { tripsLayer } = useTravelTripsLayer();

  const { layers: iconLayers } = useLayers({ selectedId });

  const selectedResourcesFiltered = realms.features.filter((d) =>
    d.resources.find((c) =>
      state.selectedResources.includes(resourcesToString(c))
    )
  );

  const createScatterPlot = useCallback(
    (assetType: AssetType, data: any[]) =>
      new ScatterplotLayer({
        id: `${assetType}-layer`,
        data,
        stroked: true,
        filled: true,
        extruded: true,
        pickable: true,
        opacity: 1,
        visible: viewState.zoom < ItemViewLevel ? false : true,
        getPosition: (d: any) => d.xy,
        getRadius: (d: any) => (d.id === parseInt(selectedId) ? 4000 : 100),
        getElevation: 10000,
        lineWidthMinPixels: 2,
        getFillColor: [0, 0, 0, 0],
        updateTriggers: {
          getRadius: parseInt(selectedId),
          getVisible: viewState,
        },
        onClick: (info: any) => {
          navigateToAsset(info.object.id, assetType);
        },
      }),
    [selectedAsset, selectedId]
  );

  const selectedResources = new IconLayer({
    id: 'selected-resources',
    data: selectedResourcesFiltered,
    getIcon: (d) => ({
      url: 'https://cdn-icons-png.flaticon.com/512/6491/6491529.png',
      width: 128,
      height: 128,
      anchorY: 100,
    }),
    sizeScale: 5,
    getPosition: (d: any) => d.xy,
    pickable: true,
    getSize: (d) => 10,
    onHover: (info) => setHoverInfo(info),
  });

  const arcsLayer = useMemo(() => {
    return new ArcLayer({
      id: 'arc',
      data: travelContext.travelArcs,
      getSourcePosition: (d: any) => d.source,
      getTargetPosition: (d: any) => d.target,
      getSourceColor: [255, 255, 204],
      getTargetColor: [255, 255, 204],
      getWidth: 2,
    });
  }, [travelContext.travelArcs]);

  const layers = useMemo(() => {
    const assets = [
      // createScatterPlot('crypt', crypts.features),
      // createScatterPlot('realm', (realms as any).features),
      // createScatterPlot('loot', loot_bags.features),
      // createScatterPlot('ga', ga_bags.features),
    ];

    return [arcsLayer, selectedResources];
  }, [arcsLayer, createScatterPlot, selectedResources, selectedId]);

  return (
    <>
      <div className="absolute z-20 top-5 right-32">
        <SearchFilter
          placeholder="Search by Realm Id"
          onSubmit={(value) => {
            updateSearchIdFilter(parseInt(value) ? value : '');
            navigateToAsset(parseInt(value), 'realm');
          }}
          defaultValue={state.searchIdFilter + ''}
        />
      </div>
      <DeckGL
        getCursor={({ isHovering }) => {
          return isHovering ? 'pointer' : 'grabbing';
        }}
        pickingRadius={25}
        viewState={viewState}
        controller={true}
        onViewStateChange={(e) => setViewState(e.viewState)}
        layers={[...layers, tripsLayer, ...iconLayers]}
      >
        {!isMapLoaded ? (
          <div className="fixed z-50 flex flex-wrap justify-center w-screen h-screen bg-yellow-50">
            {' '}
            <h1 className="self-center text-black duration-100 animate-pulse">
              <Ouroboros className="block w-20 mx-auto fill-black" />
              loading Atlas...
            </h1>{' '}
          </div>
        ) : (
          ''
        )}

        <Map
          // projection={'globe'}
          attributionControl={false}
          onLoad={() => setIsMapLoaded(true)}
          mapStyle={process.env.NEXT_PUBLIC_MAPBOX_STYLE}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
          // renderWorldCopies={false}
        />
      </DeckGL>
      <Popover className="absolute z-30 bottom-10 right-20">
        <Popover.Button as="div">
          <Button
            size="lg"
            className="absolute bottom-0 w-12 h-12 p-0 rounded-full"
            variant="outline"
          >
            <Annotation className="inline-block w-6 h-6 mr-1" />
          </Button>
        </Popover.Button>

        <Transition
          enter="transition duration-350 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-350 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Popover.Panel
            className="absolute w-full md:w-96 -left-96 bottom-16"
            static
          >
            <ChatComponent channelName="desiege-chat" />
          </Popover.Panel>
        </Transition>
      </Popover>
    </>
  );
}
