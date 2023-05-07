export default interface Event {
  [key: string]: {
    carImageLocation: string;
    nextAvailableParkingSlot: string;
    entryTimeStamp: string;
  }
};