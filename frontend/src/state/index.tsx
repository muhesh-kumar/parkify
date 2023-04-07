import { atom } from 'jotai';

export const selectedNavOptionAtom = atom('parking-slots-availability');

const availableSlots = new Set();
// for (let i = 1; i < 163; i++) availableSlots.add(i);

export const availableSlotsAtom = atom(availableSlots);
