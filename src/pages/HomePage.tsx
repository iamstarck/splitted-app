import { ModeToggle } from "@/components/common/ModeToggle";
import { Button } from "@/components/ui/button";
import { ItemGroup } from "@/components/ui/item";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import BillListItem from "@/features/home/components/BillListItem";
import HomeMenuButton from "@/features/home/components/HomeMenuButton";
import ProfileName from "@/features/home/components/ProfileName";
import { usePagination } from "@/features/home/utils/usePagination";
import { buildBillListItem } from "@/features/new-bill/lib/bill.calculation";
import ProfileAvatar from "@/features/profile/components/ProfileAvatar";
import EmptyListPlaceholder from "@/shared/components/EmptyListPlaceholder";
import Footer from "@/shared/components/Footer";
import { useBills } from "@/stores/selectors/bill.selectors";
import { ListIcon, PlusIcon, UserIcon } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const billsRaw = useBills();
  const bills = useMemo(() => {
    return billsRaw
      .map(buildBillListItem)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [billsRaw]);

  const { page, setPage, totalPages, paginatedData } = usePagination(bills, 5);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center w-full max-w-2xl m-4 min-h-screen justify-between">
        <div className="w-full">
          <header className="flex items-start p-6 max-w-2xl justify-between w-full">
            <div>
              <h1 className="text-4xl font-bold select-none">Splitted</h1>
              <ProfileName />
            </div>

            <div className="flex items-center gap-4">
              <ProfileAvatar />
              <ModeToggle />
            </div>
          </header>

          <main className="flex flex-col justify-center items-center p-6 w-full gap-6">
            <div className="flex gap-4">
              <HomeMenuButton
                text="Profile"
                icon={<UserIcon />}
                pageRef="profile"
              />
            </div>

            <div className="flex flex-col items-center justify-center gap-6 text-center w-full">
              <Button size={"lg"} className="w-md" asChild>
                <Link to={"/new"} className="flex items-center gap-1">
                  <PlusIcon />
                  Create New Bill
                </Link>
              </Button>

              {bills.length > 0 ? (
                <div className="space-y-4 w-full px-6">
                  <ItemGroup className="space-y-4">
                    {paginatedData.map((bill) => (
                      <BillListItem
                        key={bill.id}
                        title={bill.title}
                        createdAt={bill.createdAt}
                        currency={bill.currency}
                        total={bill.total}
                        people={bill.people}
                      />
                    ))}
                  </ItemGroup>

                  {totalPages > 1 && (
                    <Pagination className="hover:cursor-pointer">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => page > 1 && setPage((p) => p - 1)}
                            className={
                              page === 1
                                ? "hover:cursor-default hover:bg-background dark:hover:bg-background dark:hover:text-foreground hover:text-foreground opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>

                        {Array.from({ length: totalPages }).map((_, i) => {
                          const pageNumber = i + 1;
                          const isNearCurrent =
                            pageNumber === 1 ||
                            pageNumber === totalPages ||
                            (pageNumber >= page - 1 && pageNumber <= page + 1);

                          if (isNearCurrent) {
                            return (
                              <PaginationItem key={pageNumber}>
                                <PaginationLink
                                  isActive={page === pageNumber}
                                  className={
                                    page === pageNumber
                                      ? "hover:cursor-default bg-accent hover:text-foreground"
                                      : ""
                                  }
                                  onClick={() => setPage(pageNumber)}
                                >
                                  {pageNumber}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }

                          if (
                            (pageNumber === page - 2 && page > 3) ||
                            (pageNumber === page + 2 && page < totalPages - 2)
                          ) {
                            return (
                              <PaginationItem key={pageNumber}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }
                        })}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              page < totalPages && setPage((p) => p + 1)
                            }
                            className={
                              page === totalPages
                                ? "hover:cursor-default hover:bg-background dark:hover:bg-background dark:hover:text-foreground hover:text-foreground opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </div>
              ) : (
                <EmptyListPlaceholder
                  icon={<ListIcon size={90} />}
                  message="No saved bill yet"
                  subMessage="Create your first bill"
                />
              )}
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
