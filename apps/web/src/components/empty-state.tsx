import { ReactNode } from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;

  href?: string;
  buttonText?: string;

  icon?: LucideIcon;
  buttonIcon?: ReactNode;
}

export function EmptyState({
  title,
  description,
  href,
  buttonText,
  icon: Icon,
  buttonIcon,
}: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4 text-center">
      {Icon && (
        <div className="bg-muted mb-6 flex h-20 w-20 items-center justify-center rounded-full">
          <Icon className="text-muted-foreground h-10 w-10" />
        </div>
      )}

      <h2 className="text-2xl font-semibold">{title}</h2>

      <p className="text-muted-foreground mt-2 max-w-md">{description}</p>

      {href && buttonText && (
        <Button asChild size="lg" className="mt-6">
          <Link href={href}>
            {buttonText}
            {buttonIcon}
          </Link>
        </Button>
      )}
    </div>
  );
}
