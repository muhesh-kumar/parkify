import { FC, ReactElement } from 'react';

import cn from '@utils/classnames';

type SectionLayoutProps = {
  children: ReactElement | ReactElement[];
  height?: string;
  width?: string;
  isCentered?: boolean;
};

const SectionLayout: FC<SectionLayoutProps> = ({
  children,
  height = '100%',
  width = '100%',
  isCentered = false,
}) => {
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
