import Logo from '@elements/logo';
import SidebarContent from '@components/sidebar-content';

const Navbar = () => {
  return (
    <div className="h-screen bg-secondaryBackground px-5 py-10 w-[250px] flex flex-col gap-[50px]">
      <Logo />
      <SidebarContent />
    </div>
  );
};

export default Navbar;
