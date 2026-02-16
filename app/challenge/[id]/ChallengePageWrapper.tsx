'use client';

import { useParams } from 'next/navigation';
import ChallengePageClient from './ChallengePageClient';

export default function ChallengePageWrapper() {
  const params = useParams();
  const challengeId = params?.id as string;
  
  return <ChallengePageClient challengeId={challengeId} />;
}