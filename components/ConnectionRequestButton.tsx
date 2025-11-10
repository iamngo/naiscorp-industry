'use client';

import { useState } from 'react';
import { Link as LinkIcon } from 'lucide-react';

interface ConnectionRequestButtonProps {
  targetId: string;
  targetRole: 'iz' | 'factory' | 'supplier' | 'buyer';
  targetName: string;
}

export default function ConnectionRequestButton({
  targetId,
  targetRole,
  targetName,
}: ConnectionRequestButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/connection-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toUserId: targetId,
          toRole: targetRole,
          message: message,
        }),
      });

      if (response.ok) {
        alert('Đã gửi yêu cầu kết nối thành công! (Mock data)');
        setShowModal(false);
        setMessage('');
      } else {
        alert('Có lỗi xảy ra');
      }
    } catch (error) {
      alert('Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
      >
        <LinkIcon className="w-4 h-4" />
        <span>Kết nối</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Gửi yêu cầu kết nối</h2>
            <p className="text-gray-600 mb-4">
              Gửi yêu cầu kết nối đến: <strong>{targetName}</strong>
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tin nhắn
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tin nhắn của bạn..."
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setMessage('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
