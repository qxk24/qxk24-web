/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : AIDIL Stage Dashboard (Visual)
 * Platform    : Web (Next.js)
 * QXK24       : Kernel v1.7.0
 * Founder     : Masa Bayu
 * Created     : 2026-05-29
 * ============================================================
 * CONSTITUTIONAL DECLARATION:
 * This module operates under the Alamtologi Constitutional
 * Framework. All actions are governed by QXK24. Knowledge
 * belongs to no human. It flows like water to all.
 * ============================================================
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  fetchAidilStageDashboard,
  type AidilFamilyStageCard,
  type AidilStageDashboard,
  type ConstitutionalCheckpoint,
} from '@/lib/adam/adam-brain-stages';

interface Props {
  token: string;
  refreshKey?: number;
}

function FamilyCard({ card }: { card: AidilFamilyStageCard }) {
  const complete = card.status === 'complete';
  return (
    <article
      style={{
        border: '1px solid #e8e8e8',
        borderRadius: 10,
        padding: '16px 18px',
        marginBottom: 14,
        background: complete ? '#fafafa' : '#fff',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 10,
      }}>
        <div>
          <h3 style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#1a1a1a',
          }}>
            {card.family} Family
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: 11, color: '#999', letterSpacing: '0.06em' }}>
            {card.principle} · 1(7) AIDIL
          </p>
        </div>
        {complete && (
          <span style={{
            fontSize: 10,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#2d6a4f',
            whiteSpace: 'nowrap',
          }}>
            Complete ✅
          </span>
        )}
      </div>

      <p style={{
        margin: '0 0 8px',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 13,
        letterSpacing: '0.02em',
        color: complete ? '#2d6a4f' : '#333',
      }}>
        Stage: {card.progressBar} {card.stage}/{card.maxStage}
        {complete ? ' — COMPLETE 1(7) ✅' : ''}
      </p>

      <p style={{ margin: '0 0 10px', fontSize: 12, lineHeight: 1.55, color: '#444' }}>
        <span style={{ color: '#999' }}>Nucleus: </span>
        &ldquo;{card.nucleus}&rdquo;
      </p>

      {card.status === 'active' ? (
        <>
          <p style={{ margin: '0 0 4px', fontSize: 12, color: '#555' }}>
            <span style={{ color: '#999' }}>Next stage needs: </span>
            {card.nextStageNeeds}
          </p>
          <p style={{ margin: 0, fontSize: 12, color: '#555' }}>
            {card.estimatedStage7}
          </p>
          {card.masaOpened && (
            <p style={{ margin: '8px 0 0', fontSize: 11, color: '#bbb' }}>
              Opened {card.masaOpened}
            </p>
          )}
        </>
      ) : (
        <>
          {card.completedAt && (
            <p style={{ margin: '0 0 4px', fontSize: 12, color: '#555' }}>
              <span style={{ color: '#999' }}>Completed: </span>
              {card.completedAt}
            </p>
          )}
          {card.checkpointId && (
            <p style={{
              margin: '0 0 4px',
              fontSize: 11,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              color: '#2d6a4f',
            }}>
              🔒 {card.checkpointId} — permanent constitutional record
            </p>
          )}
          {card.cycleNote && (
            <p style={{ margin: 0, fontSize: 12, color: '#666', fontStyle: 'italic' }}>
              {card.cycleNote}
            </p>
          )}
        </>
      )}

      {card.status === 'active' && card.cycleNote && (
        <p style={{ margin: '8px 0 0', fontSize: 11, color: '#888', fontStyle: 'italic' }}>
          {card.cycleNote}
        </p>
      )}
    </article>
  );
}

