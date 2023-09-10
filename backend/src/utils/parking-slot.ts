import redis from '@config/db';

export const getNextAvailableParkingSlot = async (): Promise<string | null> => {
  const members = await redis.smembers('availableSlots');
  return members.length > 0 ? members[0] : '';
};
