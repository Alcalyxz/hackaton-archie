// @ts-check
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Money, Change, formatMoney } from "@/presentation/components/domain/value-format";
import { useTranslation } from "react-i18next";

const count = (n) => (n == null ? "—" : new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n));
const btc = (n) => (n == null ? "—" : `${new Intl.NumberFormat("en-US", { maximumSignificantDigits: 6 }).format(n)} BTC`);

function Stat({ label, children }) {
  return (
    <Card className="min-w-0 gap-1 border border-border bg-card p-(--card-padding)">
      <p className="type-eyebrow text-text-muted">{label}</p>
      <div className="type-stat font-mono tabular-nums break-words">{children}</div>
    </Card>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-3 last:border-b-0">
      <dt className="type-meta text-text-muted">{label}</dt>
      <dd className="type-meta min-w-0 text-right font-mono tabular-nums break-words">{children}</dd>
    </div>
  );
}

/** Dedicated detail page of one cryptocurrency.
 *  @param {import("@/application/view-models/crypto-detail.vm").CryptoDetailScreenViewModel} props */
export function CryptoDetailView({ detail, onBack }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-(--section-gap)">
      <div className="flex flex-col gap-3">
        <div>
          <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2 gap-2">
            <ArrowLeft className="size-4" aria-hidden="true" />
            {t("cryptoDetail.back", "Back to Crypto")}
          </Button>
        </div>
        <header className="flex flex-wrap items-end justify-between gap-(--component-gap)">
          <div className="min-w-0">
            <p className="type-eyebrow text-text-muted">
              {detail.rank == null ? t("cryptoDetail.eyebrow", "Cryptocurrency") : `${t("cryptoDetail.rank", "Rank")} #${detail.rank}`}
            </p>
            <h1 className="type-page-title truncate">{detail.name}</h1>
            <p className="type-mono-id font-mono text-text-muted">{detail.symbol}</p>
          </div>
          <div className="flex flex-col items-end gap-1 tabular-nums">
            <Money value={detail.priceUsd} className="type-page-title" />
            <Change value={detail.percentChange24h} />
          </div>
        </header>
      </div>

      <section aria-label={t("cryptoDetail.changes", "Price changes")} className="grid grid-cols-1 gap-(--component-gap) sm:grid-cols-3">
        <Stat label={t("cryptoDetail.change1h", "Change 1h")}><Change value={detail.percentChange1h} /></Stat>
        <Stat label={t("cryptoDetail.change24h", "Change 24h")}><Change value={detail.percentChange24h} /></Stat>
        <Stat label={t("cryptoDetail.change7d", "Change 7d")}><Change value={detail.percentChange7d} /></Stat>
      </section>

      <div className="grid grid-cols-1 gap-(--component-gap) lg:grid-cols-2">
        <Card className="gap-0 border border-border bg-card p-(--card-padding)">
          <h2 className="type-section-title mb-2">{t("cryptoDetail.market", "Market")}</h2>
          <dl>
            <Row label={t("cryptoDetail.priceUsd", "Price (USD)")}><Money value={detail.priceUsd} /></Row>
            <Row label={t("cryptoDetail.priceBtc", "Price (BTC)")}>{btc(detail.priceBtc)}</Row>
            <Row label={t("cryptoDetail.marketCap", "Market cap")}>
              {detail.marketCapUsd == null ? "—" : formatMoney(detail.marketCapUsd, { compact: true })}
            </Row>
            <Row label={t("cryptoDetail.volume", "Volume 24h")}>
              {detail.volume24 == null ? "—" : formatMoney(detail.volume24, { compact: true })}
            </Row>
          </dl>
        </Card>
        <Card className="gap-0 border border-border bg-card p-(--card-padding)">
          <h2 className="type-section-title mb-2">{t("cryptoDetail.supply", "Supply")}</h2>
          <dl>
            <Row label={t("cryptoDetail.circulating", "Circulating")}>{count(detail.circulatingSupply)}</Row>
            <Row label={t("cryptoDetail.total", "Total")}>{count(detail.totalSupply)}</Row>
            <Row label={t("cryptoDetail.max", "Max")}>{count(detail.maxSupply)}</Row>
          </dl>
        </Card>
      </div>
    </div>
  );
}
