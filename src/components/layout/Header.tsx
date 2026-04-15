import { auth } from "@clerk/nextjs/server";
import { UserButton, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export async function Header() {
  const { userId } = await auth();

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 sticky top-0">
      <div className="flex items-center gap-2">
        <button className="p-1 rounded-full bg-black/40 text-muted-foreground hover:text-foreground transition">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button className="p-1 rounded-full bg-black/40 text-muted-foreground hover:text-foreground transition">
          <ChevronRight className="w-5 h-5" />
        </button>
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
          <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
        )}
      </div>
    </header>
  );
}
