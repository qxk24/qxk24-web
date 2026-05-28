'use client';

import { useState } from 'react';
import { JournalReaction } from '@/lib/types';
import { JournalAPI } from '@/lib/api';

const REACTION_META: Record<JournalReaction['type'], { emoji: string; label: string }> = {
  insightful: { emoji: '💡', label: 'Insightful' },
  profound: { emoji: '🌊', label: 'Profound' },
  transformative: { emoji: '🔥', label: 'Transformative' },
  aligned: { emoji: '🌿', label: 'Aligned' },
  questioning: { emoji: '🤔', label: 'Questioning' },
};

interface ReactionBarProps {
  journalId: string;
  reactions: JournalReaction[];
}

export function ReactionBar({ journalId, reactions: initial }: ReactionBarProps) {
  const [reactions, setReactions] = useState(initial);
  const [reacted, setReacted] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReact = async (type: JournalReaction['type']) => {
    if (reacted || loading) return;
    setLoading(true);
    try {
      const res = await JournalAPI.react(journalId, type);
      setReactions(res.reactions);
      setReacted(type);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 my-6">
      {reactions.map((r) => {
        const meta = REACTION_META[r.type];
        const isActive = reacted === r.type;
        return (
          <button
            key={r.type}
            type="button"
            onClick={() => handleReact(r.type)}
            disabled={!!reacted || loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
              isActive
                ? 'bg-amber-100 border-amber-400 text-amber-800'
                : 'bg-white border-gray-200 text-gray-600 hover:border-amber-300'
            } ${reacted && !isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span>{meta.emoji}</span>
            <span className="text-sm font-medium">{meta.label}</span>
            <span className="text-xs text-gray-400">{r.count}</span>
          </button>
        );
      })}
    </div>
  );
}
