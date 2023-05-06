import { ReactNode } from 'react';

import cn from '@utils/classnames';

type SectionLayoutProps = {
  children: ReactNode | ReactNode[];
  height?: string;
  width?: string;
  isCentered?: boolean;
};

const SectionLayout = ({
  children,
  height = '100%',
  width = '100%',
  isCentered = false,
}: SectionLayoutProps) => {
  return (
    <div
      className={cn(
        'rounded-2xl py-3 px-4 w-full bg-secondaryBackground flex flex-col gap-4',
        isCentered ? 'justify-center' : ''
      )}
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
