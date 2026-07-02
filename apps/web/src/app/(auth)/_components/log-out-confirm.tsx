import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useState, useTransition } from "react";
import { Button } from "../../../components/ui/button";
import { LoadingButton } from "@/components/ui/loading-btn";
import { logoutUser } from "@/services/auth/auth.service";
import { useRouter } from "next/navigation";
import { logout } from "@/features/user/user.slice";
import { useAppDispatch } from "@/lib/redux/hooks";
import { AlertCircle } from "lucide-react";

interface SignOutConfirmProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogOutConfirm({ open, onOpenChange }: SignOutConfirmProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const router = useRouter();
  const dispatch = useAppDispatch();

  function signOut() {
    startTransition(async () => {
      try {
        const res = await logoutUser();

        if (!res.data.success) {
          setError(res.data.message ?? "Logout failed");
          dispatch(logout());
          return;
        }

        router.replace("/login");
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
          <AlertDialogDescription>
            You will need to sign in again to access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <div className="border-destructive/20 bg-destructive/10 text-destructive flex items-start gap-2 rounded-md border p-3 text-sm">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </AlertDialogCancel>

          <LoadingButton
            loading={isPending}
            variant="destructive"
            className="dark:bg-red-800"
            onClick={signOut}
            // loadingText="Loading..."
          >
            Logout
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
