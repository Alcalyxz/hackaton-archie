// Adapter de `User` sobre la tabla `users` del backend (lectura, parche de perfil y avatar).
// Crear y borrar usuarios NO se hace desde la app: eso es administración de cuentas.

import type { IGraphQLModule } from '@archie/js-sdk';
import type { Page, RepoResult } from '../../domain/shared';
import type { User, UserId } from '../../domain/entities/user';
import type { UpdateUser, UserQuery, UserRepository } from '../../domain/ports/user.repository';
import { DEFAULT_PAGE_SIZE, fromGraphQL, missingData, repoError } from './transport';

const FIELDS = `id firstName lastName email phone createdAt updatedAt avatar { id downloadUrl }`;

const USER_LIST = `query Users_List($filter: UsersFilter, $orderBy: UsersOrderBy, $first: Int, $skip: Int) {
  users(filter: $filter, orderBy: $orderBy, first: $first, skip: $skip) {
    count
    items { ${FIELDS} }
  }
}`;

const USER_BY_ID = `query Users_ById($id: String) {
  usersById(id: $id) { ${FIELDS} }
}`;

const USER_UPDATE = `mutation Users_Update($id: String, $input: UsersUpdateInput!) {
  updateUsers(id: $id, input: $input) { ${FIELDS} }
}`;

interface UserRow {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  avatar: { id: string | null; downloadUrl: string | null } | null;
}

function toUser(row: UserRow): User {
  const src = row.avatar?.downloadUrl ?? null;
  return {
    id: row.id,
    firstName: row.firstName ?? '',
    ...(row.lastName ? { lastName: row.lastName } : {}),
    email: row.email ?? '',
    ...(row.phone ? { phone: row.phone } : {}),
    ...(src ? { avatar: { src } } : {}),
    createdAt: row.createdAt ?? '',
    updatedAt: row.updatedAt ?? '',
  };
}

function toFilter(f: UserQuery['filter']): Record<string, unknown> | undefined {
  if (f === undefined) return undefined;
  const out: Record<string, unknown> = {};
  if (f.id !== undefined) out.id = { equals: f.id };
  if (f.email !== undefined) out.email = { equals: f.email };
  if (f.firstName !== undefined) out.firstName = { equals: f.firstName };
  if (f.lastName !== undefined) out.lastName = { equals: f.lastName };
  if (f.phone !== undefined) out.phone = { equals: f.phone };
  return Object.keys(out).length > 0 ? out : undefined;
}

function unsupported(op: string): RepoResult<never> {
  return {
    ok: false,
    error: repoError('unsupported', `User.${op}: las cuentas se administran desde Users, no desde la app.`),
  };
}

export class ArchieUserRepository implements UserRepository {
  constructor(private readonly gql: IGraphQLModule) {}

  async list(q?: UserQuery): Promise<RepoResult<Page<User>>> {
    const first = q?.first ?? DEFAULT_PAGE_SIZE;
    const skip = q?.skip ?? 0;
    const res = await this.gql.query<{ users: { items: UserRow[]; count: number } }>(USER_LIST, {
      first,
      skip,
      filter: toFilter(q?.filter),
      orderBy: q?.sort ? { [q.sort.field]: q.sort.dir } : undefined,
    });
    if (res.error !== null) return { ok: false, error: fromGraphQL(res.error) };
    if (res.data === null) return missingData('User', 'list');
    const conn = res.data.users;
    const items = (conn?.items ?? []).map(toUser);
    const total = conn?.count ?? items.length;
    return { ok: true, data: { items, total, hasMore: skip + items.length < total } };
  }

  async listAll(q?: Omit<UserQuery, 'first' | 'skip'>): Promise<RepoResult<Page<User>>> {
    return this.list({ ...q, first: 100, skip: 0 });
  }

  async byId(id: UserId): Promise<RepoResult<User | null>> {
    const res = await this.gql.query<{ usersById: UserRow | null }>(USER_BY_ID, { id });
    if (res.error !== null) return { ok: false, error: fromGraphQL(res.error) };
    if (res.data === null) return missingData('User', 'byId');
    return { ok: true, data: res.data.usersById ? toUser(res.data.usersById) : null };
  }

  async create(): Promise<RepoResult<User>> {
    return unsupported('create');
  }

  async update(id: UserId, patch: UpdateUser): Promise<RepoResult<User>> {
    const input: Record<string, unknown> = {};
    if (patch.firstName !== undefined) input.firstName = patch.firstName;
    if (patch.lastName !== undefined) input.lastName = patch.lastName;
    if (patch.phone !== undefined) input.phone = patch.phone;
    return this.write(id, input);
  }

  async setAvatar(id: UserId, fileId: string): Promise<RepoResult<User>> {
    return this.write(id, { avatar: { connect: { id: fileId } } });
  }

  async delete(): Promise<RepoResult<void>> {
    return unsupported('delete');
  }

  private async write(id: UserId, input: Record<string, unknown>): Promise<RepoResult<User>> {
    const res = await this.gql.mutate<{ updateUsers: UserRow | null }>(USER_UPDATE, { id, input });
    if (res.error !== null) return { ok: false, error: fromGraphQL(res.error) };
    if (res.data === null || res.data.updateUsers === null) return missingData('User', 'update');
    return { ok: true, data: toUser(res.data.updateUsers) };
  }
}
