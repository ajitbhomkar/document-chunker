import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import DocumentViewer from './DocumentViewer';

const mock = new MockAdapter(axios);

const mockChunks = [
  { id: 1, documentId: 'doc1', chunkText: 'Chunk 1', openAIData: { response: 'AI Response 1' } },
  { id: 2, documentId: 'doc1', chunkText: 'Chunk 2', openAIData: { response: 'AI Response 2' } },
  
];

describe('DocumentViewer Component', () => {
  beforeEach(() => {
    mock.reset();
  });

  it('renders the component correctly', () => {
    render(<DocumentViewer documentId="doc1" />);
   
    expect(screen.getByRole('columnheader', { name: /Document Id/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Chunk Text/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /OpenAI Data/i })).toBeInTheDocument();
  });

  it('fetches and displays chunks correctly', async () => {
    mock.onGet('http://localhost:8000/chunks/doc1').reply(200, mockChunks);

    render(<DocumentViewer documentId="doc1" />);

    await waitFor(() => {
      expect(screen.getByText('Chunk 1')).toBeInTheDocument();
      expect(screen.getByText('Chunk 2')).toBeInTheDocument();
    });
  });

  it('handles pagination correctly', async () => {
    const paginatedChunks = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      documentId: 'doc1',
      chunkText: `Chunk ${i + 1}`,
      openAIData: { response: `AI Response ${i + 1}` },
    }));

    mock.onGet('http://localhost:8000/chunks/doc1').reply(200, paginatedChunks);

    render(<DocumentViewer documentId="doc1" />);

    await waitFor(() => {
      expect(screen.getByText('Chunk 1')).toBeInTheDocument();
      expect(screen.getByText('Chunk 10')).toBeInTheDocument();
    });

    const paginationButtons = screen.getAllByRole('button', { name: '2' });
    fireEvent.click(paginationButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Chunk 11')).toBeInTheDocument();
      expect(screen.getByText('Chunk 20')).toBeInTheDocument();
    });
  });

  it('displays OpenAI data correctly', async () => {
    mock.onGet('http://localhost:8000/chunks/doc1').reply(200, mockChunks);

    render(<DocumentViewer documentId="doc1" />);

    await waitFor(() => {
      expect(screen.getByText(/AI Response 1/i)).toBeInTheDocument();
      expect(screen.getByText(/AI Response 2/i)).toBeInTheDocument();
    });
  });
});