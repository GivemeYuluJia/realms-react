import { ReactElement, useState, useEffect } from "react";
import { rarityDescription, rarityColor } from "loot-rarity";
import { LootProps } from "../../types";
import { shortenAddress } from "~/util/formatters";
import Image from "next/image";
import getGreatness from "~/services/getGreatness";

const variantMaps: any = {
  small: { heading: "lg:text-4xl", regions: "lg:text-xl" },
};

export function Loot(props: LootProps): ReactElement {
  const image = props.loot.id;
  const [metaData, setMetaData] = useState(null);
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

  useEffect(() => {
    const getMetadata = async () => {
      setMetaData(getGreatness(props.loot.id));
    };

    if (props.loot.id) {
      getMetadata();
    }
  }, [props.loot.id]);

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
          <div className=" sm:text-2xl">
            <div className="flex flex-col flex-wrap justify-between my-4 rounded sm:flex-row">
              <h2>
                Id: <span className="font-semibold ">{props.loot.id}</span>
              </h2>
              {props.loot.currentOwner && (
                <h3 className="my-3">
                  👑 {shortenAddress(props.loot.currentOwner.address)}
                </h3>
              )}
              {props.flyto && (
                <div className="self-center text-lg">
                  <button
                    className={
                      "bg-white/20 rounded px-4 uppercase hover:bg-white/40"
                    }
                    onClick={() => {
                      if (props.onClick) props.onClick(props.loot.id, "C");
                    }}
                  >
                    fly to
                  </button>
                </div>
              )}
            </div>
            <table className="min-w-full p-6 rounded table-auto bg-black/70">
              <thead>
                <tr>
                  <th className="p-4 pl-6 text-left uppercase">Item</th>
                  <th className="p-4 uppercase">Greatness</th>
                </tr>
              </thead>
              <tbody>
                {mappedProperties.map((item, index) => (
                  <tr key={index}>
                    <td className="pb-5 pl-6">
                      <p className="text-xs sm:text-lg font-medium tracking-wider text-left  uppercase ">
                        <span className="dark:text-gray-400 text-gray-400">
                          {item}{" "}
                        </span>
                        <span
                          className={
                            "px-2 py-1 rounded bg-[" +
                            rarityColor((props.loot as any)[item]) +
                            "]"
                          }
                        >
                          {rarityDescription((props.loot as any)[item])}
                        </span>{" "}
                      </p>
                      <p
                        className={
                          "mt-1 font-semibold text-[" +
                          rarityColor((props.loot as any)[item]) +
                          "]"
                        }
                      >
                        {(props.loot as any)[item]}
                      </p>
                    </td>
                    <td className="text-center">
                      {metaData
                        ? (metaData as any).greatness[item.toLowerCase()]
                        : 0}
                    </td>
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
