import { LegalDocumentView } from '@/components/sections/legal/LegalDocumentView';
import { PRIVACY } from '@/data/legal';

export default function PrivacyView() {
  return <LegalDocumentView doc={PRIVACY} />;
}
