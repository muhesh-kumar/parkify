import { atom } from 'jotai';

export const selectedNavOptionAtom = atom('parking-slots-availability');

const availableSlots = new Set();

export const availableSlotsAtom = atom(availableSlots);
