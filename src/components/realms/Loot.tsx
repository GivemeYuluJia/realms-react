import { ReactElement } from "react";
import React from "react";
import { rarityDescription } from "loot-rarity";
import { LootProps } from "../../types";
import { shortenAddress } from "~/util/formatters";
import Image from "next/image";

const variantMaps: any = {
  small: { heading: "lg:text-4xl", regions: "lg:text-xl" },
};

export function Loot(props: LootProps): ReactElement {
  const image = props.loot.id;

  const mappedProperties = [
    "weapon",
    "chest",
    "head",
    "waist",
    "foot",
    "hand",
    "neck",
    "ring",
  ];

  return (
    <div className="z-10 w-full h-auto p-1 text-white rounded-xl sm:p-4">
      {props.loading ? (
        <div className="">
          <div className="w-full h-64 pt-20 mb-4 rounded bg-white/40 animate-pulse" />
          <div className="w-full h-32 pt-20 mb-4 rounded bg-white/40 animate-pulse" />
          <div className="w-full h-32 pt-20 rounded bg-white/40 animate-pulse" />
        </div>
      ) : (
        <div className="pt-4">
          <div className="w-full">
            <Image
              src={`data:image/svg+xml;base64,${btoa(image as string)}`}
              alt=""
              width="300"
              height="300"
              layout={"responsive"}
            />
          </div>

          <div className=" sm:text-2xl">
            {props.loot.currentOwner && (
              <h3 className="my-3">
                👑 {shortenAddress(props.loot.currentOwner.address)}
              </h3>
            )}
            <div className="flex flex-col flex-wrap justify-between my-4 rounded sm:flex-row">
              <h4>
                Id: <span className="font-semibold ">{props.loot.id}</span>
              </h4>

              {props.flyto && (
                <div className="self-center text-lg">
                  <button
                    className={
                      "bg-white/20 rounded px-4 uppercase hover:bg-white/40"
                    }
                    onClick={() => {
                      if (props.onClick) props.onClick(props.loot.id, 2);
                    }}
                  >
                    fly to
                  </button>
                </div>
              )}
            </div>
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Rarity</th>
                  <th>Greatness</th>
                </tr>
              </thead>
              <tbody>
                {mappedProperties.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <p className="pt-2 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                        {item}
                      </p>
                      <p>{props.loot[item] as string}</p>
                    </td>
                    <td>{rarityDescription(props.loot[item])}</td>
                    <td>1961</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xl"></div>
            <div className="py-4">
              <a
                className="text-xl"
                target={"_blank"}
                href={
                  "https://opensea.io/assets/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7/" +
                  props.loot.id
                }
                rel="noreferrer"
              >
                View on Opensea
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
