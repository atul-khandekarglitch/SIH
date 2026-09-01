import ProblemClient from './ProblemClient';

export async function generateStaticParams() {
  return [
    { id: 'JH-001' },
    { id: 'JH-002' },
    { id: 'JH-003' },
    { id: 'JH-004' },
    { id: 'JH-005' },
    { id: 'JH-006' },
    { id: 'JH-007' },
    { id: 'JH-008' },
    { id: 'JH-009' },
    { id: 'JH-010' },
    { id: 'JH-011' },
    { id: 'JH-012' }
  ];
}

export default function ProblemDetailPage({ params }: { params: { id: string } }) {
  return <ProblemClient problemId={params.id} />;
}