import logo from '@assets/logo.png';

const Logo = () => {
  return (
    <div className="flex gap-2 items-end justify-start">
      <img src={logo} className="h-7 w-7 md:h-9 md:w-9" />
      <h1 className="font-bold text-lg md:text-xl">
        Park<span className="text-fontSelected">ify</span>
      </h1>
    </div>
  );
};

export default Logo;
