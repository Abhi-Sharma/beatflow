import { auth } from "@clerk/nextjs/server";
import { UserButton, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { HistoryNavigation } from "@/components/layout/HistoryNavigation";
import { Suspense } from "react";

export async function Header() {
  const { userId } = await auth();

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 sticky top-0 border-b border-white/5 shadow-sm">
      <div className="flex items-center gap-2">
        <Suspense fallback={<div className="w-[72px] h-9" />}>
          <HistoryNavigation />
        </Suspense>
      </div>

      <div className="flex items-center gap-4">
        {!userId ? (
          <>
            <SignInButton mode="modal">
              <Button variant="ghost" className="font-semibold rounded-full">Sign Up</Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button className="font-semibold rounded-full px-8">Log in</Button>
            </SignInButton>
          </>
        ) : (
          <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 md:w-9 md:h-9" } }} />
        )}
      </div>
    </header>
  );
}
