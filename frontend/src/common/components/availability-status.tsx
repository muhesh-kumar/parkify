import { useAtom } from 'jotai';

import { availableSlotsAtom } from '@state/index';
import { NUM_PARKING_SLOTS } from '@constants/index';

const AvailabilityStatus = () => {
  const [availableSlots] = useAtom(availableSlotsAtom);

  return (
    <div className="flex flex-col items-center gap-5">
      <h1 className="font-bold text-xl">
        Availablility<span className="text-fontSelected"> Status</span>
      </h1>
      <div className="flex flex-col items-center border-fontSelected border-2 rounded-full p-5">
        <h1 className="font-bold text-xl">{availableSlots.size}</h1>
        <h2 className="text-sm">Out of</h2>
        <h1 className="font-bold text-xl">{NUM_PARKING_SLOTS}</h1>
      </div>
    </div>
  );
};

export default AvailabilityStatus;
