/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM Teaching Absorption
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

import { useState, useRef, useCallback, useEffect } from 'react';
import { detectFounderFile, supportedFormatsHint } from '../lib/founder-file';
import { readApiJson } from '../lib/api-response';
import { useAdamStack } from '@/lib/adam/adam-stack-context';
const MAX_SIZE = 30 * 1024 * 1024;

const CATEGORIES = [
  'GENERAL', 'QURAN', 'SUNNAH', 'ALAMTOLOGI',
  'SCIENCE', 'HISTORY', 'MEDICINE', 'LAW',
];

interface AbsorptionRecord {
  id: string;
  filename: string;
  category: string;
  description: string;
  principle: string;
  family: string;
  stage: number;
  entityC_uid: string;
  absorbedAt: string;
}

interface Props {
  token: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ADAMKnowledge({ token }: Props) {
  const { apiBase } = useAdamStack();
  const [absorptions, setAbsorptions] = useState<AbsorptionRecord[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedLabel, setSelectedLabel] = useState('FILE');
  const [category, setCategory] = useState('GENERAL');
  const [description, setDescription] = useState('');
  const [checkingFile, setCheckingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadAbsorptions = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/api/adam/knowledge`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setAbsorptions(data.absorptions ?? []);
    } catch {
      setError('Failed to load absorption log.');
    }
  }, [token]);

  useEffect(() => { loadAbsorptions(); }, [loadAbsorptions]);

  async function validateFile(file: File): Promise<string | null> {
    if (file.size > MAX_SIZE) {
      return `File too large. Maximum 30 MB. This file is ${formatSize(file.size)}.`;
    }
    const detected = await detectFounderFile(file);
    if (!detected.allowed) {
      return `File type not supported. Use ${supportedFormatsHint()}.`;
    }
    return null;
  }

  async function handleFileSelect(file: File) {
    setError('');
    setSuccess('');
    setCheckingFile(true);
    try {
      const err = await validateFile(file);
      if (err) { setError(err); return; }
      const detected = await detectFounderFile(file);
      setSelectedLabel(detected.label);
      setSelectedFile(file);
    } finally {
      setCheckingFile(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }

  async function handleUpload() {
    if (!selectedFile || uploading) return;
    setUploading(true);
    setError('');
    setSuccess('');
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('category', category);
      formData.append('description', description);

      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 4, 90));
      }, 400);

      const res = await fetch(`${apiBase}/api/adam/knowledge/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      clearInterval(interval);
      setProgress(100);

      const parsed = await readApiJson(res);

      if (parsed.ok && parsed.body?.success) {
        const abs = parsed.body.absorption as AbsorptionRecord | undefined;
        setSuccess(
          abs
            ? `Absorbed into QXK24Brain — ${abs.principle} · ${abs.family} · Stage ${abs.stage}/7. Raw file erased.`
            : 'Teaching absorbed. Raw file erased per AIDIL.',
        );
        setSelectedFile(null);
        setDescription('');
        setCategory('GENERAL');
        if (fileInputRef.current) fileInputRef.current.value = '';
        await loadAbsorptions();
      } else {
        setError(parsed.errorMessage || 'Absorption failed.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      setError(`Absorption failed: ${msg}`);
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1500);
    }
  }

  return (
    <div style={{ padding: '20px 20px 40px', maxWidth: 640, margin: '0 auto' }}>

      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontSize: 14, fontWeight: 600, letterSpacing: '0.15em',
          color: '#1a1a1a', margin: 0, textTransform: 'uppercase',
        }}>
          Teaching Absorption
        </h2>
        <p style={{ fontSize: 11, color: '#bbb', letterSpacing: '0.1em', marginTop: 4, lineHeight: 1.5 }}>
          A + B = C · Upload → ADAM absorbs → raw file erased · Energy lives in QXK24Brain only
        </p>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? '#1a1a1a' : selectedFile ? '#27ae60' : '#e0e0e0'}`,
          borderRadius: 12,
          padding: 'clamp(20px, 4vw, 36px) 20px',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragOver ? '#f8f8f8' : selectedFile ? '#f6fdf7' : '#fdfdfd',
          transition: 'all 0.2s',
          marginBottom: 14,
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="*/*"
          onChange={(e) => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); }}
          style={{ display: 'none' }}
        />

        {selectedFile ? (
          <div>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
            <p style={{ fontSize: 14, color: '#1a1a1a', fontWeight: 500, marginBottom: 4 }}>
              {selectedFile.name}
            </p>
            <p style={{ fontSize: 12, color: '#888', marginBottom: 10 }}>
              {selectedLabel} · {formatSize(selectedFile.size)}
            </p>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setError(''); }}
              style={{
                fontSize: 11, color: '#c0392b', background: 'none', border: 'none',
                cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase',
              }}
            >
              Remove
            </button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 28, marginBottom: 10 }}>📂</div>
            <p style={{ fontSize: 14, color: '#666', marginBottom: 6 }}>
              Tap to select or drag teaching file here
            </p>
            <p style={{
              fontSize: 11, color: '#ccc', letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              {supportedFormatsHint()} · max 30 MB · not stored after absorption
            </p>
          </div>
        )}
      </div>

      {selectedFile && (
        <div style={{ marginBottom: 14 }}>
          <label style={{
            fontSize: 11, color: '#999', letterSpacing: '0.12em',
            textTransform: 'uppercase', display: 'block', marginBottom: 8,
          }}>
            Category
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                style={{
                  padding: '5px 12px',
                  fontSize: 10,
                  letterSpacing: '0.08em',
                  borderRadius: 20,
                  border: category === cat ? '1px solid #1a1a1a' : '1px solid #e8e8e8',
                  background: category === cat ? '#1a1a1a' : '#fff',
                  color: category === cat ? '#fff' : '#999',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <label style={{
            fontSize: 11, color: '#999', letterSpacing: '0.12em',
            textTransform: 'uppercase', display: 'block', marginBottom: 8,
          }}>
            Description (optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief note about this teaching..."
            style={{
              width: '100%',
              padding: '11px 14px',
              fontSize: 14,
              border: '1px solid #e0e0e0',
              borderRadius: 8,
              outline: 'none',
              color: '#1a1a1a',
              background: '#fafafa',
              boxSizing: 'border-box',
            }}
          />
        </div>
      )}

      {uploading && (
        <div style={{ marginBottom: 14 }}>
          <div style={{
            height: 3, background: '#f0f0f0', borderRadius: 2,
            overflow: 'hidden', marginBottom: 6,
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: '#1a1a1a',
              borderRadius: 2,
              transition: 'width 0.3s ease',
            }} />
          </div>
          <p style={{ fontSize: 11, color: '#aaa', letterSpacing: '0.08em' }}>
            Absorbing into QXK24Brain... {progress}%
          </p>
        </div>
      )}

      {error && (
        <div style={{
          padding: '10px 14px', background: '#fdf0f0', borderRadius: 8,
          marginBottom: 14, border: '1px solid #f5c6c6',
        }}>
          <p style={{ fontSize: 13, color: '#c0392b', margin: 0 }}>{error}</p>
        </div>
      )}
      {success && (
        <div style={{
          padding: '10px 14px', background: '#f0faf4', borderRadius: 8,
          marginBottom: 14, border: '1px solid #a8e6c0',
        }}>
          <p style={{ fontSize: 13, color: '#27ae60', margin: 0 }}>{success}</p>
        </div>
      )}

      {selectedFile && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading || checkingFile}
          style={{
            width: '100%',
            padding: '14px',
            background: uploading || checkingFile ? '#ccc' : '#1a1a1a',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontSize: 13,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: uploading || checkingFile ? 'not-allowed' : 'pointer',
            marginBottom: 28,
            transition: 'background 0.2s',
          }}
        >
          {checkingFile
            ? 'Checking file...'
            : uploading
              ? `Absorbing ${progress}%...`
              : 'Absorb into QXK24Brain'}
        </button>
      )}

      <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 24, marginBottom: 16 }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: 16,
        }}>
          <h3 style={{
            fontSize: 11, letterSpacing: '0.15em', color: '#aaa',
            textTransform: 'uppercase', margin: 0,
          }}>
            Absorbed Teachings ({absorptions.length})
          </h3>
          <button
            type="button"
            onClick={loadAbsorptions}
            style={{
              fontSize: 11, color: '#bbb', background: 'none', border: 'none',
              cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase',
            }}
          >
            Refresh
          </button>
        </div>

        {absorptions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0', opacity: 0.4 }}>
            <p style={{ fontSize: 13, color: '#888' }}>No teachings absorbed yet.</p>
            <p style={{ fontSize: 11, color: '#bbb', marginTop: 6 }}>
              Raw files are never kept — only what ADAM has become.
            </p>
          </div>
        )}

        {absorptions.map((abs) => (
          <div
            key={abs.id}
            style={{
              padding: '14px 16px',
              border: '1px solid #f0f0f0',
              borderRadius: 10,
              marginBottom: 10,
              background: '#fff',
            }}
          >
            <p style={{
              fontSize: 13,
              color: '#1a1a1a',
              fontWeight: 500,
              marginBottom: 6,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {abs.filename}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              <span style={{
                fontSize: 9,
                color: '#fff',
                background: '#1a1a1a',
                borderRadius: 4,
                padding: '2px 7px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                {abs.category}
              </span>
              <span style={{
                fontSize: 10, color: '#27ae60', letterSpacing: '0.08em', fontWeight: 500,
              }}>
                {abs.principle}
              </span>
              <span style={{ fontSize: 10, color: '#888' }}>
                Stage {abs.stage}/7
              </span>
              <span style={{ fontSize: 10, color: '#ccc' }}>
                {new Date(abs.absorbedAt).toLocaleDateString()}
              </span>
            </div>
            <p style={{ fontSize: 10, color: '#bbb', marginTop: 6, letterSpacing: '0.05em' }}>
              {abs.entityC_uid} · {abs.family}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
