import { NUM_PARKING_SLOTS } from '@constants/index';

export const getPercentageOfAvailableSlots = (
  availableSlots: number
): number => {
  return Number(availableSlots / NUM_PARKING_SLOTS) * 100;
};

export const getIntegralPartFromPercentage = (percentage: number): number => {
  return parseInt(String(Math.floor(Number(percentage))), 10);
};

export const getFractionalPartFromPercentage = (percentage: number): number => {
  return parseInt(
    (
      (Number(percentage) - getIntegralPartFromPercentage(percentage)) *
      10
    ).toFixed(1),
    10
  );
};