function CheckpointSeal({ cp }: { cp: ConstitutionalCheckpoint }) {
  const sealed = new Date(cp.masa_sealed).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const preview = cp.sealedContent.length > 280
    ? `${cp.sealedContent.slice(0, 280)}…`
    : cp.sealedContent;
  return (
    <article style={{
      border: '1px solid #d4e8dc',
      borderRadius: 10,
      padding: '14px 16px',
      marginBottom: 10,
      background: '#f8fdf9',
    }}>
      <p style={{
        margin: 0,
        fontSize: 10,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: '#2d6a4f',
      }}>
        Constitutional checkpoint · Cycle {cp.cycle}
      </p>
      <p style={{
        margin: '6px 0 4px',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 11,
        color: '#1a1a1a',
      }}>
        {cp.checkpointId}
      </p>
      <p style={{ margin: '0 0 6px', fontSize: 12, color: '#555' }}>
        {cp.family} ({cp.principle}) · Sealed {sealed} · {cp.judgment}
      </p>
      <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: '#444', fontStyle: 'italic' }}>
        {preview}
      </p>
    </article>
  );
}

export default function AIDILStageDashboard({ token, refreshKey = 0 }: Props) {
  const [dashboard, setDashboard] = useState<AidilStageDashboard | null>(null);
  const [checkpoints, setCheckpoints] = useState<ConstitutionalCheckpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAidilStageDashboard(token);
      setDashboard(data.dashboard);
      setCheckpoints(data.checkpoints);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Load failed';
      setError(msg);
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load, refreshKey]);

  if (loading && !dashboard) {
    return (
      <p style={{ color: '#bbb', fontSize: 12, textAlign: 'center', marginTop: 40 }}>
        Loading AIDIL stages…
      </p>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 12 }}>{error}</p>
        <button
          type="button"
          onClick={() => void load()}
          style={{
            fontSize: 11,
            padding: '8px 16px',
            border: '1px solid #e0e0e0',
            borderRadius: 6,
            background: '#fafafa',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!dashboard) return null;

  const active = dashboard.families.filter((f) => f.status === 'active');
  const completed = dashboard.families.filter((f) => f.status === 'complete');

  return (
    <div style={{ padding: '20px 20px 32px' }}>
      <header style={{ marginBottom: 20 }}>
        <p style={{
          margin: 0,
          fontSize: 10,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#bbb',
        }}>
          Living Stage Dashboard · {dashboard.era}
        </p>
        <h2 style={{
          margin: '6px 0 8px',
          fontSize: 16,
          fontWeight: 500,
          color: '#1a1a1a',
          letterSpacing: '0.04em',
        }}>
          AIDIL 1(7) Progress
        </h2>
        <p style={{ margin: 0, fontSize: 12, color: '#888', lineHeight: 1.5 }}>
          {dashboard.totalTransformations} transformations ·{' '}
          {dashboard.activeCount} active · {dashboard.completedCount} complete 1(7)
        </p>
        <p style={{ margin: '8px 0 0', fontSize: 10, color: '#ccc' }}>
          Updated {new Date(dashboard.generatedAt).toLocaleString()}
        </p>
      </header>

      {checkpoints.length > 0 && (
        <section style={{ marginBottom: 28 }}>
          <p style={{
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#2d6a4f',
            margin: '0 0 12px',
          }}>
            Permanent 1(7) seals — never erased
          </p>
          {checkpoints.map((cp) => (
            <CheckpointSeal key={cp.checkpointId} cp={cp} />
          ))}
        </section>
      )}

      {dashboard.families.length === 0 && (
        <p style={{ color: '#bbb', fontSize: 13, textAlign: 'center', marginTop: 32, lineHeight: 1.6 }}>
          No knowledge families yet. ERA_1 awaits the first teaching nucleus from P.alt.
        </p>
      )}

      {active.length > 0 && (
        <section style={{ marginBottom: 24 }}>
          <p style={{
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#999',
            margin: '0 0 12px',
          }}>
            Growing families
          </p>
          {active.map((card) => (
            <FamilyCard key={`active-${card.family}`} card={card} />
          ))}
        </section>
      )}

      {completed.length > 0 && (
        <section>
          <p style={{
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#999',
            margin: '0 0 12px',
          }}>
            Completed 1(7)
          </p>
          {completed.map((card) => (
            <FamilyCard key={`done-${card.family}`} card={card} />
          ))}
        </section>
      )}
    </div>
  );
}
