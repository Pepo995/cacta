import type { ReactNode } from "react";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";

import { Skeleton } from "../atoms/Skeleton";

type CardGridProps = {
  cards: ReactNode[] | null;
  onLoadMore?: () =>
    | Promise<void>
    | Promise<UseInfiniteQueryResult>
    | ReactNode[];
  hasMore?: boolean;
  loading?: boolean;
};

const CardsGridShimmer = () => (
  <div className="grid grid-cols-1 gap-4 p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    <Skeleton className="h-[150px] min-w-[150px] max-w-[275px]" />
    <Skeleton className="h-[150px] min-w-[150px] max-w-[275px]" />
    <Skeleton className="h-[150px] min-w-[150px] max-w-[275px]" />
    <Skeleton className="h-[150px] min-w-[150px] max-w-[275px]" />
    <Skeleton className="h-[150px] min-w-[150px] max-w-[275px]" />
    <Skeleton className="h-[150px] min-w-[150px] max-w-[275px]" />
    <Skeleton className="h-[150px] min-w-[150px] max-w-[275px]" />
    <Skeleton className="h-[150px] min-w-[150px] max-w-[275px]" />
  </div>
);

const CardsGrid = ({
  cards,
  onLoadMore = () => [],
  hasMore = false,
  loading,
}: CardGridProps) =>
  cards === null || loading ? (
    <CardsGridShimmer />
  ) : (
    <InfiniteScroll
      dataLength={cards.length}
      next={onLoadMore}
      hasMore={hasMore}
      loader={<CardsGridShimmer />}
    >
      <div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {cards}
      </div>
    </InfiniteScroll>
  );

export default CardsGrid;
