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
    <div data-vid="q407nsz" className="flex flex-col gap-(--section-gap)">
      <header data-vid="lr0nb8p" className="flex flex-wrap items-center justify-between gap-(--component-gap)">
        <div data-vid="3v1n6vw" className="min-w-0">
          <h1 data-vid="liqwa33" className="type-page-title">{t("crypto.directoryTitle", "Crypto")}</h1>
          <p data-vid="82bwgbp" className="type-meta text-text-muted tabular-nums">
            {t("crypto.listCount", "{{count}} cryptocurrencies, highest price first", { count: Crypto.length })}
          </p>
        </div>
        <Button data-vid="rg4rrpf" variant="outline" onClick={onRefresh} disabled={refreshing} className="min-h-11 gap-2 border-border-strong">
          <RefreshCw data-vid="nva2dha" className={refreshing ? "size-4 animate-spin" : "size-4"} aria-hidden="true" />
          {refreshing ? t("crypto.refreshing", "Refreshing…") : t("crypto.refresh", "Refresh")}
        </Button>
      </header>

      <div data-vid="dney4ze" className="flex flex-wrap items-center justify-between gap-(--component-gap)">
        <div data-vid="t7sw9iw" className="flex min-h-11 w-full items-center gap-2 rounded-control border border-border-strong bg-background px-3 focus-within:ring-2 focus-within:ring-ring sm:w-80">
          <Search data-vid="jgxfezb" className="size-4 text-text-muted" />
          <input data-vid="nlufhtt"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(0); }}
            placeholder={t("crypto.searchPlaceholder", "Search by name or symbol")}
            aria-label={t("crypto.searchLabel", "Search cryptocurrencies")}
            className="type-body min-w-0 flex-1 bg-transparent outline-none placeholder:text-text-subtle"
          />
        </div>
        <ToggleGroup data-vid="i5vpms8"
          type="single"
          variant="outline"
          value={mode}
          onValueChange={(v) => v && setMode(v)}
          aria-label={t("crypto.viewMode", "View mode")}
        >
          <ToggleGroupItem data-vid="zm28baf" value="cards" className="min-h-11 gap-2 border-border-strong" aria-label={t("crypto.modeCards", "Cards")}>
            <LayoutGrid data-vid="tygnycc" className="size-4" />{t("crypto.modeCards", "Cards")}
          </ToggleGroupItem>
          <ToggleGroupItem data-vid="ru7tzqw" value="table" className="min-h-11 gap-2 border-border-strong" aria-label={t("crypto.modeTable", "Table")}>
            <List data-vid="vdfmlrl" className="size-4" />{t("crypto.modeTable", "Table")}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {rows.length === 0 ? (
        Crypto.length === 0 ? (
          <EmptyState data-vid="ygxje8y"
            title={t("crypto.emptyTitle", "No cryptocurrencies yet")}
            description={t("crypto.emptyDescription", "Cryptocurrencies will appear here once market data is loaded.")}
            icon={<Coins data-vid="q63x0fa" />}
          />
        ) : (
          <EmptyState data-vid="1weifci"
            filtered
            title={t("crypto.noResults", "No cryptocurrencies match your search")}
            icon={<Search data-vid="y0kj0we" />}
            action={<Button data-vid="3gd6vz0" variant="outline" onClick={clear}>{t("crypto.clearSearch", "Clear search")}</Button>}
          />
        )
      ) : mode === "cards" ? (
        <ul data-vid="fpbf7p6" className="grid grid-cols-1 gap-(--component-gap) sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((c) => (
            <li data-vid="4tvmofz" key={c.id} className="min-w-0">
              <CryptoCard data-vid="lbvubqs" crypto={c} onSelect={open} />
            </li>
          ))}
        </ul>
      ) : (
        <div data-vid="igaeb50" className="overflow-x-auto rounded-card border border-border bg-card">
          <Table data-vid="u6sk8gj">
            <TableHeader data-vid="4vftep1">
              <TableRow data-vid="3rxjlmd">
                <TableHead data-vid="81dvwwl" className="type-eyebrow">{t("crypto.colCoin", "Coin")}</TableHead>
                <TableHead data-vid="dtc13ov" className="type-eyebrow text-right">{t("crypto.colPrice", "Price (USD)")}</TableHead>
                <TableHead data-vid="vqbm8d4" className="type-eyebrow text-right">{t("crypto.colChange1h", "1h")}</TableHead>
                <TableHead data-vid="4a42m6w" className="type-eyebrow text-right">{t("crypto.colChange", "24h")}</TableHead>
                <TableHead data-vid="eoo6caw" className="type-eyebrow text-right">{t("crypto.colChange7d", "7d")}</TableHead>
                <TableHead data-vid="4zlg6bo" className="type-eyebrow text-right">{t("crypto.colCap", "Market cap")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody data-vid="e2duqs8">
              {visible.map((c) => (
                <TableRow data-vid="hun0gfr" key={c.id} className="cursor-pointer" onClick={() => open(c)}>
                  <TableCell data-vid="5vlbktc">
                    <button data-vid="pt3au26" type="button" onClick={() => open(c)} className="flex min-w-0 flex-col text-left">
                      <span data-vid="g7o9dzx" className="type-row-title truncate">{c.name}</span>
                      <span data-vid="jthjjdc" className="type-mono-id text-text-muted">{c.symbol}</span>
                    </button>
                  </TableCell>
                  <TableCell data-vid="tlj7vdv" className="whitespace-nowrap text-right tabular-nums">
                    <Money data-vid="l9th8qo" value={c.currentPrice} align="end" className="type-meta" />
                  </TableCell>
                  <TableCell data-vid="6abraq7" className="whitespace-nowrap text-right tabular-nums">
                    <Change data-vid="livn1y3" value={c.percentChange1h ?? null} />
                  </TableCell>
                  <TableCell data-vid="ynuaf5d" className="whitespace-nowrap text-right tabular-nums">
                    <Change data-vid="5n4b5uz" value={c.dayChange ?? null} />
                  </TableCell>
                  <TableCell data-vid="cp5f42v" className="whitespace-nowrap text-right tabular-nums">
                    <Change data-vid="yzki1ya" value={c.percentChange7d ?? null} />
                  </TableCell>
                  <TableCell data-vid="v6skt6w" className="whitespace-nowrap text-right font-mono tabular-nums type-meta">
                    {c.marketCap == null ? "—" : money(c.marketCap, { compact: true })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {rows.length > 0 && (
        <nav data-vid="b9vofau" aria-label={t("crypto.pagination", "Pagination")} className="flex items-center justify-between gap-3">
          <Button data-vid="jhojeiu" variant="ghost" size="sm" onClick={() => setPage(Math.max(0, safePage - 1))} disabled={safePage === 0}>
            {t("crypto.prev", "Previous")}
          </Button>
          <span data-vid="r5vhvpp" className="type-caption text-text-muted tabular-nums">
            {from}–{to} {t("crypto.of", "of")} {rows.length} · {safePage + 1}/{pageCount}
          </span>
          <Button data-vid="qx0y5sq" variant="ghost" size="sm" onClick={() => setPage(Math.min(pageCount - 1, safePage + 1))} disabled={safePage >= pageCount - 1}>
            {t("crypto.next", "Next")}
          </Button>
        </nav>
      )}
    </div>
  );
}
