import * as React from "react"
import { useTheme } from "@/components/theme-provider"
import { Toaster as Sonner, toast, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({
  ...props
}: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner data-vid="4iwpjb9"
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon data-vid="dj6kgo8" className="size-4" />
        ),
        info: (
          <InfoIcon data-vid="a0eyak7" className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon data-vid="bjy9zrt" className="size-4" />
        ),
        error: (
          <OctagonXIcon data-vid="lj6tgs4" className="size-4" />
        ),
        loading: (
          <Loader2Icon data-vid="l0fsc90" className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--color-popover)",
          "--normal-text": "var(--color-popover-foreground)",
          "--normal-border": "var(--color-border)",
          "--border-radius": "var(--radius)"
        } as React.CSSProperties
      }
      // On a phone the shell's bottom tab bar owns the bottom edge: toasts sit above it.
      mobileOffset={{ bottom: "calc(var(--bottom-nav-h, 0px) + 1rem)" }}
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
}

// The build mounts one Toaster at the app root; screens only call `toast`.
export { Toaster, toast }
