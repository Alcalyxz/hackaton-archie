// @ts-check
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Money, Change, formatMoney as money } from "@/presentation/components/domain/value-format";
import { EmptyState } from "@/presentation/components/domain/empty-state";
import { CryptoCard } from "@/presentation/components/domain/crypto-card";
import { Search, LayoutGrid, List, Coins, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 20;

/** Cryptocurrency directory: cards/table switch, search and pages of 20, highest price first.
 *  @param {{ Crypto: ReadonlyArray<any>, onOpen: (assetId: string) => void, onRefresh: () => void, refreshing: boolean }} props */
export function CryptoDirectory({ Crypto, onOpen, onRefresh, refreshing }) {
  const open = (c) => onOpen(c.id);
  const { t } = useTranslation();
  const [mode, setMode] = useState("cards");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...Crypto]
      .filter((c) => !q || c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q))
      .sort((a, b) => b.currentPrice - a.currentPrice);
  }, [Crypto, query]);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const visible = rows.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);
  const from = rows.length === 0 ? 0 : safePage * PAGE_SIZE + 1;
  const to = Math.min(rows.length, (safePage + 1) * PAGE_SIZE);

  const clear = () => { setQuery(""); setPage(0); };

  return (
    <div className="flex flex-col gap-(--section-gap)">
      <header className="flex flex-wrap items-center justify-between gap-(--component-gap)">
        <div className="min-w-0">
          <h1 className="type-page-title">{t("crypto.directoryTitle", "Crypto")}</h1>
          <p className="type-meta text-text-muted tabular-nums">
            {t("crypto.listCount", "{{count}} cryptocurrencies, highest price first", { count: Crypto.length })}
          </p>
        </div>
        <Button variant="outline" onClick={onRefresh} disabled={refreshing} className="min-h-11 gap-2 border-border-strong">
          <RefreshCw className={refreshing ? "size-4 animate-spin" : "size-4"} aria-hidden="true" />
          {refreshing ? t("crypto.refreshing", "Refreshing…") : t("crypto.refresh", "Refresh")}
        </Button>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-(--component-gap)">
        <div className="flex min-h-11 w-full items-center gap-2 rounded-control border border-border-strong bg-background px-3 focus-within:ring-2 focus-within:ring-ring sm:w-80">
          <Search className="size-4 text-text-muted" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(0); }}
            placeholder={t("crypto.searchPlaceholder", "Search by name or symbol")}
            aria-label={t("crypto.searchLabel", "Search cryptocurrencies")}
            className="type-body min-w-0 flex-1 bg-transparent outline-none placeholder:text-text-subtle"
          />
        </div>
        <ToggleGroup
          type="single"
          variant="outline"
          value={mode}
          onValueChange={(v) => v && setMode(v)}
          aria-label={t("crypto.viewMode", "View mode")}
        >
          <ToggleGroupItem value="cards" className="min-h-11 gap-2 border-border-strong" aria-label={t("crypto.modeCards", "Cards")}>
            <LayoutGrid className="size-4" />{t("crypto.modeCards", "Cards")}
          </ToggleGroupItem>
          <ToggleGroupItem value="table" className="min-h-11 gap-2 border-border-strong" aria-label={t("crypto.modeTable", "Table")}>
            <List className="size-4" />{t("crypto.modeTable", "Table")}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {rows.length === 0 ? (
        Crypto.length === 0 ? (
          <EmptyState
            title={t("crypto.emptyTitle", "No cryptocurrencies yet")}
            description={t("crypto.emptyDescription", "Cryptocurrencies will appear here once market data is loaded.")}
            icon={<Coins />}
          />
        ) : (
          <EmptyState
            filtered
            title={t("crypto.noResults", "No cryptocurrencies match your search")}
            icon={<Search />}
            action={<Button variant="outline" onClick={clear}>{t("crypto.clearSearch", "Clear search")}</Button>}
          />
        )
      ) : mode === "cards" ? (
        <ul className="grid grid-cols-1 gap-(--component-gap) sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((c) => (
            <li key={c.id} className="min-w-0">
              <CryptoCard crypto={c} onSelect={open} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="overflow-x-auto rounded-card border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="type-eyebrow">{t("crypto.colCoin", "Coin")}</TableHead>
                <TableHead className="type-eyebrow text-right">{t("crypto.colPrice", "Price (USD)")}</TableHead>
                <TableHead className="type-eyebrow text-right">{t("crypto.colChange", "24h")}</TableHead>
                <TableHead className="type-eyebrow text-right">{t("crypto.colCap", "Market cap")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((c) => (
                <TableRow key={c.id} className="cursor-pointer" onClick={() => open(c)}>
                  <TableCell>
                    <button type="button" onClick={() => open(c)} className="flex min-w-0 flex-col text-left">
                      <span className="type-row-title truncate">{c.name}</span>
                      <span className="type-mono-id text-text-muted">{c.symbol}</span>
                    </button>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right tabular-nums">
                    <Money value={c.currentPrice} align="end" className="type-meta" />
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right tabular-nums">
                    <Change value={c.dayChange ?? null} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right font-mono tabular-nums type-meta">
                    {c.marketCap == null ? "—" : money(c.marketCap, { compact: true })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {rows.length > 0 && (
        <nav aria-label={t("crypto.pagination", "Pagination")} className="flex items-center justify-between gap-3">
          <Button variant="ghost" size="sm" onClick={() => setPage(Math.max(0, safePage - 1))} disabled={safePage === 0}>
            {t("crypto.prev", "Previous")}
          </Button>
          <span className="type-caption text-text-muted tabular-nums">
            {from}–{to} {t("crypto.of", "of")} {rows.length} · {safePage + 1}/{pageCount}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setPage(Math.min(pageCount - 1, safePage + 1))} disabled={safePage >= pageCount - 1}>
            {t("crypto.next", "Next")}
          </Button>
        </nav>
      )}
    </div>
  );
}
