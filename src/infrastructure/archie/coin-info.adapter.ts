// Adapter for the project's custom API `GET /api/coin/info/?id=<providerId>`.
// The provider id comes from the asset row (`externalId`); the call goes through the SDK client
// so the session credential travels with it.

import type { ArchieClient, IGraphQLModule } from '@archie/js-sdk';
import type { RepoResult } from '../../domain/shared';
import type { CoinInfo, CoinInfoRepository } from '../../domain/ports/coin-info.repository';
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

export class ArchieCoinInfoRepository implements CoinInfoRepository {
  constructor(
    private readonly gql: IGraphQLModule,
    private readonly rest: ArchieClient['rest'],
  ) {}

  async byAssetId(assetId: string): Promise<RepoResult<CoinInfo>> {
    const lookup = await this.gql.query<{ assetById: { externalId: string | null } | null }>(
      `query AssetExternalId($id: String) { assetById(id: $id) { externalId } }`,
      { id: assetId },
    );
    if (lookup.error !== null) return { ok: false, error: fromGraphQL(lookup.error) };
    if (lookup.data === null) return missingData('CoinInfo', 'byAssetId');
    const externalId = lookup.data.assetById?.externalId ?? null;
    if (externalId === null || externalId === '') {
      return {
        ok: false,
        error: repoError('not-found', 'CoinInfo.byAssetId: el activo no tiene `externalId`'),
      };
    }

    const projectId = String(import.meta.env.VITE_ARCHIE_PROJECT_ID ?? '');
    const path = `/gw/${projectId}/api/coin/info/?id=${encodeURIComponent(externalId)}`;
    // The REST module may answer the raw body or a `{ data, error }` envelope: accept both.
    let raw: unknown;
    try {
      raw = await this.rest.get<unknown>(path);
    } catch (cause: unknown) {
      return {
        ok: false,
        error: repoError('network', `CoinInfo.byAssetId: ${cause instanceof Error ? cause.message : 'fallo de red'}`),
      };
    }
    if (isRecord(raw) && !Array.isArray(raw) && 'error' in raw && raw.error) {
      return { ok: false, error: repoError('transport', 'CoinInfo.byAssetId: la API respondió con error') };
    }
    const body: unknown = isRecord(raw) && !Array.isArray(raw) && 'data' in raw ? raw.data : raw;
    const first: unknown = Array.isArray(body) ? body[0] : body;
    if (!isRecord(first)) {
      return {
        ok: false,
        error: repoError('not-found', 'CoinInfo.byAssetId: la API no devolvió datos para ese id'),
      };
    }
    return {
      ok: true,
      data: {
        externalId,
        symbol: str(first.symbol) ?? '',
        name: str(first.name) ?? '',
        nameId: str(first.nameid),
        logo: str(first.logo),
        website: str(first.website),
        twitter: str(first.twitter),
        explorer: str(first.explorer),
        rank: num(first.rank),
        ath: num(first.ath),
        athDate: str(first.ath_date),
        circulatingSupply: num(first.csupply),
        totalSupply: num(first.tsupply),
        maxSupply: num(first.msupply),
        startDate: str(first.startdate),
        platform: str(first.platform),
        firstPrice: num(first.first_price),
        firstPriceDate: str(first.first_price_date),
      },
    };
  }
}
