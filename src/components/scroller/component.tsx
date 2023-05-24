import React from "react";

const Button: React.FC<{ testid?: string; onClick?: () => void }> = (props) => {
  const { testid, onClick, children } = props;
  return (
    <button
      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium whitespace-nowrap rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      data-testid={testid}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

/**
 * Component that renders buttons to scroll to the top and bottom of the page
 */
export function Scroller(props: {
  onClickScrollTop: () => void;
  onClickScrollBottom: () => void;
}) {
  return (
    <div className="grid gap-3 grid-cols-2 mt-3 w-full">
      <Button
        data-testid="scroll-to-top"
        onClick={() => props.onClickScrollTop()}
      >
        Scroll To Top
      </Button>
      <Button
        data-testid="scroll-to-bottom"
        onClick={() => props.onClickScrollBottom()}
      >
        Scroll To Bottom
      </Button>
    </div>
  );
}
