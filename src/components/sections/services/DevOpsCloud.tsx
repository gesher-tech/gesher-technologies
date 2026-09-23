import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Play, RotateCcw, Terminal } from 'lucide-react';
import { ServiceHeader } from '@/components/sections/services/ServiceHeader';
import { devOpsServices } from '@/data/mockData';
import { useNavigation } from '@/context/NavigationContext';
import { cn } from '@/lib/utils';

type LineTone = 'cmd' | 'info' | 'ok' | 'warn' | 'dim';
interface TermLine {
  tone: LineTone;
  text: string;
}

const SCRIPTS: Record<string, TermLine[]> = {
  cicd: [
    { tone: 'cmd', text: 'git push origin main' },
    { tone: 'dim', text: '→ GitHub Actions: workflow "build-test-deploy" triggered' },
    { tone: 'info', text: '[build]   docker buildx · layer cache hit 87%' },
    { tone: 'info', text: '[test]    412 unit · 58 integration tests' },
    { tone: 'ok', text: '[test]    ✔ all passed in 1m 42s' },
    { tone: 'info', text: '[scan]    trivy image · sonarqube quality gate' },
    { tone: 'ok', text: '[scan]    ✔ 0 critical · 0 high vulnerabilities' },
    { tone: 'info', text: '[gitops]  argocd app sync health-track-prod' },
    { tone: 'ok', text: '✔ Rollout complete · canary 10% → 100% · 3m 58s' },
  ],
  multicloud: [
    { tone: 'cmd', text: 'terraform plan -var-file=prod.tfvars' },
    { tone: 'info', text: 'module.aws_vpc.ap-south-1      + 14 to add' },
    { tone: 'info', text: 'module.gcp_gke.asia-south1     ~ 2 to change' },
    { tone: 'info', text: 'module.baremetal.kochi-dc      + 3 to add' },
    { tone: 'warn', text: 'infracost: +₹18,240/month (within budget ₹25,000)' },
    { tone: 'cmd', text: 'terraform apply -auto-approve' },
    { tone: 'ok', text: '✔ Apply complete! Resources: 17 added, 2 changed, 0 destroyed' },
    { tone: 'ok', text: '✔ Drift detection scheduled · every 6 hours' },
  ],
  kubernetes: [
    { tone: 'cmd', text: 'kubectl get nodes -o wide' },
    { tone: 'info', text: 'ip-10-0-1-21   Ready   ap-south-1a   v1.31' },
    { tone: 'info', text: 'ip-10-0-2-37   Ready   ap-south-1b   v1.31' },
    { tone: 'info', text: 'ip-10-0-3-12   Ready   ap-south-1c   v1.31' },
    { tone: 'cmd', text: 'helm upgrade lab-api ./charts/lab-api --atomic' },
    { tone: 'info', text: 'HPA: lab-api 3 → 7 replicas (cpu 71%)' },
    { tone: 'ok', text: '✔ SLO availability 99.98% · p95 latency 142ms' },
    { tone: 'ok', text: '✔ Grafana alerts green · PagerDuty on-call armed' },
  ],
  security: [
    { tone: 'cmd', text: 'gesher-audit run --profile hipaa,dpdp' },
    { tone: 'info', text: '[encrypt] RDS · S3 · EBS — AES-256 via KMS' },
    { tone: 'ok', text: '[encrypt] ✔ 100% of PHI stores encrypted at rest' },
    { tone: 'info', text: '[secrets] vault rotate database/creds/lab-reader' },
    { tone: 'ok', text: '[secrets] ✔ rotated · TTL 24h' },
    { tone: 'info', text: '[policy]  opa gatekeeper · 23 constraints' },
    { tone: 'ok', text: '[policy]  ✔ 0 violations' },
    { tone: 'ok', text: '✔ Audit report exported → s3://gesher-compliance/2026/' },
  ],
};

const TONE_CLASS: Record<LineTone, string> = {
  cmd: 'text-white',
  info: 'text-slate-400',
  ok: 'text-clinical-400',
  warn: 'text-amber-300',
  dim: 'text-slate-500',
};

