'use client'

import React from 'react'

export default function RelatorioXRPLLatamPage() {
  return (
    <main style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      background: '#f6f7f9',
      minHeight: '100vh',
    }}>
      <header className="no-print" style={{ textAlign: 'center' }}>
        <h1 style={{
          margin: 0,
          fontSize: '24px',
          fontWeight: 700,
          color: '#1a1a1a',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        }}>
          Relatório Técnico XRPL LATAM
        </h1>
        <p style={{
          marginTop: '6px',
          fontSize: '14px',
          color: '#666',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        }}>
          Clique no botão abaixo para gerar o PDF de alta qualidade.
        </p>
      </header>

      <div className="page" style={{
        width: '210mm',
        minHeight: '297mm',
        background: '#fff',
        boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <img
          src="/relatorio-tecnico-xrpl-latam.svg"
          alt="Relatório Técnico: Soluções XRPL para LATAM"
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />
      </div>

      <div className="actions no-print" style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => window.print()}
          style={{
            padding: '10px 16px',
            borderRadius: '6px',
            border: '1px solid #0066cc',
            background: '#0066cc',
            color: '#fff',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          Baixar PDF
        </button>
        <a
          href="/relatorio-tecnico-xrpl-latam.svg"
          download
          style={{
            padding: '10px 16px',
            borderRadius: '6px',
            border: '1px solid #e5e5e5',
            background: '#fff',
            color: '#1a1a1a',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          Baixar SVG
        </a>
      </div>

      <style>{`
        @page {
          size: A4;
          margin: 12mm;
        }
        @media print {
          .no-print { display: none !important; }
          .page { box-shadow: none !important; border-radius: 0 !important; width: auto !important; min-height: auto !important; }
          body { background: #fff !important; }
        }
        html, body { background: #f6f7f9; }
      `}</style>
    </main>
  )
}