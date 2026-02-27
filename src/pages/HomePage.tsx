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
  const bills = useMemo(() => billsRaw.map(buildBillListItem), [billsRaw]);

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
                    {bills.map((bill) => (
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

                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>
                          2
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
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
