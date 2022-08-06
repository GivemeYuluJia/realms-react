import {
  Card,
  CardTitle,
  CardStats,
  CardBody,
  Button,
} from '@bibliotheca-dao/ui-lib/base';
import Image from 'next/image';
import React from 'react';
import { RealmResources } from '@/components/tables/RealmResources';
import type { GetRealmQuery } from '@/generated/graphql';
import { TraitTable } from '@/shared/Getters/Realm';
import type {
  BuildingDetail,
  RealmFoodDetails,
  BuildingFootprint,
  AvailableResources,
} from '@/types/index';

type Prop = {
  realm?: GetRealmQuery;
  buildingUtilisation: BuildingFootprint | undefined;
  buildings: BuildingDetail[] | undefined;
  realmFoodDetails: RealmFoodDetails;
  availableFood: number | undefined;
  availableResources: AvailableResources;
};

const Survey: React.FC<Prop> = (props) => {
  const getTrait = (realm: any, trait: string) => {
    return realm?.traits?.find((o) => o.type === trait)
      ? realm.traits?.find((o) => o.type === trait).qty
      : '0';
  };
  const getPopulation = () => {
    return realm?.buildings
      ?.map((a) => a.population)
      .reduce((prev, curr) => prev + curr, 0);
  };

  const getCulture = () => {
    return realm?.buildings
      ?.map((a) => a.culture)
      .reduce((prev, curr) => prev + curr, 0);
  };

  const realm = props.realm?.realm;
  return (
    <>
      <div className="grid grid-flow-col grid-cols-6 gap-6 py-4">
        <Card className="col-start-1 col-end-2 ">
          <CardTitle>Vulnerable in</CardTitle>
          <CardStats className="text-4xl">100</CardStats>
        </Card>
        <Card className="col-start-2 col-end-3 ">
          <CardTitle>Population</CardTitle>
          <CardStats className="text-4xl">{getPopulation()}</CardStats>
        </Card>
        <Card className="col-start-3 col-end-4 ">
          <CardTitle>Food in Storehouse</CardTitle>
          <CardStats className="text-4xl">{props.availableFood}</CardStats>
        </Card>
        <Card className="col-start-4 col-end-6 ">
          <CardTitle>Building usage</CardTitle>
          <CardStats className="text-4xl">
            {props.buildingUtilisation.currentSqm}sqm /{' '}
            {props.buildingUtilisation.maxSqm}sqm
          </CardStats>
        </Card>
        <Card className="col-start-6 col-end-13 row-span-2">
          <CardTitle>{realm?.name} history</CardTitle>
          <CardBody className="text-2xl">
            Loot is a collaborative media project that aims to create a
            decentralized, infinitely-expansive sci-fantasy universe, rich with
            stories, games and multi-media. The Lootverse is a collection of NFT
            projects, games, art, stories and multimedia backed by an active
            community of players, builders, artists, writers and creators.
          </CardBody>
          <div className="pt-4 mt-auto">
            <Button variant="outline">write an entry</Button>
          </div>
        </Card>
        <Card className="col-start-1 col-end-4 ">
          {' '}
          <Image
            src={`https://d23fdhqc1jb9no.cloudfront.net/renders_webp/${realm?.realmId}.webp`}
            alt="map"
            className="w-full -scale-x-100"
            width={500}
            height={320}
            layout={'responsive'}
          />
        </Card>
        <Card className="col-start-4 col-end-6 ">
          <CardTitle>Resources</CardTitle>
          <CardBody>
            {realm && (
              <RealmResources
                availableResources={props.availableResources}
                realm={realm}
                loading={false}
              />
            )}
          </CardBody>
        </Card>
        <Card className="col-start-1 col-end-3 ">
          <CardTitle>Traits</CardTitle>
          <CardBody>
            <div className="w-full my-1 ">
              <TraitTable
                trait="Region"
                traitAmount={getTrait(realm, 'Region')}
              />
            </div>
            <div className="w-full my-1 ">
              <TraitTable trait="City" traitAmount={getTrait(realm, 'City')} />
            </div>
            <div className="w-full my-1 ">
              <TraitTable
                trait="Harbor"
                traitAmount={getTrait(realm, 'Harbor')}
              />
            </div>
            <div className="w-full my-1 ">
              <TraitTable
                trait="River"
                traitAmount={getTrait(realm, 'River')}
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default Survey;
