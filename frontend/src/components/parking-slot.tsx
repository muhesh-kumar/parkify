import { ReactElement, FC } from 'react';
import cn from '../utils/classnames';

type ParkingSlotProps = {
  isAvailable?: boolean;
};

const ParkingSlot: FC<ParkingSlotProps> = ({ isAvailable = false }) => {
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
