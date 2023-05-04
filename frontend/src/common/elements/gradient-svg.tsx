// reference: https://codesandbox.io/s/k7pb0?file=/src/App.js:561-576

const GradientSVG = () => {
  const gradientTransform = `rotate(90)`;
  return (
    <svg style={{ height: 0 }}>
      <defs>
        <linearGradient id="hello" gradientTransform={gradientTransform}>
          <stop offset="11%" stopColor=" #4A4B45" />
          <stop offset="89%" stopColor="#E9DE1D" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default GradientSVG;
