"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Image from "next/image";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { borrowBook } from "@/lib/actions/book";

export default function BorrowBook({
  bookId,
  userId,
  borrowingEligibility,
}: {
  bookId: string;
  userId: string;
  borrowingEligibility: { isEligible: boolean; message: string };
}) {
  const router = useRouter();
  const [borrowing, setBorrowing] = useState(false);

  console.log("@@DEBUG", borrowingEligibility);
  async function handleBorrow() {
    if (!borrowingEligibility.isEligible) {
      toast({
        title: "Error",
        description: borrowingEligibility.message,
        variant: "destructive",
      });
    } else {
      setBorrowing(true);
      try {
        const result = await borrowBook({
          bookId,
          userId,
        });
        if (result?.success) {
          toast({
            title: "Success",
            description: "Book borrowed successfully",
          });
          router.push("/my-profile");
        } else {
          toast({
            title: "Error",
            description: "An error occured when borrowing the book",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occured when borrowing the book",
          variant: "destructive",
        });
      } finally {
        setBorrowing(false);
      }
    }
  }

  return (
    <Button
      className="book-overview-btn"
      onClick={handleBorrow}
      disabled={borrowing}
    >
      <Image src="/icons/book.svg" alt="book" width={20} height={20} />
      <p className="font-bebas-neue text-xl text-dark-100">
        {borrowing ? "Borrowing..." : "Borrow Book"}
      </p>
    </Button>
  );
}
