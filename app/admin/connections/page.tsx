'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ConnectionRequest } from '@/types/database';
import { ArrowLeft, Link2, Clock, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

type ConnectionStatusFilter = 'all' | ConnectionRequest['status'];

export default function ConnectionRequestsPage() {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ConnectionStatusFilter>('all');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/connection-requests?status=' + (filter === 'all' ? '' : filter));
      const json = await res.json();
      setRequests(Array.isArray(json?.data) ? json.data : []);
    } catch (error) {
      console.error('[AdminConnections] loadRequests error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleUpdateStatus = async (id: string, status: ConnectionRequest['status']) => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/connection-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        await loadRequests();
      } else {
        console.warn('[AdminConnections] update status failed', await res.json().catch(() => ({})));
        alert('Không thể cập nhật trạng thái yêu cầu kết nối.');
      }
    } catch (error) {
      console.error('[AdminConnections] update status exception', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái.');
    } finally {
      setIsUpdating(false);
    }
  };

  const summary = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((item) => item.status === 'pending').length;
    const accepted = requests.filter((item) => item.status === 'accepted').length;
    const rejected = requests.filter((item) => item.status === 'rejected').length;
    return { total, pending, accepted, rejected };
  }, [requests]);

  const filteredRequests = useMemo(() => {
    if (filter === 'all') return requests;
    return requests.filter((request) => request.status === filter);
  }, [requests, filter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/admin" className="inline-flex items-center text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại Dashboard
            </Link>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">Hộp thư kết nối</h1>
            <p className="text-sm text-gray-500">
              Quản lý yêu cầu kết nối giữa IZ, factory, supplier, buyer và investor.
            </p>
          </div>
          <button
            onClick={loadRequests}
            disabled={loading}
            className="inline-flex items-center space-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Tải lại</span>
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <div className="rounded-lg bg-white p-4 shadow">
            <p className="text-xs text-gray-500">Tổng yêu cầu</p>
            <p className="text-2xl font-semibold text-gray-900">{summary.total}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <p className="text-xs text-gray-500">Đang chờ xử lý</p>
            <p className="text-2xl font-semibold text-yellow-600">{summary.pending}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <p className="text-xs text-gray-500">Đã chấp nhận</p>
            <p className="text-2xl font-semibold text-green-600">{summary.accepted}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <p className="text-xs text-gray-500">Đã từ chối</p>
            <p className="text-2xl font-semibold text-red-600">{summary.rejected}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'accepted', 'rejected'] as ConnectionStatusFilter[]).map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === option
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option === 'all'
                  ? `Tất cả (${summary.total})`
                  : option === 'pending'
                  ? `Chờ xử lý (${summary.pending})`
                  : option === 'accepted'
                  ? `Đã chấp nhận (${summary.accepted})`
                  : `Đã từ chối (${summary.rejected})`}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Danh sách yêu cầu kết nối</h2>
            {isUpdating && <span className="text-xs text-gray-400">Đang cập nhật...</span>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Từ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đến
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nội dung
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className="font-semibold uppercase text-gray-900">{request.fromRole}</span>
                      <div className="text-xs text-gray-500">{request.fromUserId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className="font-semibold uppercase text-gray-900">{request.toRole}</span>
                      <div className="text-xs text-gray-500">{request.toUserId}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-sm">
                      {request.message || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {new Date(request.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.status === 'pending' && (
                        <span className="inline-flex items-center space-x-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
                          <Clock className="w-3 h-3" />
                          <span>Chờ xử lý</span>
                        </span>
                      )}
                      {request.status === 'accepted' && (
                        <span className="inline-flex items-center space-x-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Đã chấp nhận</span>
                        </span>
                      )}
                      {request.status === 'rejected' && (
                        <span className="inline-flex items-center space-x-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                          <XCircle className="w-3 h-3" />
                          <span>Đã từ chối</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {request.status === 'pending' ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdateStatus(request.id, 'accepted')}
                            className="text-green-600 hover:text-green-800"
                          >
                            Chấp nhận
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(request.id, 'rejected')}
                            className="text-red-600 hover:text-red-800"
                          >
                            Từ chối
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Không có hành động</span>
                      )}
                    </td>
                  </tr>
                ))}
                {!loading && filteredRequests.length === 0 && (
                  <tr>
                    <td className="px-6 py-6 text-sm text-gray-500 text-center" colSpan={6}>
                      Không có yêu cầu phù hợp với bộ lọc hiện tại.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {loading && (
            <div className="px-6 py-4 text-sm text-gray-500">Đang tải yêu cầu kết nối...</div>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Nhật ký xử lý gần đây</h2>
          <div className="space-y-2">
            {requests
              .filter((request) => request.status !== 'pending')
              .slice(0, 6)
              .map((request) => (
                <div
                  key={`${request.id}-history`}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-4 py-2 text-sm text-gray-600"
                >
                  <div className="flex items-center space-x-2">
                    <Link2 className="w-4 h-4 text-blue-500" />
                    <span>
                      {request.fromRole} → {request.toRole} •{' '}
                      {request.status === 'accepted' ? 'Đã chấp nhận' : 'Đã từ chối'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(request.updatedAt ?? request.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

