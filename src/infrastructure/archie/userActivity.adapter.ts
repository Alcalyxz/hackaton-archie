// Adapter de `UserActivity` sobre la tabla `audit_events` (solo lectura: es un registro).

import type { IGraphQLModule } from '@archie/js-sdk';
import type { Page, RepoResult } from '../../domain/shared';
import type { UserActivity } from '../../domain/entities/userActivity';
import type { UserActivityQuery, UserActivityRepository } from '../../domain/ports/userActivity.repository';
import { DEFAULT_PAGE_SIZE, fromGraphQL, missingData, repoError } from './transport';

const LIST = `query Activity_List($filter: AuditEventsFilter, $orderBy: AuditEventsOrderBy, $first: Int, $skip: Int) {
  auditEvents(filter: $filter, orderBy: $orderBy, first: $first, skip: $skip) {
    count
    items { id operation tableName rowPk createdAt }
  }
}`;

interface Row {
  id: string | number;
  operation: string | null;
  tableName: string | null;
  rowPk: string | null;
  createdAt: string | null;
}

function toActivity(r: Row): UserActivity {
  return {
    id: String(r.id),
    operation: r.operation ?? '',
    tableName: r.tableName ?? '',
    ...(r.rowPk ? { rowPk: r.rowPk } : {}),
    createdAt: r.createdAt ?? '',
  };
}

function unsupported(op: string): RepoResult<never> {
  return { ok: false, error: repoError('unsupported', `UserActivity.${op}: el registro es de solo lectura.`) };
}

export class ArchieUserActivityRepository implements UserActivityRepository {
  constructor(private readonly gql: IGraphQLModule) {}

  async list(q?: UserActivityQuery): Promise<RepoResult<Page<UserActivity>>> {
    const first = q?.first ?? DEFAULT_PAGE_SIZE;
    const skip = q?.skip ?? 0;
    const filter: Record<string, unknown> = {};
    if (q?.userId !== undefined) filter.userId = { equals: q.userId };
    if (q?.filter?.tableName !== undefined) filter.tableName = { equals: q.filter.tableName };
    if (q?.filter?.operation !== undefined) filter.operation = { equals: q.filter.operation };
    const res = await this.gql.query<{ auditEvents: { items: Row[]; count: number } }>(LIST, {
      first,
      skip,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
      orderBy: { createdAt: 'DESC' },
    });
    if (res.error !== null) return { ok: false, error: fromGraphQL(res.error) };
    if (res.data === null) return missingData('UserActivity', 'list');
    const conn = res.data.auditEvents;
    const items = (conn?.items ?? []).map(toActivity);
    const total = conn?.count ?? items.length;
    return { ok: true, data: { items, total, hasMore: skip + items.length < total } };
  }

  async listAll(q?: Omit<UserActivityQuery, 'first' | 'skip'>): Promise<RepoResult<Page<UserActivity>>> {
    return this.list({ ...q, first: 100, skip: 0 });
  }

  async byId(): Promise<RepoResult<UserActivity | null>> {
    return unsupported('byId');
  }

  async create(): Promise<RepoResult<UserActivity>> {
    return unsupported('create');
  }

  async update(): Promise<RepoResult<UserActivity>> {
    return unsupported('update');
  }

  async delete(): Promise<RepoResult<void>> {
    return unsupported('delete');
  }
}
