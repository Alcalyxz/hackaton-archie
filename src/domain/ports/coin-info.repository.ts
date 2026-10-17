// Market detail of one asset, served by the project's `assetDetailAssetTickerDetail` function.
// Read-only: there is nothing to write.

import type { RepoResult } from '../shared';

export interface AssetTickerDetail {
  id: string;
  symbol: string;
  name: string;
  nameId: string | null;
  rank: number | null;
  priceUsd: number | null;
  priceBtc: number | null;
  percentChange1h: number | null;
  percentChange24h: number | null;
  percentChange7d: number | null;
  marketCapUsd: number | null;
  volume24: number | null;
  circulatingSupply: number | null;
  totalSupply: number | null;
  maxSupply: number | null;
}

export interface CoinInfoRepository {
  /** Loads the detail of the asset with this id (the app's asset id). */
  byAssetId(assetId: string): Promise<RepoResult<AssetTickerDetail>>;
}
