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
    <div data-vid="tnydvjx" className="flex items-start justify-between gap-4 border-b border-border py-3 last:border-b-0">
      <dt data-vid="05pvfxz" className="type-meta text-text-muted">{label}</dt>
      <dd data-vid="baxqngx" className="type-meta min-w-0 text-right font-mono tabular-nums break-words">{children}</dd>
    </div>
  );
}

function Link({ href, children }) {
  if (!href) return "—";
  return (
    <a data-vid="i2vqz3a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-sans text-primary underline-offset-2 hover:underline"
    >
      {children}
      <ExternalLink data-vid="h3sarn8" className="size-3.5" aria-hidden="true" />
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
    <Sheet data-vid="by4qoqh" open={crypto !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent data-vid="4iii4eg" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader data-vid="nq3m2qz">
          <div data-vid="pdytdnc" className="flex items-center gap-3">
            {info?.logo ? <img data-vid="kbwprxd" src={info.logo} alt="" className="size-8 rounded-full" /> : null}
            <div data-vid="schq2s7" className="min-w-0">
              <SheetTitle data-vid="u6qw8s7" className="type-section-title truncate">{crypto?.name ?? ""}</SheetTitle>
              <SheetDescription data-vid="3vk4hqw" className="type-mono-id">{crypto?.symbol ?? ""}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {crypto ? (
          <div data-vid="xe0g0s5" className="flex flex-col gap-4 px-4 pb-6">
            <div data-vid="rsg131f" className="flex items-baseline justify-between gap-3">
              <Money data-vid="a2jbvwq" value={crypto.currentPrice} className="type-section-title" />
              <Change data-vid="zjwba1l" value={crypto.dayChange ?? null} />
            </div>

            {state.status === "loading" ? (
              <p data-vid="c9k7oan" role="status" className="type-meta text-text-muted">{t("crypto.detailLoading", "Loading details…")}</p>
            ) : null}

            {state.status === "error" ? (
              <div data-vid="ef9pxeq" role="alert" className="flex flex-col items-start gap-3 rounded-card border border-border p-4">
                <p data-vid="mkyo1km" className="type-meta">{t("crypto.detailError", "We couldn't load the details for this cryptocurrency.")}</p>
                <Button data-vid="o61o5pk" variant="outline" size="sm" onClick={() => setAttempt((n) => n + 1)}>
                  <RefreshCw data-vid="7680ec9" className="size-4" aria-hidden="true" />
                  {t("crypto.detailRetry", "Try again")}
                </Button>
              </div>
            ) : null}

            {state.status === "ready" && info ? (
              <dl data-vid="e96dve7">
                <Row data-vid="hc07ry2" label={t("crypto.detailRank", "Rank")}>{info.rank == null ? "—" : `#${info.rank}`}</Row>
                <Row data-vid="budsqoq" label={t("crypto.detailAth", "All-time high")}>
                  {info.ath == null ? "—" : <Money data-vid="zr8j9yc" value={info.ath} />}
                </Row>
                <Row data-vid="kx88b5f" label={t("crypto.detailAthDate", "All-time high date")}>{info.athDate ? formatDate(info.athDate) : "—"}</Row>
                <Row data-vid="ckwwiki" label={t("crypto.detailFirstPrice", "First price")}>
                  {info.firstPrice == null ? "—" : <Money data-vid="qkhq355" value={info.firstPrice} />}
                </Row>
                <Row data-vid="4gwtwbj" label={t("crypto.detailFirstDate", "First listed")}>{info.firstPriceDate ? formatDate(info.firstPriceDate) : "—"}</Row>
                <Row data-vid="a2nj99c" label={t("crypto.detailCirculating", "Circulating supply")}>{count(info.circulatingSupply)}</Row>
                <Row data-vid="mt9gt7c" label={t("crypto.detailTotal", "Total supply")}>{count(info.totalSupply)}</Row>
                <Row data-vid="2njlvxg" label={t("crypto.detailMax", "Max supply")}>{count(info.maxSupply)}</Row>
                <Row data-vid="irc4r2z" label={t("crypto.detailPlatform", "Platform")}>{info.platform ?? "—"}</Row>
                <Row data-vid="ebp2vhi" label={t("crypto.detailWebsite", "Website")}>
                  <Link data-vid="8tk2djm" href={info.website}>{t("crypto.detailVisit", "Visit")}</Link>
                </Row>
                <Row data-vid="1ysoy9s" label={t("crypto.detailExplorer", "Explorer")}>
                  <Link data-vid="yyjbe7z" href={info.explorer}>{t("crypto.detailVisit", "Visit")}</Link>
                </Row>
                <Row data-vid="dralhqa" label={t("crypto.detailTwitter", "Twitter")}>{info.twitter ?? "—"}</Row>
              </dl>
            ) : null}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
