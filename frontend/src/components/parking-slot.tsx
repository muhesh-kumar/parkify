import { ReactElement, FC } from 'react';
import { useAtom } from 'jotai';

import cn from '../utils/classnames';
import { availableSlotsAtom } from '../state/';

type ParkingSlotProps = {
  id: number;
};

const ParkingSlot: FC<ParkingSlotProps> = ({ id }) => {
  const [availableSlots, setAvailableSlots] = useAtom(availableSlotsAtom);
  const isAvailable = availableSlots.has(id);
  // availableSlots.delete(17);
  // setAvailableSlots(availableSlots);
  // console.log(availableSlots, availableSlots.size);
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
