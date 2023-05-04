import { useAtom } from 'jotai';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import ProgressProvider from '@elements/progress-provider';
import GradientSVG from '@elements/gradient-svg';

import { availableSlotsAtom } from '@state/index';
import { NUM_PARKING_SLOTS } from '@constants/index';

const AvailabilityStatus = () => {
  const [availableSlots] = useAtom(availableSlotsAtom);

  return (
    <div className="flex flex-col items-center gap-5">
      <h1 className="font-bold text-xl">
        Availablility<span className="text-fontSelected"> Status</span>
      </h1>

      <div className="max-w-[150px] max-h-[150px] w-3/5 h-3/5">
        <GradientSVG />
        <ProgressProvider valueStart={0} valueEnd={availableSlots.size}>
          {(value: number) => (
            <CircularProgressbarWithChildren
              value={value}
              strokeWidth={3}
              styles={{
                // Customize the path, i.e. the "completed progress"
                path: {
                  // Path color
                  // FIXME: the following is not working in mobile screens
                  // stroke: `url(#hello)`,
                  stroke: '#E9DE1D',
                  height: '100%',
                  // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                  strokeLinecap: 'round',
                  // Customize transition animation
                  transition: 'stroke-dashoffset 0.5s ease 0s',
                  // Rotate the path
                  transform: 'rotate(0.25turn)',
                  transformOrigin: 'center center',
                },
                // Customize the circle behind the path, i.e. the "total progress"
                trail: {
                  // Trail color
                  stroke: '#ffffff',
                  // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                  strokeLinecap: 'round',
                  // Rotate the trail
                  transform: 'rotate(0.25turn)',
                  transformOrigin: 'center center',
                },
              }}
            >
              <h1 className="font-bold text-[30px]">{availableSlots.size}</h1>
              <h2 className="text-sm text-white/25">Out of</h2>
              <h1 className="font-bold text-xl text-white/25">
                {NUM_PARKING_SLOTS}
              </h1>
            </CircularProgressbarWithChildren>
          )}
        </ProgressProvider>
      </div>
    </div>
  );
};

export default AvailabilityStatus;
