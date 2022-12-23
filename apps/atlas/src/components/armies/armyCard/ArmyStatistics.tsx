import { BattalionWithImage } from '@/components/armies/squad/BattalionWithImage';
import type { Army } from '@/generated/graphql';
import { nameArray, useArmy } from '@/hooks/settling/useArmy';
import { ArmyStatisticsTable } from './ArmyStatisticsTable';

export interface ArmyAndOrder extends Army {
  orderType?: string;
}

type Prop = {
  army: ArmyAndOrder;
};

export const ArmyStatistics: React.FC<Prop> = (props) => {
  const { army } = props;
  const { battalions } = useArmy();

  const formattedArmy = (army: ArmyAndOrder) => {
    const newArray: any[] = [];
    battalions?.forEach((battalion, index) => {
      if (army && army[nameArray[index] + 'Qty'] > 0) {
        newArray.push({
          ...battalion,
          quantity: army ? army[nameArray[index] + 'Qty'] : '',
          health: army ? army[nameArray[index] + 'Health'] : '',
        });
      }
    });
    return newArray;
  };

  return (
    <div>
      <div className="grid grid-cols-8 gap-2 p-2 ">
        {formattedArmy(army).map((battalion, index) => {
          return <BattalionWithImage key={index} {...battalion} />;
        })}
      </div>

      <ArmyStatisticsTable army={army} />
    </div>
  );
};
