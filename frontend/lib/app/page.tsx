import { Card, Title, Text } from '@tremor/react';
import { createClient } from '@supabase/supabase-js';
import Search from './search';
import UsersTable from './table';
import UploadReceipts from './UploadReceipts';

// Initialize Supabase client
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

export const dynamic = 'force-dynamic';

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  const search = searchParams.q ?? '';
  const { data: users, error } = await supabase
    .from('users')
    .select('id, name, username, email')
    .ilike('name', `%${search}%`);

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <UploadReceipts />
      <Title>Your past receipts</Title>
      <Text>
        Click to view your past receipts in detail.
      </Text>
      <Search />
      <Card className="mt-6">
        <UsersTable users={users || []} />
      </Card>
    </main>
  );
}