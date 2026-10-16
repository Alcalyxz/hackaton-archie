// @ts-check
import { useEffect, useState } from "react";
import { ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Money, Change } from "@/presentation/components/domain/value-format";
import { formatDate } from "@/lib/format";
import { useTranslation } from "react-i18next";

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-3 last:border-b-0">
      <dt className="type-meta text-text-muted">{label}</dt>
      <dd className="type-meta min-w-0 text-right font-mono tabular-nums break-words">{children}</dd>
    </div>
  );
}

function Link({ href, children }) {
  if (!href) return "—";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-sans text-primary underline-offset-2 hover:underline"
    >
      {children}
      <ExternalLink className="size-3.5" aria-hidden="true" />
    </a>
  );
}

const count = (n) => (n == null ? "—" : new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n));

/**
 * Side panel with the provider's detail of one cryptocurrency.
 * @param {{ crypto: any | null, onClose: () => void, loadCoinDetail: (assetId: string) => Promise<any> }} props
 */
export function CryptoDetailSheet({ crypto, onClose, loadCoinDetail }) {
  const { t } = useTranslation();
  const [state, setState] = useState({ status: "idle", info: null });
  const [attempt, setAttempt] = useState(0);
  const assetId = crypto?.id ?? null;

  useEffect(() => {
    if (assetId === null) return undefined;
    let live = true;
    setState({ status: "loading", info: null });
    loadCoinDetail(assetId)
      .then((res) => {
        if (!live) return;
        setState(res.ok ? { status: "ready", info: res.data } : { status: "error", info: null });
      })
      .catch(() => {
        if (live) setState({ status: "error", info: null });
      });
    return () => {
      live = false;
    };
  }, [assetId, attempt, loadCoinDetail]);

  const info = state.info;

  return (
    <Sheet open={crypto !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center gap-3">
            {info?.logo ? <img src={info.logo} alt="" className="size-8 rounded-full" /> : null}
            <div className="min-w-0">
              <SheetTitle className="type-section-title truncate">{crypto?.name ?? ""}</SheetTitle>
              <SheetDescription className="type-mono-id">{crypto?.symbol ?? ""}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {crypto ? (
          <div className="flex flex-col gap-4 px-4 pb-6">
            <div className="flex items-baseline justify-between gap-3">
              <Money value={crypto.currentPrice} className="type-section-title" />
              <Change value={crypto.dayChange ?? null} />
            </div>

            {state.status === "loading" ? (
              <p role="status" className="type-meta text-text-muted">{t("crypto.detailLoading", "Loading details…")}</p>
            ) : null}

            {state.status === "error" ? (
              <div role="alert" className="flex flex-col items-start gap-3 rounded-card border border-border p-4">
                <p className="type-meta">{t("crypto.detailError", "We couldn't load the details for this cryptocurrency.")}</p>
                <Button variant="outline" size="sm" onClick={() => setAttempt((n) => n + 1)}>
                  <RefreshCw className="size-4" aria-hidden="true" />
                  {t("crypto.detailRetry", "Try again")}
                </Button>
              </div>
            ) : null}

            {state.status === "ready" && info ? (
              <dl>
                <Row label={t("crypto.detailRank", "Rank")}>{info.rank == null ? "—" : `#${info.rank}`}</Row>
                <Row label={t("crypto.detailAth", "All-time high")}>
                  {info.ath == null ? "—" : <Money value={info.ath} />}
                </Row>
                <Row label={t("crypto.detailAthDate", "All-time high date")}>{info.athDate ? formatDate(info.athDate) : "—"}</Row>
                <Row label={t("crypto.detailFirstPrice", "First price")}>
                  {info.firstPrice == null ? "—" : <Money value={info.firstPrice} />}
                </Row>
                <Row label={t("crypto.detailFirstDate", "First listed")}>{info.firstPriceDate ? formatDate(info.firstPriceDate) : "—"}</Row>
                <Row label={t("crypto.detailCirculating", "Circulating supply")}>{count(info.circulatingSupply)}</Row>
                <Row label={t("crypto.detailTotal", "Total supply")}>{count(info.totalSupply)}</Row>
                <Row label={t("crypto.detailMax", "Max supply")}>{count(info.maxSupply)}</Row>
                <Row label={t("crypto.detailPlatform", "Platform")}>{info.platform ?? "—"}</Row>
                <Row label={t("crypto.detailWebsite", "Website")}>
                  <Link href={info.website}>{t("crypto.detailVisit", "Visit")}</Link>
                </Row>
                <Row label={t("crypto.detailExplorer", "Explorer")}>
                  <Link href={info.explorer}>{t("crypto.detailVisit", "Visit")}</Link>
                </Row>
                <Row label={t("crypto.detailTwitter", "Twitter")}>{info.twitter ?? "—"}</Row>
              </dl>
            ) : null}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
