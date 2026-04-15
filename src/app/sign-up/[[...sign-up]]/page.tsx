import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <SignUp appearance={{
        elements: {
          rootBox: "mx-auto",
          card: "bg-card border-border",
          headerTitle: "text-foreground",
          headerSubtitle: "text-muted-foreground",
          socialButtonsBlockButton: "text-foreground border-border hover:bg-secondary",
          formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
          formFieldLabel: "text-foreground",
          formFieldInput: "bg-background border-border text-foreground",
          footerActionLink: "text-primary hover:text-primary/90"
        }
      }} />
    </div>
  );
}