/** DevOps & Cloud Engineering — capability list with an animated terminal walkthrough. */
export function DevOpsCloud() {
  const { startInquiry } = useNavigation();
  const [activeId, setActiveId] = useState(devOpsServices[0]!.id);
  const [shown, setShown] = useState(0);
  const [runKey, setRunKey] = useState(0);
  const script = SCRIPTS[activeId] ?? [];
  const done = shown >= script.length;

  useEffect(() => {
    setShown(0);
    let count = 0;
    const id = window.setInterval(() => {
      count += 1;
      setShown(count);
      if (count >= script.length) window.clearInterval(id);
    }, 420);
    return () => window.clearInterval(id);
  }, [activeId, runKey, script.length]);

  const active = devOpsServices.find((s) => s.id === activeId) ?? devOpsServices[0]!;

  return (
    <section aria-labelledby="devops-title">
      <ServiceHeader
        id="devops-title"
        service="devops"
        title="Infrastructure that ships daily and sleeps soundly"
        description="The same platform engineering that runs our healthcare products — now available to your team. We design, automate and operate cloud platforms on AWS, GCP and bare metal, with security and observability built in."
        action={
          <button type="button" onClick={() => startInquiry('devops')} className="btn-ghost">
            Talk to an engineer
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.1fr]">
        <ul
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1"
          role="tablist"
          aria-label="DevOps capabilities"
          aria-orientation="vertical"
        >
          {devOpsServices.map((s) => {
            const isActive = s.id === activeId;
            return (
              <li key={s.id} role="presentation">
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="devops-terminal"
                  onClick={() => setActiveId(s.id)}
                  className={cn(
                    'tap flex h-full w-full gap-4 rounded-native border p-4 text-left transition-colors sm:p-5',
                    isActive ? 'border-health-500/50 bg-health-500/[0.07] shadow-glow' : 'border-white/[0.06] bg-ink-800/60 hover:border-white/15',
                  )}
                >
                  <span
                    className={cn(
                      'grid size-11 shrink-0 place-items-center rounded-2xl transition-colors',
                      isActive ? 'bg-health-500 text-white' : 'bg-white/5 text-health-400',
                    )}
                  >
                    <s.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[15px] font-semibold text-white">{s.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-slate-400">{s.description}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col gap-4">
          <div id="devops-terminal" role="tabpanel" className="overflow-hidden rounded-native border border-white/10 bg-[#070b14] shadow-glass">
            <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
              <div className="flex min-w-0 items-center gap-2">
                <span className="size-3 shrink-0 rounded-full bg-rose-500/80" />
                <span className="size-3 shrink-0 rounded-full bg-amber-400/80" />
                <span className="size-3 shrink-0 rounded-full bg-emerald-400/80" />
                <span className="ml-2 flex min-w-0 items-center gap-1.5 truncate font-mono text-xs text-slate-500 xs:ml-3">
                  <Terminal className="size-3.5" aria-hidden="true" />
                  gesher@platform: ~/{activeId}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setRunKey((k) => k + 1)}
                className="tap -mr-2 flex min-h-touch shrink-0 items-center gap-1.5 rounded-full px-3 font-mono text-xs text-slate-400 hover:bg-white/5 hover:text-white"
              >
                {done ? <RotateCcw className="size-3.5" aria-hidden="true" /> : <Play className="size-3.5" aria-hidden="true" />}
                {done ? 'Re-run' : 'Running'}
              </button>
            </div>
            <pre className="h-80 overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed sm:p-5" aria-label={`${active.title} terminal output`}>
              {script.slice(0, shown).map((line, i) => (
                <span key={`${runKey}-${i}`} className={cn('block animate-fade-up whitespace-pre', TONE_CLASS[line.tone])}>
                  {line.tone === 'cmd' && <span className="text-health-400">$ </span>}
                  {line.text}
                </span>
              ))}
              {!done && <span className="inline-block h-4 w-2 translate-y-0.5 animate-blink bg-health-400" aria-hidden="true" />}
            </pre>
          </div>

          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">What you get</p>
            <p className="mt-2 flex items-start gap-2 text-sm text-slate-200">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-clinical-400" aria-hidden="true" />
              {active.deliverable}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technology stack">
              {active.techStack.map((t) => (
                <li key={t} className="chip bg-white/5 font-mono text-slate-300 ring-1 ring-white/10">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
