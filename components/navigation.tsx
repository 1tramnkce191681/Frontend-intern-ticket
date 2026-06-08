"use client";

import { useLogout } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, Ticket } from "lucide-react";
import Link from "next/link";

export function Navigation() {
  const logoutMutation = useLogout();

  return (
    <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/tickets" className="flex items-center gap-2">
            <Ticket className="h-6 w-6" />
            <span className="font-semibold text-lg">Support Tickets</span>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
