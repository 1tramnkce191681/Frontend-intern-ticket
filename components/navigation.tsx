"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { LogOut, Ticket } from "lucide-react";
import Link from "next/link";

export function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard/tickets" className="flex items-center gap-2">
            <Ticket className="h-6 w-6" />
            <span className="font-semibold text-lg">Support Tickets</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {user?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logout()}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
