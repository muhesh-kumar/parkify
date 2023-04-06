import { ReactElement, FC, useEffect, useState } from 'react';
import { useAtom } from 'jotai';

import cn from '../utils/classnames';

type ParkingSlotProps = {
  id: number;
};

const ParkingSlot: FC<ParkingSlotProps> = ({ id }) => {
  // TODO: make it work later
  const isAvailable = true;
  return (
    <div
      className={cn(
        'w-5 h-7 rounded-[5px]',
        !isAvailable ? 'bg-selected' : 'bg-fontSelected'
      )}
    ></div>
  );
};

export default ParkingSlot;
