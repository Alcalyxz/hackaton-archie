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
    <Card data-vid="kx6p9dc" className="min-w-0 gap-1 border border-border bg-card p-(--card-padding)">
      <p data-vid="wtbgg0f" className="type-eyebrow text-text-muted">{label}</p>
      <div data-vid="tufaenz" className="type-stat font-mono tabular-nums break-words">{children}</div>
    </Card>
  );
}

function Row({ label, children }) {
  return (
    <div data-vid="qj7asc7" className="flex items-start justify-between gap-4 border-b border-border py-3 last:border-b-0">
      <dt data-vid="9zxuhvm" className="type-meta text-text-muted">{label}</dt>
      <dd data-vid="r6uzedw" className="type-meta min-w-0 text-right font-mono tabular-nums break-words">{children}</dd>
    </div>
  );
}

/** Dedicated detail page of one cryptocurrency.
 *  @param {import("@/application/view-models/crypto-detail.vm").CryptoDetailScreenViewModel} props */
export function CryptoDetailView({ detail, onBack }) {
  const { t } = useTranslation();
  return (
    <div data-vid="r9daidz" className="flex flex-col gap-(--section-gap)">
      <div data-vid="wahj2nj" className="flex flex-col gap-3">
        <div data-vid="yhy5fcz">
          <Button data-vid="t87yave" variant="ghost" size="sm" onClick={onBack} className="-ml-2 gap-2">
            <ArrowLeft data-vid="byz0rgi" className="size-4" aria-hidden="true" />
            {t("cryptoDetail.back", "Back to Crypto")}
          </Button>
        </div>
        <header data-vid="gd0nfga" className="flex flex-wrap items-end justify-between gap-(--component-gap)">
          <div data-vid="a165yna" className="min-w-0">
            <p data-vid="q9443gh" className="type-eyebrow text-text-muted">
              {detail.rank == null ? t("cryptoDetail.eyebrow", "Cryptocurrency") : `${t("cryptoDetail.rank", "Rank")} #${detail.rank}`}
            </p>
            <h1 data-vid="mf7sef5" className="type-page-title truncate">{detail.name}</h1>
            <p data-vid="z2f8h3g" className="type-mono-id font-mono text-text-muted">{detail.symbol}</p>
          </div>
          <div data-vid="krw0pqj" className="flex flex-col items-end gap-1 tabular-nums">
            <Money data-vid="i89jphv" value={detail.priceUsd} className="type-page-title" />
            <Change data-vid="tsjah08" value={detail.percentChange24h} />
          </div>
        </header>
      </div>

      <section data-vid="n1o9exe" aria-label={t("cryptoDetail.changes", "Price changes")} className="grid grid-cols-1 gap-(--component-gap) sm:grid-cols-3">
        <Stat data-vid="vbz12t0" label={t("cryptoDetail.change1h", "Change 1h")}><Change data-vid="kqnqcy9" value={detail.percentChange1h} /></Stat>
        <Stat data-vid="pnhixwf" label={t("cryptoDetail.change24h", "Change 24h")}><Change data-vid="rplmr9y" value={detail.percentChange24h} /></Stat>
        <Stat data-vid="ol5as5r" label={t("cryptoDetail.change7d", "Change 7d")}><Change data-vid="i4kgljl" value={detail.percentChange7d} /></Stat>
      </section>

      <div data-vid="72bz4fk" className="grid grid-cols-1 gap-(--component-gap) lg:grid-cols-2">
        <Card data-vid="ice7jae" className="gap-0 border border-border bg-card p-(--card-padding)">
          <h2 data-vid="apzq7z7" className="type-section-title mb-2">{t("cryptoDetail.market", "Market")}</h2>
          <dl data-vid="bdn6t87">
            <Row data-vid="2xvcpbw" label={t("cryptoDetail.priceUsd", "Price (USD)")}><Money data-vid="rnghjtx" value={detail.priceUsd} /></Row>
            <Row data-vid="7b13ukb" label={t("cryptoDetail.priceBtc", "Price (BTC)")}>{btc(detail.priceBtc)}</Row>
            <Row data-vid="sndv88f" label={t("cryptoDetail.marketCap", "Market cap")}>
              {detail.marketCapUsd == null ? "—" : formatMoney(detail.marketCapUsd, { compact: true })}
            </Row>
            <Row data-vid="6e5etf7" label={t("cryptoDetail.volume", "Volume 24h")}>
              {detail.volume24 == null ? "—" : formatMoney(detail.volume24, { compact: true })}
            </Row>
          </dl>
        </Card>
        <Card data-vid="cb2qdsy" className="gap-0 border border-border bg-card p-(--card-padding)">
          <h2 data-vid="1dnliuc" className="type-section-title mb-2">{t("cryptoDetail.supply", "Supply")}</h2>
          <dl data-vid="y3x5c3t">
            <Row data-vid="hp6wtgf" label={t("cryptoDetail.circulating", "Circulating")}>{count(detail.circulatingSupply)}</Row>
            <Row data-vid="qcbcy1z" label={t("cryptoDetail.total", "Total")}>{count(detail.totalSupply)}</Row>
            <Row data-vid="l2kz674" label={t("cryptoDetail.max", "Max")}>{count(detail.maxSupply)}</Row>
          </dl>
        </Card>
      </div>
    </div>
  );
}
