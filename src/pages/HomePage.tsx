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
import ProfileName from "@/features/home/components/ProfileName";
import { usePagination } from "@/features/home/utils/usePagination";
import { buildBillListItem } from "@/features/bill/lib/bill.calculation";
import ProfileAvatar from "@/features/profile/components/ProfileAvatar";
import EmptyListPlaceholder from "@/shared/components/EmptyListPlaceholder";
import Footer from "@/shared/components/Footer";
import HelpGuide from "@/shared/components/HelpGuide";
import { useBills } from "@/stores/selectors/bill.selectors";
import {
  CameraIcon,
  ListIcon,
  PlusIcon,
} from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import AppLogo from "@/assets/splittedLogo.svg?react";
import PageTransition from "@/shared/animations/PageTransition";
import { StaggerContainer, StaggerItem } from "@/shared/animations/StaggerAnimation";
import { motion } from "framer-motion";

const HomePage = () => {
  const billsRaw = useBills();
  const bills = useMemo(() => {
    return billsRaw
      .map(buildBillListItem)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [billsRaw]);

  const { page, setPage, totalPages, paginatedData } = usePagination(bills, 5);

  return (
    <PageTransition>
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center w-full max-w-2xl min-h-screen justify-between">
          <div className="w-full">
            <header className="flex items-start p-6 max-w-2xl justify-between w-full">
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <AppLogo className="h-14 w-auto fill-primary" />
                </motion.div>
                <ProfileName />
              </div>

              <div className="flex items-center gap-4 max-md:gap-2">
                <ProfileAvatar />
                <HelpGuide />
                <ModeToggle />
              </div>
            </header>

            <main className="flex flex-col justify-center items-center p-6 w-full gap-6">
              <motion.div
                className="grid grid-cols-2 gap-4 w-full"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <Button size={"lg"} className="w-full" asChild>
                  <Link to={"/new"} id="tour-create-bill" className="flex items-center gap-1">
                    <PlusIcon />
                    Create Bill
                  </Link>
                </Button>

                <Button size={"lg"} className="w-full" asChild>
                  <Link to={"/scan-bill"} id="tour-scan-bill" className="flex items-center gap-1">
                    <CameraIcon />
                    Scan Bill
                  </Link>
                </Button>
              </motion.div>

              <div className="flex flex-col items-center justify-center gap-6 text-center w-full">
                {bills.length > 0 ? (
                  <div className="space-y-4 w-full px-6">
                    <StaggerContainer className="space-y-4">
                      {paginatedData.map((bill) => (
                        <StaggerItem key={bill.id}>
                          <ItemGroup>
                            <BillListItem
                              bill={bill}
                              rawBill={billsRaw.find((b) => b.id === bill.id)!}
                            />
                          </ItemGroup>
                        </StaggerItem>
                      ))}
                    </StaggerContainer>

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
                    message="Zero bills here"
                    subMessage="Boss move or just freeloading?"
                  />
                )}
              </div>
            </main>
          </div>

          <Footer />
        </div>
      </div>
    </PageTransition>
  );
};

export default HomePage;
