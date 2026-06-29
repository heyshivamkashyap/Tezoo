import { Loader2Icon } from "lucide-react";
import { Button } from "./button";

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  loadingText?: string;
  loading: boolean;
}

export function LoadingButton({
  loadingText,
  loading,
  disabled,
  children,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={loading || disabled} {...props}>
      {loading ? (
        <>
          <Loader2Icon className="animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
