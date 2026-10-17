import type { ReactNode } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Money, Change } from "@/presentation/components/domain/value-format";

// Mock data: five of the best-known cryptocurrencies, with the same stats the Crypto table stores.
const MOCK_CRYPTOS = [
  { id: "m-btc", name: "Bitcoin", symbol: "BTC", currentPrice: 84250, dayChange: 2.4, percentChange1h: 0.3, percentChange7d: 5.1, marketCap: 1670000000000 },
  { id: "m-eth", name: "Ethereum", symbol: "ETH", currentPrice: 3120, dayChange: 1.8, percentChange1h: -0.1, percentChange7d: 3.7, marketCap: 375000000000 },
  { id: "m-usdt", name: "Tether", symbol: "USDT", currentPrice: 1.0, dayChange: 0.01, percentChange1h: 0.0, percentChange7d: -0.02, marketCap: 120000000000 },
  { id: "m-bnb", name: "BNB", symbol: "BNB", currentPrice: 598, dayChange: -0.9, percentChange1h: 0.2, percentChange7d: 1.4, marketCap: 87000000000 },
  { id: "m-sol", name: "Solana", symbol: "SOL", currentPrice: 162, dayChange: 4.2, percentChange1h: 0.8, percentChange7d: 9.3, marketCap: 76000000000 },
];

function Stat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div data-vid="ih4gbp8" className="flex items-center justify-between gap-3 text-sm">
      <span data-vid="pk4kx00" className="text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

export function CryptoCarousel() {
  return (
    <section data-vid="l5u73q6" className="px-(--container-padding) py-(--section-gap)">
      <div data-vid="xjv96yc" className="mx-auto flex max-w-(--content-max) flex-col gap-(--component-gap)">
        <h2 data-vid="selquih" className="text-2xl font-semibold text-foreground">Most popular cryptocurrencies</h2>
        <Carousel data-vid="ehpg96s" opts={{ align: "start", loop: true }} className="w-full px-12">
          <CarouselContent data-vid="bwj5yrd">
            {MOCK_CRYPTOS.map((c) => (
              <CarouselItem data-vid="dps1jz4" key={c.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
                <div data-vid="c7qao3h" className="flex h-full flex-col gap-3 rounded-lg border border-border bg-card p-5">
                  <div data-vid="puvgswv">
                    <p data-vid="ui151g1" className="font-semibold text-foreground">{c.name}</p>
                    <p data-vid="59d6oe5" className="font-mono text-xs text-muted-foreground">{c.symbol}</p>
                  </div>
                  <Money data-vid="7f6hq5t" value={c.currentPrice} />
                  <Stat data-vid="o50pv3h" label="1h"><Change data-vid="h0xm3py" value={c.percentChange1h} /></Stat>
                  <Stat data-vid="8lypb7q" label="24h"><Change data-vid="gynmjcr" value={c.dayChange} /></Stat>
                  <Stat data-vid="r9jlfqb" label="7d"><Change data-vid="v3erujq" value={c.percentChange7d} /></Stat>
                  <Stat data-vid="shnoadq" label="Market cap"><Money data-vid="kohbc1m" value={c.marketCap} compact className="text-sm" /></Stat>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious data-vid="p6fxfsm" />
          <CarouselNext data-vid="cz3007g" />
        </Carousel>
      </div>
    </section>
  );
}
