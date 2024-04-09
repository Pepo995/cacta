import { type ReactElement } from "react";

type HeaderProps = {
  button?: ReactElement;
  filter?: ReactElement;
};

const Header = ({ button, filter }: HeaderProps) => (
  <div>
    {filter}

    {button && (
      <div className="flex items-center justify-between px-4 py-4">
        {button}
      </div>
    )}
  </div>
);

export default Header;
