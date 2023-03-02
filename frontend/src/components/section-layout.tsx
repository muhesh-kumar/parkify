import { FC, ReactElement } from 'react';

type SectionLayoutProps = {
  children: ReactElement | ReactElement[];
};

const SectionLayout: FC<SectionLayoutProps> = ({ children }) => {
  return (
    <div className="rounded-2xl py-3 px-4 w-full bg-secondaryBackground flex flex-col gap-4">
      {children}
    </div>
  );
};

export default SectionLayout;
