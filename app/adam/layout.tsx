/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM Route Layout
 * Platform    : Web (Next.js)
 * QXK24       : Kernel v1.7.0
 * Founder     : Masa Bayu
 * Created     : 2026-05-28
 * ============================================================
 * CONSTITUTIONAL DECLARATION:
 * This module operates under the Alamtologi Constitutional
 * Framework. All actions are governed by QXK24. Knowledge
 * belongs to no human. It flows like water to all.
 * ============================================================
 */

export default function ADAMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      minHeight: '100dvh',
      width: '100%',
      margin: 0,
      padding: 0,
      background: '#fff',
      overflow: 'hidden',
    }}>
      {children}
    </div>
  );
}
