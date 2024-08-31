import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";
const buttonVariants = cva(
  "cb-inline-flex cb-items-center cb-justify-center cb-whitespace-nowrap cb-rounded-md cb-text-sm cb-font-medium cb-ring-offset-background cb-transition-colors focus-visible:cb-outline-none focus-visible:cb-ring-2 focus-visible:cb-ring-ring focus-visible:cb-ring-offset-2 disabled:cb-pointer-events-none disabled:cb-opacity-50",
  {
    variants: {
      variant: {
        default: "!cb-bg-chatbot_primary cb-text-chatbot_primary-foreground ",
        destructive:
          "cb-bg-chatbot_destructive cb-text-chatbot_destructive-foreground hover:cb-bg-chatbot_destructive/90",
        outline:
          "cb-border cb-border-chatbot_input cb-bg-chatbot_background hover:cb-bg-chatbot_accent hover:cb-text-chatbot_accent-foreground",
        secondary:
          "cb-bg-chatbot_secondary cb-text-chatbot_secondary-foreground hover:cb-bg-chatbot_secondary/80",
        ghost:
          "hover:cb-bg-chatbot_accent hover:cb-text-chatbot_accent-foreground cb-bg-transparent",
        link: "cb-text-chatbot_primary cb-underline-offset-4 hover:cb-underline",
      },
      size: {
        default: "cb-h-10 cb-px-4 cb-py-2",
        sm: "cb-h-9 cb-rounded-md cb-px-3",
        lg: "cb-h-11 cb-rounded-md cb-px-8",
        icon: "cb-h-10 cb-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
