export const SERVER_URL =
  import.meta.env.VITE_APP_SERVER_URL || 'http://localhost:3000';

export const API_URL =
  (import.meta.env.VITE_APP_SERVER_URL
    ? `${import.meta.env.VITE_APP_SERVER_URL}/api/v1`
    : null) || 'http://localhost:3000/api/v1';

export const NUM_PARKING_SLOTS = 162;
