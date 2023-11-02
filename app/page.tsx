import { Card, Title, Text } from '@tremor/react';
import { queryBuilder } from '../lib/planetscale';
import Search from './search';
import UsersTable from './table';
import UploadReceipts from './UploadReceipts';

export const dynamic = 'force-dynamic';

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  const search = searchParams.q ?? '';
  const users = await queryBuilder
    .selectFrom('users')
    .select(['id', 'name', 'username', 'email'])
    .where('name', 'like', `%${search}%`)
    .execute();

    return (
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <UploadReceipts />
        <Title>Your past receipts</Title>
        <Text>
          Click to view your past receipts in detail.
        </Text>
        <Search />
        <Card className="mt-6">
          <UsersTable users={users} />
        </Card>
      </main>
    );

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Your past receipts</Title>
      <Text>
        Click to view your past receipts in detail.
      </Text>
      <Search />
      <Card className="mt-6">
        <UsersTable users={users} />
      </Card>
    </main>
  );
}