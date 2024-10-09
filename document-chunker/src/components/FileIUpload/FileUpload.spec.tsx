import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import FileUpload from './FileUpload';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('FileUpload Component', () => {
  const onUploadComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component correctly', () => {
    render(<FileUpload onUploadComplete={onUploadComplete} />);
    expect(screen.getByLabelText(/Chunk Size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Chunk Overlap/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Send to OpenAI/i)).toBeInTheDocument();
    expect(screen.getByText('Drag & drop a file here, or click to select one')).toBeInTheDocument();
  });

  it('handles file drop correctly', async () => {
    render(<FileUpload onUploadComplete={onUploadComplete} />);

    const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByRole('presentation').querySelector('input[type="file"]') as HTMLInputElement;
    
    fireEvent.change(input, { target: { files: [file] } });

    mockedAxios.post.mockResolvedValueOnce({ data: { filename: 'test.txt' } });

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(onUploadComplete).toHaveBeenCalledWith('test.txt');
    });
  });



  it('updates state correctly on input change', () => {
    render(<FileUpload onUploadComplete={onUploadComplete} />);

    const chunkSizeInput = screen.getByLabelText(/Chunk Size/i);
    const chunkOverlapInput = screen.getByLabelText(/Chunk Overlap/i);
    const sendToOpenAIInput = screen.getByLabelText(/Send to OpenAI/i);

    fireEvent.change(chunkSizeInput, { target: { value: '2000' } });
    fireEvent.change(chunkOverlapInput, { target: { value: '300' } });
    fireEvent.click(sendToOpenAIInput);

    expect(chunkSizeInput).toHaveValue(2000);
    expect(chunkOverlapInput).toHaveValue(300);
    expect(sendToOpenAIInput).not.toBeChecked();
  });
});