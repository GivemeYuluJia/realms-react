// Import your Client Component
import { BasePanel } from '@/app/components/ui/BasePanel';
import { ArtBackground } from '@/components/map/ArtBackground';
import { RealmProvider } from '@/context/RealmContext';
import { getRealm } from '@/lib/realm/getRealm';
import Resources from './Resources';

export default async function Page({ params }) {
  // Fetch data directly in a Server Component
  const realm = await getRealm(params.id);
  // Forward fetched data to your Client Component
  return <>{realm && <Resources realm={realm} buildings={undefined} />}</>;
}
