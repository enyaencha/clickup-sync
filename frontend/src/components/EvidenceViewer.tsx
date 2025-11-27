import React from 'react';

interface Attachment {
  id: number;
  file_name: string;
  file_path: string | null;
  file_url: string | null;
  file_type: string | null;
  file_size: number | null;
  uploaded_at: string;
  uploaded_by: number | null;
}

interface EvidenceViewerProps {
  attachments: Attachment[];
  verificationMethod: string;
  onClose: () => void;
  onDelete?: (attachmentId: number) => void;
  canDelete?: boolean;
}

const EvidenceViewer: React.FC<EvidenceViewerProps> = ({
  attachments,
  verificationMethod,
  onClose,
  onDelete,
  canDelete = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentAttachment = attachments[currentIndex];

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileUrl = (attachment: Attachment): string => {
    return `http://localhost:3000${attachment.file_path || attachment.file_url || ''}`;
  };

  const isImage = (fileType: string | null): boolean => {
    return fileType?.startsWith('image/') || false;
  };

  const isPdf = (fileType: string | null): boolean => {
    return fileType === 'application/pdf' || false;
  };

  const handleNext = () => {
    if (currentIndex < attachments.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleDownload = (attachment: Attachment) => {
    const link = document.createElement('a');
    link.href = getFileUrl(attachment);
    link.download = attachment.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (attachments.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">No Evidence Available</h2>
          <p className="text-gray-600 mb-4">There are no attachments for this verification method.</p>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 backdrop-blur-sm p-4 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-semibold text-lg truncate">
              {verificationMethod}
            </h2>
            <p className="text-gray-300 text-sm">
              {currentIndex + 1} of {attachments.length} attachments
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-white hover:text-gray-300 p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full h-full flex items-center justify-center p-4 pt-24 pb-32">
        <div className="max-w-6xl w-full h-full flex items-center justify-center">
          {/* Previous Button */}
          {attachments.length > 1 && currentIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full backdrop-blur-sm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Content */}
          <div className="w-full h-full flex items-center justify-center">
            {isImage(currentAttachment.file_type) ? (
              <img
                src={getFileUrl(currentAttachment)}
                alt={currentAttachment.file_name}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            ) : isPdf(currentAttachment.file_type) ? (
              <iframe
                src={getFileUrl(currentAttachment)}
                title={currentAttachment.file_name}
                className="w-full h-full rounded-lg shadow-2xl bg-white"
              />
            ) : (
              <div className="bg-white rounded-lg p-8 max-w-md text-center shadow-2xl">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold mb-2">{currentAttachment.file_name}</h3>
                <p className="text-gray-600 mb-4">
                  {currentAttachment.file_type || 'Unknown type'}<br />
                  {formatFileSize(currentAttachment.file_size)}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  This file type cannot be previewed in the browser.
                </p>
                <button
                  onClick={() => handleDownload(currentAttachment)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Download to View
                </button>
              </div>
            )}
          </div>

          {/* Next Button */}
          {attachments.length > 1 && currentIndex < attachments.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full backdrop-blur-sm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 backdrop-blur-sm p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="text-white">
              <p className="font-medium">{currentAttachment.file_name}</p>
              <p className="text-sm text-gray-300">
                {formatFileSize(currentAttachment.file_size)} • Uploaded {new Date(currentAttachment.uploaded_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleDownload(currentAttachment)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg backdrop-blur-sm flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
              {canDelete && onDelete && (
                <button
                  onClick={() => {
                    if (confirm('Delete this attachment?')) {
                      onDelete(currentAttachment.id);
                      if (attachments.length === 1) {
                        onClose();
                      } else if (currentIndex === attachments.length - 1) {
                        setCurrentIndex(currentIndex - 1);
                      }
                    }
                  }}
                  className="bg-red-600 bg-opacity-80 hover:bg-opacity-100 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              )}
            </div>
          </div>

          {/* Thumbnail Navigation */}
          {attachments.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {attachments.map((attachment, index) => (
                <button
                  key={attachment.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    index === currentIndex ? 'border-blue-500' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  {isImage(attachment.file_type) ? (
                    <img
                      src={getFileUrl(attachment)}
                      alt={attachment.file_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white text-2xl">
                      📄
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Import useState
import { useState } from 'react';

export default EvidenceViewer;
