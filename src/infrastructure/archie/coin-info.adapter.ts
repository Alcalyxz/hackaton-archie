// Adapter for the project's custom function `assetDetailAssetTickerDetail(assetId)`, exposed in GraphQL.
// It goes through the SDK's GraphQL module, so the session credential travels with it.

import type { ArchieClient, IGraphQLModule } from '@archie/js-sdk';
import type { RepoResult } from '../../domain/shared';
import type { AssetTickerDetail, CoinInfoRepository } from '../../domain/ports/coin-info.repository';
import { fromGraphQL, repoError, missingData } from './transport';

function str(v: unknown): string | null {
  return typeof v === 'string' && v !== '' ? v : null;
}

function num(v: unknown): number | null {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

const FIELDS = `id csupply marketCapUsd msupply name nameId percentChange1h percentChange7d percentChange24h priceBtc priceUsd rank symbol tsupply volume24`;

export class ArchieCoinInfoRepository implements CoinInfoRepository {
  constructor(
    private readonly gql: IGraphQLModule,
    _rest?: ArchieClient['rest'],
  ) {}

  async byAssetId(assetId: string): Promise<RepoResult<AssetTickerDetail>> {
    // The id is inlined as a JSON string literal (a safe GraphQL string), so the query does not
    // depend on how the function declares its argument type.
    const res = await this.gql.query<{ assetDetailAssetTickerDetail: unknown }>(
      `query AssetTickerDetail { assetDetailAssetTickerDetail(assetId: ${JSON.stringify(assetId)}) { ${FIELDS} } }`,
    );
    if (res.error !== null) return { ok: false, error: fromGraphQL(res.error) };
    if (res.data === null) return missingData('AssetTickerDetail', 'byAssetId');
    const raw = res.data.assetDetailAssetTickerDetail;
    const row: unknown = Array.isArray(raw) ? raw[0] : raw;
    if (!isRecord(row)) {
      return { ok: false, error: repoError('not-found', 'AssetTickerDetail.byAssetId: no data for that asset') };
    }
    return {
      ok: true,
      data: {
        id: str(row.id) ?? assetId,
        symbol: str(row.symbol) ?? '',
        name: str(row.name) ?? '',
        nameId: str(row.nameId),
        rank: num(row.rank),
        priceUsd: num(row.priceUsd),
        priceBtc: num(row.priceBtc),
        percentChange1h: num(row.percentChange1h),
        percentChange24h: num(row.percentChange24h),
        percentChange7d: num(row.percentChange7d),
        marketCapUsd: num(row.marketCapUsd),
        volume24: num(row.volume24),
        circulatingSupply: num(row.csupply),
        totalSupply: num(row.tsupply),
        maxSupply: num(row.msupply),
      },
    };
  }
}
