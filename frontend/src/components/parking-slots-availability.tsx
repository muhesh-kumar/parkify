import React from 'react';
import SectionLayout from './section-layout';
import ParkingSlot from './parking-slot';

const ParkingSlotsAvailability = () => {
  return (
    <SectionLayout>
      <h2 className="text-md font-bold">Parking Slots Availability</h2>
      <div className="flex gap-2">
        <ParkingSlot isAvailable />
        <ParkingSlot />
        <ParkingSlot />
        <ParkingSlot />
        <ParkingSlot />
        <ParkingSlot />
      </div>
      <div className="flex gap-2">
        <ParkingSlot isAvailable />
        <ParkingSlot />
      </div>
    </SectionLayout>
  );
};

export default ParkingSlotsAvailability;
