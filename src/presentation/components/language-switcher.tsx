import { useTranslation } from "react-i18next";
import { Languages, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LANGUAGES } from "@/i18n/languages";

/** Language picker (English / Español). The choice is stored by i18next in localStorage. */
export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.resolvedLanguage ?? i18n.language;
  const active = LANGUAGES.find((l) => l.code === current) ?? LANGUAGES[0];
  const isEs = current?.startsWith("es");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label={isEs ? "Cambiar idioma" : "Change language"}
          className="h-9 shrink-0 gap-1.5 px-2"
        >
          <Languages className="size-4" aria-hidden="true" />
          <span className="text-sm font-medium uppercase">{active.code.slice(0, 2)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onSelect={() => {
              void i18n.changeLanguage(lang.code);
              document.documentElement.lang = lang.code;
            }}
            className="gap-2"
          >
            <span className="flex-1">{lang.label}</span>
            {lang.code === active.code ? <Check className="size-4" aria-hidden="true" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
