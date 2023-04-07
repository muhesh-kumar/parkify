import { FC, ReactElement } from 'react';

type SectionLayoutProps = {
  children: ReactElement | ReactElement[];
  height?: string;
  width?: string;
};

const SectionLayout: FC<SectionLayoutProps> = ({
  children,
  height = '100%',
  width = '100%',
}) => {
  return (
    <div
      className="rounded-2xl py-3 px-4 w-full bg-secondaryBackground flex flex-col justify-center gap-4"
      style={{
        width: `${width}`,
        height: `${height}`,
      }}
    >
      {children}
    </div>
  );
};

export default SectionLayout;
