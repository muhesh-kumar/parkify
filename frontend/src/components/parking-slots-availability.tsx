import React from 'react';
import SectionLayout from './section-layout';
import ParkingSlot from './parking-slot';
import AvailabilityStatus from './availability-status';

const ParkingSlotsAvailability = () => {
  const row1 = [],
    row2 = [];
  let len = 10,
    currId = 1;
  for (let i = 0; i < len; i++) {
    row1.push(<ParkingSlot id={currId++} />);
    if (i < len - 1) row2.push(<ParkingSlot id={currId++} />);
  }
  const row1Container = (
    <div className="flex justify-between">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">{row1}</div>
        <div className="flex gap-2">{row2}</div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">{row1}</div>
        <div className="ml-auto flex gap-2">{row2}</div>
      </div>
    </div>
  );

  const row21 = [],
    row22 = [];
  for (let i = 0; i < len; i++) {
    row21.push(<ParkingSlot id={currId++} />);
    if (i < len - 1) row22.push(<ParkingSlot id={currId++} />);
  }
  const row2Container = (
    <div className="flex justify-between">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">{row21}</div>
        <div className="flex gap-2">{row22}</div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">{row21}</div>
        <div className="ml-auto flex gap-2">{row22}</div>
      </div>
    </div>
  );

  const midRow1 = [];
  const midRow2 = [];
  const midRow3 = [];
  for (let i = 0; i < len - 2; i++) {
    if (i < len - 5) midRow1.push(<ParkingSlot id={currId++} />);
    midRow2.push(<ParkingSlot id={currId++} />);
    midRow3.push(<ParkingSlot id={currId++} />);
  }
  const midRowContainer = (
    <div className="flex justify-between">
      <div className="flex flex-col gap-4 items-center">
        <div className="flex gap-2">{midRow1}</div>
        <div className="flex gap-2">{midRow2}</div>
        <div className="flex gap-2">{midRow3}</div>
      </div>
      <div className="flex flex-col gap-4 items-center">
        <div className="flex gap-2">{midRow1}</div>
        <div className="flex gap-2">{midRow2}</div>
        <div className="flex gap-2">{midRow3}</div>
      </div>
    </div>
  );

  const bottomRow1 = [];
  const bottomRow2 = [];
  len = 25;
  for (let i = 0; i < len - 2; i++) {
    if (i < len - 5) bottomRow1.push(<ParkingSlot id={currId++} />);
    bottomRow2.push(<ParkingSlot id={currId++} />);
  }
  const bottomRowContainer = (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex gap-2">{bottomRow1}</div>
      <div className="flex gap-2">{bottomRow2}</div>
    </div>
  );
  console.log(currId);

  return (
    <div className="flex gap-5">
      <SectionLayout width="70%">
        <h2 className="text-md font-bold">Parking Slots Availability</h2>

        {/* Left side */}
        <div className="flex flex-col gap-20">
          {row1Container}
          {midRowContainer}
          {row2Container}
          {bottomRowContainer}
        </div>
        {/* <div className="flex gap-2">
          <ParkingSlot isAvailable />
          <ParkingSlot />
        </div> */}
      </SectionLayout>

      {/* Right side */}
      <SectionLayout width="30%">
        <AvailabilityStatus />
      </SectionLayout>
    </div>
  );
};

export default ParkingSlotsAvailability;
