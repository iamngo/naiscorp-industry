'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  mockIndustrialZones,
  mockRegions,
  getVerifiedIZs,
  mockConsultants,
  getConsultantsByIndustry,
} from '@/lib/mockData';
import IZCard from '@/components/IZCard';
import {
  Briefcase,
  DollarSign,
  MapPin,
  TrendingUp,
  MessageSquare,
  Send,
  Bot,
  User,
  FileText,
  Phone,
  Mail,
  CalendarDays,
  Sparkles,
  Link as LinkIcon,
  Shield,
} from 'lucide-react';
import type { Consultant, IndustrialZone } from '@/types/database';

export default function InvestorPage() {
  const [budget, setBudget] = useState('');
  const [industry, setIndustry] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('');
  const [investmentType, setInvestmentType] = useState<'new' | 'acquisition' | 'partnership'>('new');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'bot'; message: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [planGenerated, setPlanGenerated] = useState(false);
  const [assignedConsultant, setAssignedConsultant] = useState<Consultant | null>(null);
  const [consultantStatus, setConsultantStatus] = useState<'pending' | 'contacted' | 'scheduled'>('pending');
  const [selectedMeetingSlot, setSelectedMeetingSlot] = useState<string>('');
  const [autoConnectLoading, setAutoConnectLoading] = useState(false);
  const [autoConnectResult, setAutoConnectResult] = useState<string | null>(null);
  const [decisionInsights, setDecisionInsights] = useState<Array<{ title: string; description: string; score: number }>>([]);
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [riskLevel, setRiskLevel] = useState<'Low' | 'Medium' | 'High' | null>(null);
  const [recommendedIZDetails, setRecommendedIZDetails] = useState<IndustrialZone[]>([]);
  const planSessionRef = useRef<string | null>(null);

  const logInvestmentEvent = useCallback(async (payload: Record<string, unknown>) => {
    try {
      await fetch('/api/analytics/investment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          planId: payload.planId ?? planSessionRef.current ?? undefined,
        }),
      });
    } catch (error) {
      console.error('Failed to log investment analytics', error);
    }
  }, []);

  const industries = ['Điện tử', 'Cơ khí', 'Dệt may', 'Hóa chất', 'Thực phẩm', 'Vật liệu xây dựng'];
  const provinces = Array.from(new Set(mockIndustrialZones.map((iz) => iz.province)));

  const findRegionName = (regionId?: string) => {
    if (!regionId) return undefined;
    const region = mockRegions.find((r) => r.id === regionId);
    return region?.name;
  };

  const buildDecisionInsights = (recommendedBudgetAvg: number) => {
    const numericBudget = parseInt(budget || '0', 10) || 0;
    const budgetScore = numericBudget === 0 ? 50 : Math.min(100, Math.round((numericBudget / (recommendedBudgetAvg || 1)) * 40 + 60));
    const locationScore = preferredLocation ? 90 : 70;
    const esgScore = recommendations.length > 0 ? 85 : 60;

    const insights = [
      {
        title: 'Mức độ phù hợp ngân sách',
        description: recommendedBudgetAvg
          ? `Ngân sách của bạn ${numericBudget.toLocaleString('vi-VN')} VND so với trung bình ${recommendedBudgetAvg.toLocaleString(
              'vi-VN',
            )} VND/nhà máy.`
          : 'Chưa có dữ liệu so sánh ngân sách. Vui lòng tham khảo thêm.',
        score: budgetScore,
      },
      {
        title: 'Khả năng đáp ứng vị trí',
        description: preferredLocation
          ? `Có ít nhất 1 KCN trong tỉnh/thành bạn ưu tiên.`
          : 'Bạn chưa chọn tỉnh/thành cụ thể, hệ thống đề xuất theo mức độ phù hợp chung.',
        score: locationScore,
      },
      {
        title: 'ESG & Chuyển đổi số',
        description: 'Các KCN đề xuất đã được xác thực ESG/DX, sẵn sàng cho nhà đầu tư quốc tế.',
        score: esgScore,
      },
    ];

    setDecisionInsights(insights);

    const avgScore = Math.round(insights.reduce((sum, item) => sum + item.score, 0) / insights.length);
    setOverallScore(avgScore);
    if (avgScore >= 85) {
      setRiskLevel('Low');
    } else if (avgScore >= 65) {
      setRiskLevel('Medium');
    } else {
      setRiskLevel('High');
    }
  };

  useEffect(() => {
    if (!planSessionRef.current || decisionInsights.length === 0) {
      return;
    }
    logInvestmentEvent({
      action: 'plan_insights',
      planId: planSessionRef.current,
      insights: decisionInsights,
      overallScore,
      riskLevel,
    });
  }, [decisionInsights, logInvestmentEvent, overallScore, riskLevel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const verifiedIZs = getVerifiedIZs();
      const recommendedIZObjects = verifiedIZs
        .filter((iz) => {
          if (industry && !iz.industries.includes(industry)) return false;
          if (preferredLocation && iz.province !== preferredLocation) return false;
          return true;
        })
        .slice(0, 5);

      const recommendedIds = recommendedIZObjects.map((iz) => iz.id);
      setRecommendations(recommendedIds);
      setRecommendedIZDetails(recommendedIZObjects);
      setIsSubmitting(false);
      setPlanGenerated(true);
      planSessionRef.current = `plan-${Date.now()}`;
      logInvestmentEvent({
        action: 'generate_plan',
        planId: planSessionRef.current,
        budget,
        industry,
        preferredLocation,
        investmentType,
        recommendations: recommendedIds,
      });

      const primaryRegionName = findRegionName(recommendedIZObjects[0]?.regionId);
      const consultantPool = getConsultantsByIndustry(industry, primaryRegionName);
      const consultantToAssign = consultantPool[0] || mockConsultants[0] || null;
      setAssignedConsultant(consultantToAssign);
      setConsultantStatus('pending');
      setSelectedMeetingSlot('');
      setAutoConnectResult(null);
      if (consultantToAssign) {
        logInvestmentEvent({
          action: 'assign_consultant',
          planId: planSessionRef.current,
          consultantId: consultantToAssign.id,
          consultantName: consultantToAssign.name,
        });
      }

      const averageEmployees =
        recommendedIZObjects.length > 0
          ? recommendedIZObjects.reduce((sum, iz) => sum + iz.totalEmployees, 0) / recommendedIZObjects.length
          : 0;
      buildDecisionInsights(Math.round((averageEmployees / 10) * 1000000));

      const baseMessage = `Xin chào! Tôi đã nhận được thông tin đầu tư của bạn. Ngân sách: ${
        parseInt(budget || '0', 10) ? parseInt(budget, 10).toLocaleString('vi-VN') : 'N/A'
      } VND, Ngành: ${industry || 'Không chỉ định'}, Địa điểm: ${preferredLocation || 'Không chỉ định'}, Loại: ${
        investmentType === 'new' ? 'Xây mới' : investmentType === 'acquisition' ? 'Mua lại' : 'Góp vốn'
      }. Tôi sẽ giúp bạn tìm khu công nghiệp phù hợp.`;

      const consultantMessage = consultantToAssign
        ? `Tôi đã gán chuyên gia ${consultantToAssign.name} (${consultantToAssign.title}). Họ sẽ liên hệ trong ${consultantToAssign.averageResponseTimeHours} giờ làm việc.`
        : 'Tạm thời chưa tìm được chuyên gia phù hợp, đội tư vấn sẽ liên hệ bổ sung.';

      setChatMessages([
        { role: 'bot', message: baseMessage },
        { role: 'bot', message: consultantMessage },
      ]);
    }, 1500);
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatMessages((prev) => [...prev, { role: 'user', message: userMessage }]);
    setChatInput('');
    logInvestmentEvent({
      action: 'chat_message',
      contentLength: userMessage.length,
    });

    setTimeout(() => {
      let botResponse = '';

      if (userMessage.toLowerCase().includes('ngân sách') || userMessage.toLowerCase().includes('budget')) {
        botResponse = `Dựa trên ngân sách ${
          parseInt(budget || '0', 10).toLocaleString('vi-VN')
        } VND, tôi có thể đề xuất các khu công nghiệp phù hợp. Bạn muốn đầu tư xây mới hay mua lại?`;
      } else if (userMessage.toLowerCase().includes('ngành') || userMessage.toLowerCase().includes('industry')) {
        botResponse = `Các ngành nghề phổ biến: ${industries.join(', ')}. Bạn quan tâm đến ngành nào cụ thể?`;
      } else if (userMessage.toLowerCase().includes('địa điểm') || userMessage.toLowerCase().includes('location')) {
        botResponse = `Các tỉnh/thành có khu công nghiệp: ${provinces.slice(0, 5).join(', ')} và nhiều hơn nữa. Bạn muốn đầu tư ở khu vực nào?`;
      } else if (userMessage.toLowerCase().includes('xác thực') || userMessage.toLowerCase().includes('verified')) {
        botResponse = 'Các khu công nghiệp đã xác thực có tick xanh và đã được kiểm tra về chất lượng hạ tầng, pháp lý.';
      } else if (userMessage.toLowerCase().includes('esg')) {
        botResponse = 'ESG (Environmental, Social, Governance) là tiêu chuẩn đánh giá về môi trường, xã hội và quản trị. Các KCN có tag ESG đã cam kết phát triển bền vững.';
      } else if (userMessage.toLowerCase().includes('chuyên gia') || userMessage.toLowerCase().includes('consultant')) {
        if (assignedConsultant) {
          botResponse = `Chuyên gia ${assignedConsultant.name} đang phụ trách hồ sơ của bạn. Bạn có thể liên hệ qua ${assignedConsultant.email} hoặc ${assignedConsultant.phone}.`;
        } else {
          botResponse = 'Hiện tại hệ thống đang tìm chuyên gia phù hợp. Vui lòng chờ trong giây lát.';
        }
      } else {
        botResponse = 'Cảm ơn bạn đã hỏi. Tôi có thể hỗ trợ về ngân sách, ngành nghề, địa điểm, xác thực, ESG và kết nối tự động.';
      }

      setChatMessages((prev) => [...prev, { role: 'bot', message: botResponse }]);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSend();
    }
  };

  const planSummary = useMemo(() => {
    return {
      budgetDisplay: budget ? `${Number(budget).toLocaleString('vi-VN')} VND` : 'N/A',
      industry: industry || 'Không chỉ định',
      location: preferredLocation || 'Không chỉ định',
      investmentType,
      insights: decisionInsights,
      overallScore,
      riskLevel,
      izs: recommendedIZDetails.map((iz, index) => ({
        index: index + 1,
        name: iz.name,
        province: iz.province,
        owner: iz.owner,
        esgStatus: iz.esgStatus,
        totalEmployees: iz.totalEmployees,
      })),
    };
  }, [
    budget,
    decisionInsights,
    industry,
    investmentType,
    overallScore,
    preferredLocation,
    recommendedIZDetails,
    riskLevel,
  ]);

  const handleDownloadPlan = useCallback(async () => {
    if (!planGenerated || planSummary.izs.length === 0) {
      alert('Vui lòng tạo kế hoạch đầu tư trước khi tải PDF.');
      return;
    }

    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Báo cáo kế hoạch đầu tư', 14, 20);

    doc.setFontSize(11);
    const overviewLines = doc.splitTextToSize(
      [
        `Ngân sách: ${planSummary.budgetDisplay}`,
        `Ngành ưu tiên: ${planSummary.industry}`,
        `Địa điểm ưu tiên: ${planSummary.location}`,
        `Loại đầu tư: ${
          investmentType === 'new' ? 'Xây mới' : investmentType === 'acquisition' ? 'Mua lại' : 'Góp vốn'
        }`,
        `Chỉ số phù hợp: ${
          planSummary.overallScore !== null ? `${planSummary.overallScore}/100` : 'Đang cập nhật'
        }`,
        `Mức độ rủi ro: ${planSummary.riskLevel ?? 'Đang cập nhật'}`,
      ].join('\n'),
      180,
    );
    doc.text(overviewLines, 14, 32);

    let y = 32 + overviewLines.length * 6 + 6;
    doc.setFontSize(12);
    doc.text('Danh sách khu công nghiệp đề xuất', 14, y);
    y += 8;
    doc.setFontSize(11);

    planSummary.izs.forEach((iz, idx) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      const lines = doc.splitTextToSize(
        `${iz.index}. ${iz.name} (${iz.province}) · Chủ đầu tư: ${iz.owner}. Nhân lực: ${
          iz.totalEmployees
        } · ESG: ${iz.esgStatus}`,
        180,
      );
      doc.text(lines, 14, y);
      y += lines.length * 6 + 4;
    });

    if (planSummary.insights.length > 0) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(12);
      doc.text('Phân tích & khuyến nghị', 14, y);
      y += 8;
      doc.setFontSize(11);
      planSummary.insights.forEach((insight) => {
        const lines = doc.splitTextToSize(
          `• ${insight.title} (${insight.score}/100): ${insight.description}`,
          180,
        );
        doc.text(lines, 14, y);
        y += lines.length * 6 + 4;
      });
    }

    doc.save(`investment-plan-${Date.now()}.pdf`);

    logInvestmentEvent({
      action: 'download_plan',
      planId: planSessionRef.current,
      recommendations,
      overallScore,
      riskLevel,
    });
  }, [
    investmentType,
    logInvestmentEvent,
    overallScore,
    planGenerated,
    planSummary,
    recommendations,
    riskLevel,
  ]);

  const handleConfirmMeeting = () => {
    if (!assignedConsultant || !selectedMeetingSlot) return;
    setConsultantStatus('scheduled');
    setChatMessages((prev) => [
      ...prev,
      {
        role: 'bot',
        message: `Đã đặt lịch với chuyên gia ${assignedConsultant.name} vào ${selectedMeetingSlot}. Đội ngũ sẽ gửi thư mời ngay sau đây.`,
      },
    ]);
    logInvestmentEvent({
      action: 'confirm_meeting',
      consultantId: assignedConsultant?.id,
      meetingSlot: selectedMeetingSlot,
    });
  };

  const handleAutoConnect = async () => {
    if (!recommendations.length) {
      setAutoConnectResult('Chưa có danh sách KCN đề xuất để kết nối tự động.');
      return;
    }

    setAutoConnectLoading(true);
    try {
      const results = await Promise.all(
        recommendations.map(async (izId) => {
          const iz = mockIndustrialZones.find((item) => item.id === izId);
          if (!iz) {
            return { success: false, name: 'Unknown' };
          }

          const res = await fetch('/api/connection-requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              toUserId: iz.userId,
              toRole: 'iz',
              message: `Nhà đầu tư quan tâm đến ${iz.name}. Vui lòng hỗ trợ lên lịch thảo luận (auto-connect).`,
            }),
          });

          return { success: res.ok, name: iz.name };
        }),
      );

      const successCount = results.filter((item) => item.success).length;
      setAutoConnectResult(`Đã gửi ${successCount}/${results.length} yêu cầu kết nối tự động (Mock data).`);
      logInvestmentEvent({
        action: 'auto_connect',
        planId: planSessionRef.current,
        success: successCount,
        total: results.length,
      });
    } catch (error) {
      setAutoConnectResult('Có lỗi xảy ra khi gửi yêu cầu kết nối (Mock data).');
      logInvestmentEvent({
        action: 'auto_connect_error',
        planId: planSessionRef.current,
        error: (error as Error)?.message ?? 'unknown_error',
      });
    } finally {
      setAutoConnectLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Investment Planning Portal</h1>
          <p className="text-gray-600">
            Nhập thông tin đầu tư của bạn, hệ thống AI sẽ đề xuất kế hoạch phù hợp
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Investment Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Thông tin đầu tư
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Ngân sách đầu tư (VND)
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Ví dụ: 1000000000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngành nghề quan tâm
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn ngành nghề</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Tỉnh/Thành phố ưu tiên
                  </label>
                  <select
                    value={preferredLocation}
                    onChange={(e) => setPreferredLocation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn tỉnh/thành</option>
                    {provinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại đầu tư
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="new"
                        checked={investmentType === 'new'}
                        onChange={(e) => setInvestmentType(e.target.value as 'new')}
                        className="mr-2"
                      />
                      Xây mới
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="acquisition"
                        checked={investmentType === 'acquisition'}
                        onChange={(e) => setInvestmentType(e.target.value as 'acquisition')}
                        className="mr-2"
                      />
                      Mua lại
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="partnership"
                        checked={investmentType === 'partnership'}
                        onChange={(e) => setInvestmentType(e.target.value as 'partnership')}
                        className="mr-2"
                      />
                      Góp vốn
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email liên hệ
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="0123456789"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5" />
                      <span>Nhận đề xuất</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Đề xuất Khu Công Nghiệp</h2>
                  {planGenerated && (
                    <button
                      onClick={handleDownloadPlan}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Tải PDF</span>
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  {recommendations.map((izId) => {
                    const iz = mockIndustrialZones.find((i) => i.id === izId);
                    return iz ? <IZCard key={iz.id} iz={iz} /> : null;
                  })}
                </div>

                <div className="border-t pt-4 mt-4">
                  <button
                    type="button"
                    onClick={handleAutoConnect}
                    disabled={autoConnectLoading}
                    className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400"
                  >
                    {autoConnectLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        <span>Đang gửi kết nối...</span>
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-4 h-4" />
                        <span>Kết nối tự động tới KCN đề xuất</span>
                      </>
                    )}
                  </button>
                  {autoConnectResult && (
                    <p className="mt-2 text-sm text-gray-600">{autoConnectResult}</p>
                  )}
                </div>
              </div>
            )}

            {/* Consultant Assignment */}
            {assignedConsultant && (
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span>Chuyên gia được gán</span>
                    </h2>
                    <p className="text-sm text-gray-600">
                      {assignedConsultant.title} · Tỉ lệ thành công {assignedConsultant.successRate}% · Phản hồi trong {assignedConsultant.averageResponseTimeHours} giờ
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      consultantStatus === 'scheduled'
                        ? 'bg-green-100 text-green-700'
                        : consultantStatus === 'contacted'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {consultantStatus === 'scheduled'
                      ? 'Đã đặt lịch'
                      : consultantStatus === 'contacted'
                      ? 'Đang liên hệ'
                      : 'Chờ xác nhận'}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Phone className="w-4 h-4" />
                      <span>{assignedConsultant.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Mail className="w-4 h-4" />
                      <span>{assignedConsultant.email}</span>
                    </div>
                    <div className="text-sm text-gray-500">Chuyên môn: {assignedConsultant.expertise.join(', ')}</div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-800 flex items-center space-x-2">
                      <CalendarDays className="w-4 h-4 text-blue-600" />
                      <span>Chọn khung giờ họp</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {assignedConsultant.availability.flatMap((slot) =>
                        slot.slots.map((time) => {
                          const label = `${slot.day} · ${time}`;
                          return (
                            <button
                              key={label}
                              type="button"
                              onClick={() => {
                                setSelectedMeetingSlot(label);
                                setConsultantStatus('contacted');
                              }}
                              className={`px-3 py-1 rounded-lg border text-xs ${
                                selectedMeetingSlot === label
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'border-gray-300 text-gray-700 hover:border-blue-500'
                              }`}
                            >
                              {label}
                            </button>
                          );
                        }),
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleConfirmMeeting}
                      disabled={!selectedMeetingSlot}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                    >
                      Xác nhận lịch hẹn
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Decision Support Insights */}
            {decisionInsights.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <span>AI Decision Support</span>
                  </h2>
                  {overallScore !== null && riskLevel && (
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Độ phù hợp tổng thể</div>
                      <div className="text-lg font-semibold text-gray-900">{overallScore}/100 · Rủi ro {riskLevel}</div>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {decisionInsights.map((insight) => (
                    <div key={insight.title} className="border border-gray-200 rounded-lg p-4">
                      <div className="text-sm font-semibold text-gray-900 mb-2">{insight.title}</div>
                      <p className="text-xs text-gray-600 mb-3">{insight.description}</p>
                      <div className="flex items-center space-x-2 text-sm font-semibold text-blue-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>{insight.score}/100</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chatbot Section */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col" style={{ height: '800px' }}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Chatbot Tư vấn AI
            </h2>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Xin chào! Tôi là chatbot tư vấn đầu tư AI.</p>
                  <p className="mt-2">Hãy điền form và gửi, hoặc chat với tôi để được tư vấn!</p>
                </div>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[80%] ${
                        msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {msg.role === 'user' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Chat Input */}
            <div className="flex space-x-2 border-t pt-4">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập câu hỏi..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleChatSend}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Gửi</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

