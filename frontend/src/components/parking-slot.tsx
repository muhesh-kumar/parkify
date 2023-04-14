import { ReactElement, FC, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { availableSlotsAtom } from '../state/';

import cn from '../utils/classnames';

type ParkingSlotProps = {
  id: number;
};

const ParkingSlot: FC<ParkingSlotProps> = ({ id }) => {
  const [availableSlots] = useAtom(availableSlotsAtom);

  return (
    <div
      className={cn(
        'w-5 h-7 rounded-[5px]',
        !availableSlots.has(id) ? 'bg-selected' : 'bg-fontSelected'
      )}
    ></div>
  );
};

export default ParkingSlot;
