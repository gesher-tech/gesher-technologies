import { LegalDocumentView } from '@/components/sections/legal/LegalDocumentView';
import { TERMS } from '@/data/legal';

export default function TermsView() {
  return <LegalDocumentView doc={TERMS} />;
}
