'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  mockFactories,
  mockServices,
  mockSuppliers,
  mockProducts,
  mockBuyerLeads,
  mockInvestorDeals,
  mockReportHighlights,
  mockRegions,
} from '@/lib/mockData';
import {
  Shield,
  CheckCircle,
  Clock,
  X,
  Building2,
  Filter,
  Users,
  Briefcase,
  BarChart3,
  FileText,
  UserCircle,
  Link2,
  Package,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import type {
  IndustrialZone,
  Factory,
  Product,
  Service,
  Supplier,
  ESGStatus,
  BuyerLead,
  InvestorDeal,
  InvestmentPlan,
  ContentItem,
} from '@/types/database';

export default function AdminDashboard() {
  const [izs, setIZs] = useState<IndustrialZone[]>([]);
  const [factories, setFactories] = useState<Factory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified'>('all');
  const [activeTab, setActiveTab] = useState<
    'iz' | 'factory' | 'services' | 'products' | 'supplier' | 'buyer' | 'investor' | 'users' | 'content' | 'reports'
  >('iz');
  const [showIZModal, setShowIZModal] = useState(false);
  const [newIZForm, setNewIZForm] = useState({
    name: '',
    owner: '',
    province: '',
    district: '',
    address: '',
    contactEmail: '',
    contactPhone: '',
    area: '',
    totalCompanies: '',
    totalEmployees: '',
    description: '',
    industries: '' as string | string[],
  });
  const [creatingIZ, setCreatingIZ] = useState(false);
  const [factorySearch, setFactorySearch] = useState('');
  const [factoryStatusFilter, setFactoryStatusFilter] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all');
  const [factoryIndustryFilter, setFactoryIndustryFilter] = useState<string>('all');
  const [factoryIZFilter, setFactoryIZFilter] = useState<string>('all');
  const [activeFactory, setActiveFactory] = useState<Factory | null>(null);
  const [showFactoryModal, setShowFactoryModal] = useState(false);
  const [activeIZ, setActiveIZ] = useState<IndustrialZone | null>(null);
  const [showIZLayoutModal, setShowIZLayoutModal] = useState(false);
  const [izLayoutForm, setIZLayoutForm] = useState({
    layoutMapUrl: '',
    layoutMapDescription: '',
  });
  const [factoryForm, setFactoryForm] = useState({
    description: '',
    productionCapacity: '',
    videoUrl: '',
    documentUrls: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [productSearch, setProductSearch] = useState('');
  const [productStatusFilter, setProductStatusFilter] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [productForm, setProductForm] = useState({
    description: '',
    price: '',
    minOrder: '',
    certifications: '',
    mediaUrls: '',
  });
  const [exportingReports, setExportingReports] = useState(false);
  const { language } = useLanguage();
  const t = useCallback(
    (vi: string, en: string) => (language === 'vi' ? vi : en),
    [language],
  );

  type UserAccount = {
    id: string;
    fullName: string;
    role: string;
    lastLogin: string;
    status: 'active' | 'invited';
  };

  const [buyerLeads, setBuyerLeads] = useState<BuyerLead[]>([]);

  const [investorDeals, setInvestorDeals] = useState<InvestorDeal[]>([]);

  const [investmentPlans, setInvestmentPlans] = useState<InvestmentPlan[]>([]);

  const [userAccounts] = useState<UserAccount[]>([
    {
      id: 'user-1',
      fullName: 'Admin System',
      role: 'Admin',
      lastLogin: '11/10/2025 10:24',
      status: 'active',
    },
    {
      id: 'user-2',
      fullName: 'Nguyễn Tấn Tài',
      role: 'Verifier',
      lastLogin: '11/09/2025 21:05',
      status: 'active',
    },
    {
      id: 'user-3',
      fullName: 'Lê Quỳnh Trang',
      role: 'Content Editor',
      lastLogin: '11/08/2025 08:11',
      status: 'invited',
    },
  ]);

  const [contentQueue, setContentQueue] = useState<ContentItem[]>([]);

  const [roleMatrix, setRoleMatrix] = useState(
    [
      {
        role: 'Admin',
        permissions: {
          manageIZ: true,
          manageFactories: true,
          manageMarketplace: true,
          manageContent: true,
          exportReports: true,
        },
      },
      {
        role: 'Verifier',
        permissions: {
          manageIZ: true,
          manageFactories: true,
          manageMarketplace: false,
          manageContent: false,
          exportReports: true,
        },
      },
      {
        role: 'Content Editor',
        permissions: {
          manageIZ: false,
          manageFactories: false,
          manageMarketplace: false,
          manageContent: true,
          exportReports: false,
        },
      },
    ] as Array<{
      role: string;
      permissions: {
        manageIZ: boolean;
        manageFactories: boolean;
        manageMarketplace: boolean;
        manageContent: boolean;
        exportReports: boolean;
      };
    }>,
  );

  const esgOptions: { value: ESGStatus; label: string }[] = useMemo(
    () => [
      { value: 'none', label: t('Không', 'None') },
      { value: 'environmental', label: t('Environmental', 'Environmental') },
      { value: 'social', label: t('Social', 'Social') },
      { value: 'governance', label: t('Governance', 'Governance') },
      { value: 'all', label: t('ESG toàn diện', 'Full ESG') },
    ],
    [t],
  );

  const fetchIZs = useCallback(async () => {
    const response = await fetch('/api/industrial-zones', {
      cache: 'no-store',
    }).catch(() => null);
    if (!response || !response.ok) {
      return [];
    }
    const json = await response.json();
    return Array.isArray(json?.data) ? json.data : [];
  }, []);

  const fetchFactories = useCallback(async () => {
    const response = await fetch('/api/factories', {
      cache: 'no-store',
    }).catch(() => null);
    if (!response || !response.ok) {
      return mockFactories;
    }
    const json = await response.json();
    return Array.isArray(json?.data) ? json.data : mockFactories;
  }, []);

  const fetchServices = useCallback(async () => {
    const response = await fetch('/api/services', {
      cache: 'no-store',
    }).catch(() => null);
    if (!response || !response.ok) {
      return mockServices;
    }
    const json = await response.json();
    return Array.isArray(json?.data) ? json.data : mockServices;
  }, []);

  const fetchSuppliers = useCallback(async () => {
    const response = await fetch('/api/suppliers', { cache: 'no-store' }).catch(() => null);
    if (!response || !response.ok) {
      return mockSuppliers;
    }
    const json = await response.json();
    return Array.isArray(json?.data) ? json.data : mockSuppliers;
  }, []);

  const fetchProducts = useCallback(async () => {
    const response = await fetch('/api/products', { cache: 'no-store' }).catch(() => null);
    if (!response || !response.ok) {
      return mockProducts;
    }
    const json = await response.json();
    return Array.isArray(json?.data) ? json.data : mockProducts;
  }, []);

  const fetchBuyerPipeline = useCallback(async () => {
    const response = await fetch('/api/buyer-leads', { cache: 'no-store' }).catch(() => null);
    if (!response || !response.ok) {
      return mockBuyerLeads;
    }
    const json = await response.json();
    return Array.isArray(json?.data) ? json.data : mockBuyerLeads;
  }, []);

  const fetchInvestorPipeline = useCallback(async () => {
    const response = await fetch('/api/investor-deals', { cache: 'no-store' }).catch(() => null);
    if (!response || !response.ok) {
      return mockInvestorDeals;
    }
    const json = await response.json();
    return Array.isArray(json?.data) ? json.data : mockInvestorDeals;
  }, []);

  const fetchInvestmentPlans = useCallback(async () => {
    const response = await fetch('/api/investment-plans', { cache: 'no-store' }).catch(() => null);
    if (!response || !response.ok) {
      return [];
    }
    const json = await response.json();
    return Array.isArray(json?.data) ? json.data : [];
  }, []);

  const fetchContentItems = useCallback(async () => {
    const response = await fetch('/api/content-items', { cache: 'no-store' }).catch(() => null);
    if (!response || !response.ok) {
      return [];
    }
    const json = await response.json();
    return Array.isArray(json?.data) ? json.data : [];
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadDashboardData = async () => {
      if (!cancelled) {
        setLoading(true);
      }

      try {
        const [
          izData,
          factoryData,
          serviceData,
          productData,
          supplierData,
          buyerData,
          investorData,
          planData,
          contentData,
        ] =
          await Promise.all([
          fetchIZs(),
          fetchFactories(),
            fetchServices(),
            fetchProducts(),
            fetchSuppliers(),
            fetchBuyerPipeline(),
            fetchInvestorPipeline(),
            fetchInvestmentPlans(),
            fetchContentItems(),
        ]);

        if (cancelled) return;

        setIZs(izData);
        setFactories(factoryData);
        setServices(serviceData);
        setProducts(productData);
        setSuppliers(supplierData);
        setBuyerLeads(buyerData);
        setInvestorDeals(investorData);
        setInvestmentPlans(planData);
        setContentQueue(contentData);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      cancelled = true;
    };
  }, [
    fetchBuyerPipeline,
    fetchContentItems,
    fetchFactories,
    fetchIZs,
    fetchInvestorPipeline,
    fetchInvestmentPlans,
    fetchProducts,
    fetchSuppliers,
    fetchServices,
  ]);

  const handleVerify = async (izId: string, status: 'verified' | 'rejected') => {
    try {
      const res = await fetch(`/api/industrial-zones/${izId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationStatus: status,
          verifiedAt: status === 'verified' ? new Date().toISOString() : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIZs(prev =>
          prev.map(iz => (iz.id === izId && data?.data ? data.data : iz)),
        );
        const latestIZs = await fetchIZs();
        setIZs(latestIZs);
        alert(
          status === 'verified'
            ? t('Đã xác thực khu công nghiệp (mock data)', 'Zone marked as verified (mock data)')
            : t('Đã từ chối khu công nghiệp (mock data)', 'Zone marked as rejected (mock data)'),
        );
      }
    } catch {
      alert(t('Có lỗi xảy ra', 'An error occurred'));
    }
  };

  const handleVerifyFactory = async (factoryId: string, status: 'verified' | 'rejected') => {
    try {
      console.log('[AdminDashboard] verify factory', { factoryId, status });
      const res = await fetch(`/api/factories/${factoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationStatus: status,
          verifiedAt: status === 'verified' ? new Date().toISOString() : undefined,
        }),
      });

      if (!res.ok) {
        const errorPayload = await res.json().catch(() => ({}));
        console.error('[AdminDashboard] verify factory failed', {
          statusCode: res.status,
          errorPayload,
        });
        alert(
          t(
            'Có lỗi xảy ra khi cập nhật trạng thái nhà máy',
            'Failed to update factory status',
          ),
        );
        return;
      }

      const json = await res.json();
      if (json?.data) {
        setFactories((prev) => prev.map((factory) => (factory.id === factoryId ? json.data : factory)));
      }

      alert(
        status === 'verified'
          ? t('Đã xác thực nhà máy', 'Factory verified')
          : t('Đã từ chối nhà máy', 'Factory rejected'),
      );
    } catch (error) {
      console.error('[AdminDashboard] verify factory failed', error);
      alert(
        t(
          'Có lỗi xảy ra khi cập nhật trạng thái nhà máy',
          'Failed to update factory status',
        ),
      );
    }
  };

  const handleSaveFactoryDetails = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeFactory) return;

    try {
      const payload = {
        description: factoryForm.description,
        productionCapacity: factoryForm.productionCapacity,
        videoUrl: factoryForm.videoUrl || undefined,
        documentUrls: factoryForm.documentUrls
          ? factoryForm.documentUrls.split(',').map((item) => item.trim()).filter(Boolean)
          : undefined,
        contactEmail: factoryForm.contactEmail,
        contactPhone: factoryForm.contactPhone,
        updatedAt: new Date().toISOString(),
      };

      const res = await fetch(`/api/factories/${activeFactory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error('[AdminDashboard] save factory failed', { statusCode: res.status });
        alert(t('Không thể lưu thay đổi nhà máy', 'Unable to save factory changes'));
        return;
      }

      const json = await res.json();
      if (json?.data) {
        setFactories((prev) => prev.map((item) => (item.id === activeFactory.id ? json.data : item)));
      }

      setShowFactoryModal(false);
      setActiveFactory(null);
    } catch (error) {
      console.error('[AdminDashboard] save factory failed', error);
      alert(t('Không thể lưu thay đổi nhà máy', 'Unable to save factory changes'));
    }
  };

  const handleSaveProductDetails = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeProduct) return;

    try {
      const payload = {
        description: productForm.description,
        price: Number(productForm.price) || activeProduct.price,
        minOrder: Number(productForm.minOrder) || activeProduct.minOrder,
        certifications: productForm.certifications
          ? productForm.certifications.split(',').map((item) => item.trim()).filter(Boolean)
          : undefined,
        mediaUrls: productForm.mediaUrls
          ? productForm.mediaUrls.split(',').map((item) => item.trim()).filter(Boolean)
          : undefined,
        updatedAt: new Date().toISOString(),
      };

      const res = await fetch(`/api/products/${activeProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error('[AdminDashboard] save product failed', { statusCode: res.status });
        alert(t('Không thể lưu thay đổi sản phẩm', 'Unable to save product changes'));
        return;
      }

      const json = await res.json();
      if (json?.data) {
        setProducts((prev) => prev.map((item) => (item.id === activeProduct.id ? json.data : item)));
      }

      setShowProductModal(false);
      setActiveProduct(null);
    } catch (error) {
      console.error('[AdminDashboard] save product failed', error);
      alert(t('Không thể lưu thay đổi sản phẩm', 'Unable to save product changes'));
    }
  };

  const handleInvestmentPlanUpdate = async (planId: string, updates: Partial<InvestmentPlan>) => {
    try {
      const payload = {
        ...updates,
        advisorId: updates.advisorId === '' ? undefined : updates.advisorId,
        updatedAt: new Date().toISOString(),
      };

      const res = await fetch(`/api/investment-plans/${planId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error('[AdminDashboard] update investment plan failed', { statusCode: res.status });
        alert(t('Không thể cập nhật kế hoạch đầu tư', 'Unable to update investment plan'));
        return;
      }

      const json = await res.json();
      if (json?.data) {
        setInvestmentPlans((prev) => prev.map((plan) => (plan.id === planId ? json.data : plan)));
      }
    } catch (error) {
      console.error('[AdminDashboard] update investment plan failed', error);
      alert(t('Không thể cập nhật kế hoạch đầu tư', 'Unable to update investment plan'));
    }
  };

  const handleExportReportsPDF = async () => {
    setExportingReports(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      const timestamp = new Date().toLocaleString('vi-VN');

      doc.setFontSize(14);
      doc.text('Vietnam Industrial Supply Chain - Báo cáo CMS', 14, 18);
      doc.setFontSize(10);
      doc.text(`Generated at: ${timestamp}`, 14, 26);

      let y = 36;
      doc.setFontSize(12);
      doc.text('Tổng quan marketplace', 14, y);
      doc.setFontSize(10);
      y += 6;
      doc.text(`- Tổng sản phẩm: ${products.length}`, 14, y);
      y += 6;
      doc.text(`- Tổng lượt xem: ${analyticsSnapshot.totalProductViews}`, 14, y);
      y += 6;
      doc.text(`- Tỉ lệ phản hồi trung bình: ${analyticsSnapshot.avgResponseRate}%`, 14, y);
      y += 6;

      doc.setFontSize(12);
      doc.text('Pipeline & kế hoạch đầu tư', 14, y + 4);
      y += 10;
      doc.setFontSize(10);
      planStatusBreakdown.forEach((item) => {
        doc.text(`- ${item.status}: ${item.count}`, 14, y);
        y += 6;
      });
      doc.text(`- Tổng Buyer Leads: ${buyerLeads.length}`, 14, y);
      y += 6;
      doc.text(`- Tổng cơ hội (opportunities): ${analyticsSnapshot.totalLeads}`, 14, y);
      y += 8;

      doc.setFontSize(12);
      doc.text('Phân bổ khu công nghiệp theo vùng', 14, y);
      y += 8;
      doc.setFontSize(10);
      regionSummary.forEach((region) => {
        doc.text(
          `- ${region.name}: ${region.izCount} KCN · ${region.employeeTotal.toLocaleString('vi-VN')} lao động`,
          14,
          y,
        );
        y += 6;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });

      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(12);
      doc.text('Top ngành trọng điểm', 14, y);
      y += 8;
      doc.setFontSize(10);
      industrySummary.forEach((industry) => {
        doc.text(`- ${industry.industry}: ${industry.count} KCN`, 14, y);
        y += 6;
      });

      doc.save('naiscorp-cms-report.pdf');
    } catch (error) {
      console.error('[AdminDashboard] export report pdf failed', error);
      alert(t('Không thể xuất PDF, vui lòng thử lại.', 'Unable to export PDF, please try again.'));
    } finally {
      setExportingReports(false);
    }
  };

  const handleExportReportsCSV = () => {
    const rows: string[][] = [
      ['Metric', 'Value'],
      ['Total Products', products.length.toString()],
      ['Total Product Views', analyticsSnapshot.totalProductViews.toString()],
      ['Average Response Rate (%)', analyticsSnapshot.avgResponseRate.toString()],
      ['Total Buyer Leads', buyerLeads.length.toString()],
      ['Total Opportunities', analyticsSnapshot.totalLeads.toString()],
      ['Scheduled Content Items', analyticsSnapshot.scheduledContent.toString()],
    ];

    rows.push(['', '']);
    rows.push(['Investment Plan Status', 'Count']);
    planStatusBreakdown.forEach((item) => rows.push([item.status, item.count.toString()]));

    rows.push(['', '']);
    rows.push(['Region', 'KCN Count', 'Employees']);
    regionSummary.forEach((region) =>
      rows.push([region.name, region.izCount.toString(), region.employeeTotal.toString()]),
    );

    rows.push(['', '']);
    rows.push(['Industry', 'KCN Count']);
    industrySummary.forEach((industry) => rows.push([industry.industry, industry.count.toString()]));

    const csvContent = rows
      .map((row) => row.map((cell = '') => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const tempLink = document.createElement('a');
    tempLink.href = url;
    tempLink.setAttribute('download', 'naiscorp-cms-report.csv');
    tempLink.click();
    URL.revokeObjectURL(url);
  };

  const filteredIZs = izs.filter(iz => {
    if (filter === 'pending') return iz.verificationStatus === 'pending';
    if (filter === 'verified') return iz.verificationStatus === 'verified';
    return true;
  });

  const factoryIndustries = useMemo(() => {
    const set = new Set<string>();
    factories.forEach((factory) => factory.industries.forEach((industry) => set.add(industry)));
    return Array.from(set);
  }, [factories]);

  const contentTypeLabels: Record<ContentItem['type'], string> = {
    news: 'Bài viết',
    banner: 'Banner',
    event: 'Sự kiện',
    page: 'Trang',
  };

  const filteredFactories = useMemo(() => {
    return factories.filter((factory) => {
      const matchesSearch =
        factory.name.toLowerCase().includes(factorySearch.toLowerCase()) ||
        factory.description.toLowerCase().includes(factorySearch.toLowerCase());
      const matchesStatus =
        factoryStatusFilter === 'all' || factory.verificationStatus === factoryStatusFilter;
      const matchesIndustry =
        factoryIndustryFilter === 'all' || factory.industries.includes(factoryIndustryFilter);
      const matchesIZ = factoryIZFilter === 'all' || factory.izId === factoryIZFilter;
      return matchesSearch && matchesStatus && matchesIndustry && matchesIZ;
    });
  }, [factories, factorySearch, factoryStatusFilter, factoryIndustryFilter, factoryIZFilter]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        product.description.toLowerCase().includes(productSearch.toLowerCase());
      const matchesStatus =
        productStatusFilter === 'all' || product.verificationStatus === productStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [products, productSearch, productStatusFilter]);

  const regionSummary = useMemo(() => {
    const distribution = new Map<
      string,
      {
        id: string;
        name: string;
        izCount: number;
        employeeTotal: number;
      }
    >();

    izs.forEach((iz) => {
      const region = mockRegions.find((item) => item.id === iz.regionId);
      const key = region?.id ?? 'unknown';
      if (!distribution.has(key)) {
        distribution.set(key, {
          id: key,
          name: region?.name ?? 'Khác',
          izCount: 0,
          employeeTotal: 0,
        });
      }
      const entry = distribution.get(key)!;
      entry.izCount += 1;
      entry.employeeTotal += iz.totalEmployees ?? 0;
    });

    return Array.from(distribution.values()).sort((a, b) => b.izCount - a.izCount);
  }, [izs]);

  const industrySummary = useMemo(() => {
    const counts = new Map<string, number>();
    izs.forEach((iz) => {
      iz.industries.forEach((industry) => {
        counts.set(industry, (counts.get(industry) ?? 0) + 1);
      });
    });

    return Array.from(counts.entries())
      .map(([industry, count]) => ({ industry, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [izs]);

  const analyticsSnapshot = useMemo(() => {
    const totalProductViews = products.reduce((sum, product) => sum + (product.viewCount ?? 0), 0);
    const avgResponseRate =
      products.length > 0
        ? Math.round(
            (products.reduce((sum, product) => sum + (product.responseRate ?? 0), 0) / products.length) * 100,
          )
        : 0;
    const totalLeads = buyerLeads.reduce((sum, lead) => sum + (lead.opportunities ?? 0), 0);
    const scheduledContent = contentQueue.filter((item) => item.status === 'scheduled').length;
    return {
      totalProductViews,
      avgResponseRate,
      totalLeads,
      scheduledContent,
    };
  }, [products, buyerLeads, contentQueue]);

  const planStatusBreakdown = useMemo(() => {
    const counts = new Map<InvestmentPlan['status'], number>();
    investmentPlans.forEach((plan) => {
      counts.set(plan.status, (counts.get(plan.status) ?? 0) + 1);
    });
    return Array.from(counts.entries()).map(([status, count]) => ({ status, count }));
  }, [investmentPlans]);

  const planStatusLabels: Record<InvestmentPlan['status'], string> = {
    draft: 'Nháp',
    submitted: 'Đã gửi',
    reviewed: 'Đã duyệt',
    closed: 'Đã đóng',
  };

  const handleVerifyProduct = async (productId: string, status: 'verified' | 'rejected') => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationStatus: status,
          verifiedBy: 'user-1',
          verifiedAt: status === 'verified' ? new Date().toISOString() : undefined,
        }),
      });
      if (!res.ok) {
        alert(
          t(
            'Có lỗi xảy ra khi cập nhật sản phẩm',
            'Failed to update product',
          ),
        );
        return;
      }
      const json = await res.json();
      const updated: Product | undefined = json?.data;
      if (updated) {
        setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));
      }
      alert(
        status === 'verified'
          ? t('Đã xác thực sản phẩm', 'Product verified')
          : t('Đã từ chối sản phẩm', 'Product rejected'),
      );
    } catch (error) {
      console.error('[AdminDashboard] verify product failed', error);
      alert(t('Có lỗi xảy ra', 'An error occurred'));
    }
  };

  const handleVerifyService = async (serviceId: string, status: 'verified' | 'rejected') => {
    try {
      const res = await fetch(`/api/services/${serviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationStatus: status,
          verifiedBy: 'user-1',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setServices(prev =>
          prev.map(s => (s.id === serviceId && data?.data ? data.data : s)),
        );
        const latestServices = await fetchServices();
        setServices(latestServices);
        alert(
          status === 'verified'
            ? t('Đã xác thực dịch vụ (mock data)', 'Service verified (mock data)')
            : t('Đã từ chối dịch vụ (mock data)', 'Service rejected (mock data)'),
        );
      }
    } catch {
      alert(t('Có lỗi xảy ra', 'An error occurred'));
    }
  };

  const handleUpdateServiceBadge = async (serviceId: string, isStrategic: boolean) => {
    try {
      const res = await fetch(`/api/services/${serviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isStrategicPartner: isStrategic }),
      });

      if (!res.ok) {
        alert(t('Không thể cập nhật badge dịch vụ', 'Unable to update service badge'));
        return;
      }

      const json = await res.json();
      if (json?.data) {
        setServices((prev) => prev.map((item) => (item.id === serviceId ? json.data : item)));
      }
    } catch (error) {
      console.error('[AdminDashboard] update service badge failed', error);
      alert(t('Không thể cập nhật badge dịch vụ', 'Unable to update service badge'));
    }
  };

  const handleUpdateServiceIZ = async (serviceId: string, izId: string, checked: boolean) => {
    const service = services.find((item) => item.id === serviceId);
    if (!service) return;

    const nextIZs = new Set(service.izIds ?? []);
    if (checked) {
      nextIZs.add(izId);
    } else {
      nextIZs.delete(izId);
    }

    try {
      const res = await fetch(`/api/services/${serviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ izIds: Array.from(nextIZs), updatedAt: new Date().toISOString() }),
      });

      if (!res.ok) {
        alert(
          t(
            'Không thể cập nhật liên kết KCN cho dịch vụ',
            'Unable to update IZ linkage for service',
          ),
        );
        return;
      }

      const json = await res.json();
      if (json?.data) {
        setServices((prev) => prev.map((item) => (item.id === serviceId ? json.data : item)));
      }
    } catch (error) {
      console.error('[AdminDashboard] update service iz failed', error);
      alert(
        t(
          'Không thể cập nhật liên kết KCN cho dịch vụ',
          'Unable to update IZ linkage for service',
        ),
      );
    }
  };

  const handleUpdateIZEsg = async (izId: string, esgStatus: ESGStatus) => {
    try {
      const res = await fetch(`/api/industrial-zones/${izId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ esgStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setIZs((prev) => prev.map((iz) => (iz.id === izId && data?.data ? data.data : iz)));
      }
    } catch (error) {
      console.error('[AdminDashboard] update IZ ESG failed', error);
      alert(t('Không thể cập nhật ESG cho KCN.', 'Unable to update IZ ESG status.'));
    }
  };

  const handleToggleIZDX = async (izId: string, digitalTransformation: boolean) => {
    try {
      const res = await fetch(`/api/industrial-zones/${izId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ digitalTransformation }),
      });
      if (res.ok) {
        const data = await res.json();
        setIZs((prev) => prev.map((iz) => (iz.id === izId && data?.data ? data.data : iz)));
      }
    } catch (error) {
      console.error('[AdminDashboard] toggle IZ DX failed', error);
      alert(
        t(
          'Không thể cập nhật trạng thái chuyển đổi số cho KCN.',
          'Unable to update IZ digital transformation status.',
        ),
      );
    }
  };

  const handleUpdateFactoryESG = async (factoryId: string, esgStatus: ESGStatus) => {
    try {
      const res = await fetch(`/api/factories/${factoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ esgStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setFactories((prev) => prev.map((factory) => (factory.id === factoryId && data?.data ? data.data : factory)));
      }
    } catch (error) {
      console.error('[AdminDashboard] update factory ESG failed', error);
      alert(t('Không thể cập nhật ESG cho nhà máy.', 'Unable to update factory ESG status.'));
    }
  };

  const handleToggleFactoryDX = async (factoryId: string, digitalTransformation: boolean) => {
    try {
      const res = await fetch(`/api/factories/${factoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ digitalTransformation }),
      });
      if (res.ok) {
        const data = await res.json();
        setFactories((prev) => prev.map((factory) => (factory.id === factoryId && data?.data ? data.data : factory)));
      }
    } catch (error) {
      console.error('[AdminDashboard] toggle factory DX failed', error);
      alert(
        t(
          'Không thể cập nhật trạng thái chuyển đổi số cho nhà máy.',
          'Unable to update factory digital transformation status.',
        ),
      );
    }
  };

  const handleUpdateSupplierStatus = (supplierId: string, status: 'verified' | 'pending') => {
    fetch(`/api/suppliers/${supplierId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        verificationStatus: status,
        verifiedAt: status === 'verified' ? new Date().toISOString() : undefined,
        updatedAt: new Date().toISOString(),
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json?.data) {
          setSuppliers((prev) => prev.map((supplier) => (supplier.id === supplierId ? json.data : supplier)));
        }
        alert(t('Cập nhật trạng thái nhà cung cấp thành công', 'Supplier status updated'));
      })
      .catch((error) => {
        console.error('[AdminDashboard] update supplier status failed', error);
        alert(
          t(
            'Có lỗi xảy ra khi cập nhật nhà cung cấp',
            'Failed to update supplier',
          ),
        );
      });
  };

  const handleToggleSupplierStrategic = (supplierId: string) => {
    const supplier = suppliers.find((item) => item.id === supplierId);
    if (!supplier) return;

    fetch(`/api/suppliers/${supplierId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        isStrategicPartner: !supplier.isStrategicPartner,
        updatedAt: new Date().toISOString(),
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json?.data) {
          setSuppliers((prev) => prev.map((item) => (item.id === supplierId ? json.data : item)));
        }
      })
      .catch((error) => {
        console.error('[AdminDashboard] toggle supplier strategic failed', error);
        alert(t('Không thể cập nhật badge nhà cung cấp', 'Unable to update supplier badge'));
      });
  };

  const handleBuyerStageChange = (leadId: string, stage: BuyerLead['stage']) => {
    fetch(`/api/buyer-leads/${leadId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stage,
        lastContact: new Date().toISOString(),
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json?.data) {
          setBuyerLeads((prev) => prev.map((lead) => (lead.id === leadId ? json.data : lead)));
        }
      })
      .catch((error) => {
        console.error('[AdminDashboard] update buyer stage failed', error);
        alert(
          t(
            'Không thể cập nhật trạng thái buyer lead',
            'Unable to update buyer lead status',
          ),
        );
      });
  };

  const handleInvestorStatusChange = (dealId: string, status: InvestorDeal['status']) => {
    fetch(`/api/investor-deals/${dealId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json?.data) {
          setInvestorDeals((prev) => prev.map((deal) => (deal.id === dealId ? json.data : deal)));
        }
      })
      .catch((error) => {
        console.error('[AdminDashboard] update investor status failed', error);
        alert(
          t(
            'Không thể cập nhật trạng thái nhà đầu tư',
            'Unable to update investor status',
          ),
        );
      });
  };

  const handleInvestorOwnerChange = (dealId: string, owner: string) => {
    fetch(`/api/investor-deals/${dealId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ owner }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json?.data) {
          setInvestorDeals((prev) => prev.map((deal) => (deal.id === dealId ? json.data : deal)));
        }
      })
      .catch((error) => {
        console.error('[AdminDashboard] update investor owner failed', error);
        alert(t('Không thể cập nhật owner', 'Unable to update owner'));
      });
  };

  const handleOpenIZLayoutModal = (iz: IndustrialZone) => {
    setActiveIZ(iz);
    setIZLayoutForm({
      layoutMapUrl: iz.layoutMapUrl ?? '',
      layoutMapDescription: iz.layoutMapDescription ?? '',
    });
    setShowIZLayoutModal(true);
  };

  const handleSaveIZLayout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeIZ) return;

    try {
      const payload = {
        layoutMapUrl: izLayoutForm.layoutMapUrl || undefined,
        layoutMapDescription: izLayoutForm.layoutMapDescription || undefined,
        updatedAt: new Date().toISOString(),
      };

      const res = await fetch(`/api/industrial-zones/${activeIZ.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorPayload = await res.json().catch(() => ({}));
        console.error('[AdminDashboard] save IZ layout failed', { status: res.status, errorPayload });
        alert(t('Không thể lưu layout KCN, vui lòng thử lại.', 'Unable to save IZ layout, please try again.'));
        return;
      }

      const json = await res.json();
      if (json?.data) {
        setIZs((prev) => prev.map((item) => (item.id === activeIZ.id ? json.data : item)));
      }

      setShowIZLayoutModal(false);
      setActiveIZ(null);
    } catch (error) {
      console.error('[AdminDashboard] save IZ layout failed', error);
      alert(t('Không thể lưu layout KCN, vui lòng thử lại.', 'Unable to save IZ layout, please try again.'));
    }
  };

  const handleContentStatusUpdate = (contentId: string, status: ContentItem['status']) => {
    fetch(`/api/content-items/${contentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        updatedAt: new Date().toISOString(),
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json?.data) {
          setContentQueue((prev) => prev.map((item) => (item.id === contentId ? json.data : item)));
        }
      })
      .catch((error) => {
        console.error('[AdminDashboard] update content status failed', error);
      alert(t('Không thể cập nhật nội dung', 'Unable to update content item'));
      });
  };

  const handleContentSchedule = (contentId: string, date: string) => {
    fetch(`/api/content-items/${contentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scheduledAt: date,
        status: 'scheduled',
        updatedAt: new Date().toISOString(),
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json?.data) {
          setContentQueue((prev) => prev.map((item) => (item.id === contentId ? json.data : item)));
        }
      })
      .catch((error) => {
        console.error('[AdminDashboard] schedule content failed', error);
      alert(t('Không thể cập nhật lịch nội dung', 'Unable to update content schedule'));
      });
  };

  const handleRolePermissionToggle = (
    role: string,
    permission: keyof (typeof roleMatrix)[number]['permissions'],
  ) => {
    setRoleMatrix((prev) =>
      prev.map((entry) =>
        entry.role === role
          ? {
              ...entry,
              permissions: {
                ...entry.permissions,
                [permission]: !entry.permissions[permission],
              },
            }
          : entry,
      ),
    );
  };

  const resetNewIZForm = () => {
    setNewIZForm({
      name: '',
      owner: '',
      province: '',
      district: '',
      address: '',
      contactEmail: '',
      contactPhone: '',
      area: '',
      totalCompanies: '',
      totalEmployees: '',
      description: '',
      industries: '',
    });
  };

  const handleCreateIZ = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreatingIZ(true);
    try {
      const response = await fetch('/api/industrial-zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newIZForm.name,
          owner: newIZForm.owner,
          province: newIZForm.province,
          district: newIZForm.district,
          address: newIZForm.address,
          contactEmail: newIZForm.contactEmail,
          contactPhone: newIZForm.contactPhone,
          area: Number(newIZForm.area) || 0,
          totalCompanies: Number(newIZForm.totalCompanies) || 0,
          totalEmployees: Number(newIZForm.totalEmployees) || 0,
          description: newIZForm.description,
          industries:
            typeof newIZForm.industries === 'string'
              ? newIZForm.industries
                  .split(',')
                  .map((item) => item.trim())
                  .filter(Boolean)
              : newIZForm.industries,
          verificationStatus: 'pending',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create IZ');
      }

      const json = await response.json();
      if (json?.data) {
        setIZs((prev) => [json.data, ...prev]);
      }
      resetNewIZForm();
      setShowIZModal(false);
      alert(t('Đã ghi nhận đăng ký KCN mới, chờ xác minh.', 'New IZ registration submitted for review.'));
    } catch (error) {
      console.error('[AdminDashboard] create IZ failed', error);
      alert(t('Không thể tạo KCN mới, vui lòng thử lại.', 'Unable to create new IZ, please try again.'));
    } finally {
      setCreatingIZ(false);
    }
  };

  const stats = {
    total: izs.length,
    verified: izs.filter(iz => iz.verificationStatus === 'verified').length,
    pending: izs.filter(iz => iz.verificationStatus === 'pending').length,
    rejected: izs.filter(iz => iz.verificationStatus === 'rejected').length,
    totalFactories: factories.length,
    verifiedFactories: factories.filter(f => f.verificationStatus === 'verified').length,
    pendingFactories: factories.filter(f => f.verificationStatus === 'pending').length,
    totalProducts: products.length,
    pendingProducts: products.filter(p => p.verificationStatus === 'pending').length,
    totalServices: services.length,
    pendingServices: services.filter(s => s.verificationStatus === 'pending').length,
  };

  const supplierStatsSnapshot = {
    total: suppliers.length,
    verified: suppliers.filter((supplier) => supplier.verificationStatus === 'verified').length,
    pending: suppliers.filter((supplier) => supplier.verificationStatus === 'pending').length,
    strategic: suppliers.filter((supplier) => supplier.isStrategicPartner).length,
  };

  const contentStats = {
    pending: contentQueue.filter((item) => item.status === 'pending').length,
    scheduled: contentQueue.filter((item) => item.status === 'scheduled').length,
    published: contentQueue.filter((item) => item.status === 'published').length,
  };

  const dashboardTrends = useMemo(() => {
    const highlightTranslations: Record<string, { vi: string; en: string }> = {
      'Leads mới tuần này': { vi: 'Leads mới tuần này', en: 'New leads this week' },
      'RFQ đang mở': { vi: 'RFQ đang mở', en: 'Open RFQs' },
      'Cuộc gọi tư vấn đã đặt': { vi: 'Cuộc gọi tư vấn đã đặt', en: 'Consultation calls booked' },
    };

    const baseHighlights = mockReportHighlights.map((item) => ({
      title: language === 'vi'
        ? highlightTranslations[item.title]?.vi ?? item.title
        : highlightTranslations[item.title]?.en ?? item.title,
      value: item.value,
      change: item.change,
    }));

    return [
      ...baseHighlights,
      {
        title: t('Tổng lượt xem sản phẩm', 'Total product views'),
        value: analyticsSnapshot.totalProductViews.toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US'),
        change: t(`Phản hồi TB: ${analyticsSnapshot.avgResponseRate}%`, `Avg response: ${analyticsSnapshot.avgResponseRate}%`),
      },
      {
        title: t('Nội dung đã lên lịch', 'Scheduled content'),
        value: analyticsSnapshot.scheduledContent.toString(),
        change: t('Content queue', 'Content queue'),
      },
    ];
  }, [analyticsSnapshot, language, t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                {t('Bảng điều khiển quản trị', 'Admin Dashboard')}
              </h1>
            </div>
            <LanguageSwitcher />
          </div>
          <p className="text-gray-600">
            {t(
              'Quản trị và thống kê hệ thống Vietnam Industrial Supply Chain',
              'Monitor and manage the Vietnam Industrial Supply Chain platform.',
            )}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/admin/connections"
                  className="inline-flex items-center space-x-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 hover:border-blue-400 hover:text-blue-700"
                >
                  <Link2 className="w-4 h-4" />
                  <span>{t('Inbox kết nối', 'Connections inbox')}</span>
                </Link>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center space-x-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <Package className="w-4 h-4" />
                  <span>{t('Xem Marketplace', 'View Marketplace')}</span>
                </Link>
              </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('iz')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'iz'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('Khu công nghiệp', 'Industrial zones')} ({stats.total})
            </button>
            <button
              onClick={() => setActiveTab('factory')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'factory'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('Nhà máy', 'Factories')} ({stats.totalFactories})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'products'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('Sản phẩm', 'Products')} ({stats.totalProducts})
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'services'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('Dịch vụ', 'Services')} ({stats.totalServices})
            </button>
            <button
              onClick={() => setActiveTab('supplier')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'supplier'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('Nhà cung cấp', 'Suppliers')} ({supplierStatsSnapshot.total})
            </button>
            <button
              onClick={() => setActiveTab('buyer')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'buyer'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('Buyer Leads', 'Buyer leads')} ({buyerLeads.length})
            </button>
            <button
              onClick={() => setActiveTab('investor')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'investor'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('Nhà đầu tư', 'Investors')} ({investorDeals.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'users'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('Người dùng', 'Users')} ({userAccounts.length})
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'content'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('Nội dung', 'Content')} ({contentQueue.length})
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'reports'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('Báo cáo', 'Reports')}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('Tổng KCN', 'Total IZs')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('Đã xác thực', 'Verified')}</p>
                <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('Chờ xác thực', 'Pending verification')}</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('Đã từ chối', 'Rejected')}</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <X className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('Nhà cung cấp', 'Suppliers')}</p>
                <p className="text-2xl font-bold text-gray-900">{supplierStatsSnapshot.total}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('Đối tác chiến lược', 'Strategic partners')}</p>
                <p className="text-2xl font-bold text-purple-600">{supplierStatsSnapshot.strategic}</p>
              </div>
              <Briefcase className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('Sản phẩm chờ duyệt', 'Products pending review')}</p>
                <p className="text-2xl font-bold text-blue-600">{stats.pendingProducts}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('Nội dung chờ duyệt', 'Content pending')}</p>
                <p className="text-2xl font-bold text-amber-600">{contentStats.pending}</p>
              </div>
              <FileText className="w-8 h-8 text-amber-600" />
            </div>
          </div>
        </div>

        {/* Filter */}
        {activeTab === 'iz' && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <Filter className="w-5 h-5 text-gray-500" />
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('Tất cả', 'All')} ({stats.total})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('Chờ xác thực', 'Pending')} ({stats.pending})
              </button>
              <button
                onClick={() => setFilter('verified')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'verified'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('Đã xác thực', 'Verified')} ({stats.verified})
              </button>
              <div className="ml-auto flex items-center">
                <button
                  onClick={() => setShowIZModal(true)}
                  className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <span>{t('Đăng ký KCN mới', 'Register new IZ')}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'iz' && (
          <>
            {/* IZ List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Danh sách Khu Công Nghiệp</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Tên KCN', 'Industrial zone')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Tỉnh/Thành', 'Province')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Trạng thái', 'Status')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ESG
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        DX
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Layout', 'Layout')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Thao tác', 'Actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredIZs.map((iz) => (
                      <tr key={iz.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{iz.name}</div>
                          <div className="text-sm text-gray-500">{iz.owner}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{iz.province}</div>
                          <div className="text-sm text-gray-500">{iz.district}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {iz.verificationStatus === 'verified' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {t('Đã xác thực', 'Verified')}
                            </span>
                          )}
                          {iz.verificationStatus === 'pending' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Clock className="w-3 h-3 mr-1" />
                              {t('Chờ xác thực', 'Pending')}
                            </span>
                          )}
                          {iz.verificationStatus === 'rejected' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <X className="w-3 h-3 mr-1" />
                              {t('Đã từ chối', 'Rejected')}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <select
                            value={iz.esgStatus}
                            onChange={(e) => handleUpdateIZEsg(iz.id, e.target.value as ESGStatus)}
                            className="rounded border border-gray-200 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                          >
                            {esgOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleToggleIZDX(iz.id, !iz.digitalTransformation)}
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              iz.digitalTransformation
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            {iz.digitalTransformation ? 'Enabled' : 'Disabled'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {iz.layoutMapUrl ? (
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => window.open(iz.layoutMapUrl, '_blank')}
                                className="text-blue-600 hover:text-blue-800 text-xs"
                              >
                                {t('Xem layout', 'View layout')}
                              </button>
                              <button
                                onClick={() => handleOpenIZLayoutModal(iz)}
                                className="text-gray-600 hover:text-gray-800 text-xs"
                              >
                                {t('Cập nhật', 'Update')}
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleOpenIZLayoutModal(iz)}
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              {t('Thêm layout', 'Add layout')}
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {iz.verificationStatus === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleVerify(iz.id, 'verified')}
                                className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                              >
                                <CheckCircle className="w-4 h-4" />
                                  <span>{t('Duyệt', 'Approve')}</span>
                              </button>
                              <button
                                onClick={() => handleVerify(iz.id, 'rejected')}
                                className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                              >
                                <X className="w-4 h-4" />
                                  <span>{t('Từ chối', 'Reject')}</span>
                              </button>
                            </div>
                          )}
                          <a
                            href={`/iz/${iz.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                              {t('Xem chi tiết', 'View details')}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'factory' && (
          <>
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Filter className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder={t('Tìm kiếm nhà máy...', 'Search factories...')}
                  value={factorySearch}
                  onChange={(e) => setFactorySearch(e.target.value)}
                  className="rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
                <select
                  value={factoryStatusFilter}
                  onChange={(e) => setFactoryStatusFilter(e.target.value as typeof factoryStatusFilter)}
                  className="rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">{t('Tất cả trạng thái', 'All statuses')}</option>
                  <option value="verified">{t('Đã xác thực', 'Verified')}</option>
                  <option value="pending">{t('Chờ xác thực', 'Pending')}</option>
                  <option value="rejected">{t('Đã từ chối', 'Rejected')}</option>
                </select>
                <select
                  value={factoryIndustryFilter}
                  onChange={(e) => setFactoryIndustryFilter(e.target.value)}
                  className="rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">{t('Tất cả ngành', 'All industries')}</option>
                  {factoryIndustries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
                <select
                  value={factoryIZFilter}
                  onChange={(e) => setFactoryIZFilter(e.target.value)}
                  className="rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">{t('Tất cả KCN', 'All IZs')}</option>
                  {izs.map((iz) => (
                    <option key={iz.id} value={iz.id}>
                      {iz.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {t('Danh sách Nhà máy', 'Factory directory')}
                </h2>
                <span className="text-sm text-gray-500">
                  {t('Hiển thị', 'Showing')} {filteredFactories.length}/{factories.length}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Tên nhà máy', 'Factory')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('KCN', 'IZ')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Trạng thái', 'Status')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ESG
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        DX
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Thao tác', 'Actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFactories.map((factory) => (
                      <tr key={factory.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{factory.name}</div>
                          <div className="text-xs text-gray-500">{factory.address}</div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {factory.industries.map((industry) => (
                              <span
                                key={industry}
                                className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600"
                              >
                                {industry}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {izs.find((iz) => iz.id === factory.izId)?.name ?? factory.izId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {factory.verificationStatus === 'verified' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {t('Đã xác thực', 'Verified')}
                            </span>
                          )}
                          {factory.verificationStatus === 'pending' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Clock className="w-3 h-3 mr-1" />
                              {t('Chờ xác thực', 'Pending')}
                            </span>
                          )}
                          {factory.verificationStatus === 'rejected' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              <X className="w-3 h-3 mr-1" />
                              {t('Đã từ chối', 'Rejected')}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <select
                            value={factory.esgStatus}
                            onChange={(e) => handleUpdateFactoryESG(factory.id, e.target.value as ESGStatus)}
                            className="rounded border border-gray-200 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                          >
                            {esgOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleToggleFactoryDX(factory.id, !factory.digitalTransformation)}
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              factory.digitalTransformation
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            {factory.digitalTransformation
                              ? t('Đang bật', 'Enabled')
                              : t('Chưa bật', 'Disabled')}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-y-1">
                          {factory.verificationStatus === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleVerifyFactory(factory.id, 'verified')}
                                className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span>{t('Duyệt', 'Approve')}</span>
                              </button>
                              <button
                                onClick={() => handleVerifyFactory(factory.id, 'rejected')}
                                className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                              >
                                <X className="w-4 h-4" />
                                <span>{t('Từ chối', 'Reject')}</span>
                              </button>
                            </div>
                          )}
                          <button
                            onClick={() => {
                              setActiveFactory(factory);
                              setFactoryForm({
                                description: factory.description ?? '',
                                productionCapacity: factory.productionCapacity ?? '',
                                videoUrl: factory.videoUrl ?? '',
                                documentUrls: Array.isArray(factory.documentUrls)
                                  ? factory.documentUrls.join(', ')
                                  : '',
                                contactEmail: factory.contactEmail ?? '',
                                contactPhone: factory.contactPhone ?? '',
                              });
                              setShowFactoryModal(true);
                            }}
                            className="block text-blue-600 hover:text-blue-900"
                          >
                            {t('Chỉnh sửa', 'Edit')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'products' && (
          <>
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Filter className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder={t('Tìm kiếm sản phẩm...', 'Search products...')}
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
                <select
                  value={productStatusFilter}
                  onChange={(e) => setProductStatusFilter(e.target.value as typeof productStatusFilter)}
                  className="rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">{t('Tất cả trạng thái', 'All statuses')}</option>
                  <option value="verified">{t('Đã xác thực', 'Verified')}</option>
                  <option value="pending">{t('Chờ duyệt', 'Pending')}</option>
                  <option value="rejected">{t('Đã từ chối', 'Rejected')}</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{t('Danh sách Sản phẩm', 'Product catalogue')}</h2>
                <span className="text-sm text-gray-500">
                  {t('Hiển thị', 'Showing')} {filteredProducts.length}/{products.length}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Sản phẩm', 'Product')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Nhà cung cấp', 'Supplier')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Giá', 'Price')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Hiệu suất', 'Performance')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Trạng thái', 'Status')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Thao tác', 'Actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500 line-clamp-1">{product.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {suppliers.find((supplier) => supplier.id === product.supplierId)?.companyName ||
                            product.supplierId ||
                            '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {product.price.toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')} VND / {product.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="space-y-1 text-xs text-gray-600">
                            <div>{t('Lượt xem', 'Views')}: {product.viewCount ?? 0}</div>
                            <div>
                              {t('Tỉ lệ phản hồi', 'Response rate')}: {product.responseRate != null ? Math.round(product.responseRate * 100) : 0}%
                            </div>
                            <div>{t('Leads', 'Leads')}: {product.leadCount ?? 0}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.verificationStatus === 'verified' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {t('Đã xác thực', 'Verified')}
                            </span>
                          )}
                          {product.verificationStatus === 'pending' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Clock className="w-3 h-3 mr-1" />
                              {t('Chờ duyệt', 'Pending')}
                            </span>
                          )}
                          {product.verificationStatus === 'rejected' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              <X className="w-3 h-3 mr-1" />
                              {t('Đã từ chối', 'Rejected')}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleVerifyProduct(product.id, 'verified')}
                            className="text-green-600 hover:text-green-900"
                          >
                            {t('Duyệt', 'Approve')}
                          </button>
                          <button
                            onClick={() => handleVerifyProduct(product.id, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                          >
                            {t('Từ chối', 'Reject')}
                          </button>
                          <button
                            onClick={() => {
                              setActiveProduct(product);
                              setProductForm({
                                description: product.description ?? '',
                                price: product.price.toString(),
                                minOrder: product.minOrder.toString(),
                                certifications: Array.isArray(product.certifications)
                                  ? product.certifications.join(', ')
                                  : '',
                                mediaUrls: Array.isArray(product.mediaUrls)
                                  ? product.mediaUrls.join(', ')
                                  : '',
                              });
                              setShowProductModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {t('Chỉnh sửa', 'Edit')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'services' && (
          <>
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('Tất cả', 'All')} ({stats.totalServices})
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'pending'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('Chờ duyệt', 'Pending')} ({stats.pendingServices})
                </button>
                <button
                  onClick={() => setFilter('verified')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'verified'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('Đã duyệt', 'Approved')} ({stats.totalServices - stats.pendingServices})
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  {t('Danh sách dịch vụ công nghiệp', 'Industrial services directory')}
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Dịch vụ', 'Service')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Loại hình', 'Category')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('KCN đang áp dụng', 'Linked IZs')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Chỉ số', 'Metrics')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Trạng thái', 'Status')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Thao tác', 'Actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {services.map((service) => (
                      <tr key={service.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{service.title}</div>
                          <div className="text-xs text-gray-500 line-clamp-1">{service.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {service.serviceType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex flex-wrap gap-2">
                            {izs.map((iz) => {
                              const checked = (service.izIds ?? []).includes(iz.id);
                              return (
                                <label key={iz.id} className="inline-flex items-center gap-1 rounded border border-gray-200 px-2 py-1 text-xs">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(e) => handleUpdateServiceIZ(service.id, iz.id, e.target.checked)}
                                    className="h-3 w-3"
                                  />
                                  <span>{iz.name}</span>
                                </label>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex flex-col gap-1">
                            <span>{t('Phản hồi', 'Response time')}: {service.responseTimeHours ?? 0}h</span>
                            <span>{t('Hợp đồng đã ký', 'Contracts signed')}: {service.contractsSigned ?? 0}</span>
                            <span>{t('Đánh giá TB', 'Average rating')}: {service.averageEvaluation ?? 0}/5</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {service.verificationStatus === 'verified' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" /> {t('Đã duyệt', 'Approved')}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Clock className="w-3 h-3 mr-1" /> {t('Chờ duyệt', 'Pending')}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-y-1">
                          {service.verificationStatus === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleVerifyService(service.id, 'verified')}
                                className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span>{t('Duyệt', 'Approve')}</span>
                              </button>
                              <button
                                onClick={() => handleVerifyService(service.id, 'rejected')}
                                className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                              >
                                <X className="w-4 h-4" />
                                <span>{t('Từ chối', 'Reject')}</span>
                              </button>
                            </div>
                          )}
                          {service.verificationStatus === 'verified' && (
                            <button
                              onClick={() => handleUpdateServiceBadge(service.id, !service.isStrategicPartner)}
                              className={`text-xs px-2 py-1 rounded ${
                                service.isStrategicPartner
                                  ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {service.isStrategicPartner ? t('Bỏ badge', 'Remove badge') : t('Gắn badge', 'Add badge')}
                            </button>
                          )}
                          <a href={`/services`} className="text-blue-600 hover:text-blue-900">
                            {t('Xem chi tiết', 'View details')}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'supplier' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {t('Quản lý Nhà cung cấp', 'Supplier management')}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {t(
                  'Theo dõi trạng thái xác thực, chứng nhận ESG/DX và gắn badge chiến lược cho đối tác trọng điểm.',
                  'Track verification status, ESG/DX certifications and assign strategic badges.',
                )}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Nhà cung cấp', 'Supplier')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Ngành chính', 'Industries')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Chứng nhận', 'Certifications')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Hiệu suất', 'Performance')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Trạng thái', 'Status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Liên hệ', 'Contact')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Thao tác', 'Actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {suppliers.map((supplier) => (
                    <tr key={supplier.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{supplier.companyName}</div>
                        <div className="text-xs text-gray-500">
                          {t('Sản phẩm nổi bật', 'Key products')}: {supplier.products.slice(0, 2).join(', ') || '—'}
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                          <span>{t('Đánh giá', 'Rating')}: {(supplier.rating ?? 0).toFixed(1)} ⭐</span>
                          <span>{t('Tỉ lệ phản hồi', 'Response rate')}: {Math.round((supplier.responseRate ?? 0) * 100)}%</span>
                          <span>
                            {t('Hoạt động gần nhất', 'Last active')}:{' '}
                            {supplier.lastActiveAt
                              ? new Date(supplier.lastActiveAt).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')
                              : '—'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {supplier.industries.map((industry) => (
                            <span
                              key={industry}
                              className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600"
                            >
                              {industry}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {supplier.certifications && supplier.certifications.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {supplier.certifications.map((cert) => (
                              <span
                                key={cert}
                                className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600"
                              >
                                {cert}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">{t('Chưa cập nhật', 'Not provided')}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex flex-col gap-1">
                          <span>{t('Thời gian phản hồi', 'Response time')}: {supplier.responseTimeHours ?? 0}h</span>
                          <span>{t('Tỉ lệ giao đúng hạn', 'On-time delivery')}: {supplier.onTimeDeliveryRate ?? 0}%</span>
                          <span>{t('Ngôn ngữ', 'Languages')}: {(supplier.languages || []).join(', ') || '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {supplier.verificationStatus === 'verified' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" /> {t('Đã xác thực', 'Verified')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="w-3 h-3 mr-1" /> {t('Chờ duyệt', 'Pending')}
                          </span>
                        )}
                        {supplier.isStrategicPartner && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            ⭐ {t('Đối tác chiến lược', 'Strategic Partner')}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div>{supplier.contactEmail}</div>
                        <div>{supplier.contactPhone}</div>
                        <div className="text-xs text-gray-400">
                          {t('Trụ sở', 'Headquarters')}: {supplier.headquarters || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-y-1">
                        <button
                          onClick={() => handleUpdateSupplierStatus(supplier.id, supplier.verificationStatus === 'verified' ? 'pending' : 'verified')}
                          className="block text-blue-600 hover:text-blue-900"
                        >
                          {supplier.verificationStatus === 'verified'
                            ? t('Chuyển về chờ duyệt', 'Move to pending')
                            : t('Duyệt hồ sơ', 'Approve profile')}
                        </button>
                        <button
                          onClick={() => handleToggleSupplierStrategic(supplier.id)}
                          className="block text-purple-600 hover:text-purple-800"
                        >
                          {supplier.isStrategicPartner
                            ? t('Bỏ badge đối tác', 'Remove partner badge')
                            : t('Gắn badge đối tác', 'Add partner badge')}
                        </button>
                        <a href={`/supplier/${supplier.id}`} className="block text-gray-600 hover:text-gray-800 text-sm">
                          {t('Xem hồ sơ →', 'View profile →')}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'buyer' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {t('Pipeline Buyer Leads', 'Buyer leads pipeline')}
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {buyerLeads.map((lead) => (
                <div key={lead.id} className="rounded-lg border border-gray-100 p-4 hover:border-blue-200 hover:shadow transition">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{lead.company}</h3>
                      <p className="text-xs text-gray-500">
                        {t('Ngành quan tâm', 'Interested industries')}: {lead.industries.join(', ')}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                        lead.stage === 'Đã ký'
                          ? 'bg-green-100 text-green-700'
                          : lead.stage === 'Đàm phán'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {lead.stage}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                    <span>
                      {t('Cơ hội mở', 'Open opportunities')}: <strong>{lead.opportunities}</strong>
                    </span>
                    <span>
                      {t('Liên hệ gần nhất', 'Last contact')}:{' '}
                      {new Date(lead.lastContact).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {t('Giá trị pipeline', 'Pipeline value')}: {(lead.value / 1_000_000).toFixed(1)}M USD
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500">{t('Cập nhật trạng thái:', 'Update stage:')}</span>
                      {(['Đang quan tâm', 'Đàm phán', 'Đã ký'] as const).map((stage) => (
                        <button
                          key={stage}
                          onClick={() => handleBuyerStageChange(lead.id, stage)}
                          className={`rounded-full px-2.5 py-1 ${
                            lead.stage === stage
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {stage}
                        </button>
                      ))}
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      {t('Xem chi tiết lead →', 'View lead details →')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'investor' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {t('Pipeline Nhà đầu tư', 'Investor pipeline')}
              </h2>
              <div className="space-y-4">
                {investorDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="rounded-lg border border-gray-100 p-4 hover:border-emerald-200 hover:shadow transition"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{deal.fundName}</h3>
                        <p className="text-xs text-gray-500">
                          {t('Trọng tâm', 'Focus')}: {deal.focus.join(', ')}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-emerald-600">{deal.budget}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 uppercase">{t('Owner', 'Owner')}</span>
                        <input
                          value={deal.owner}
                          onChange={(e) => handleInvestorOwnerChange(deal.id, e.target.value)}
                          className="rounded border border-gray-200 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                          deal.status === 'Ký NDA'
                            ? 'bg-green-100 text-green-700'
                            : deal.status === 'Hẹn gặp'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {deal.status}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-gray-500">{t('Cập nhật trạng thái:', 'Update stage:')}</span>
                      {(['Đánh giá', 'Hẹn gặp', 'Ký NDA'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => handleInvestorStatusChange(deal.id, status)}
                          className={`rounded-full px-2.5 py-1 ${
                            deal.status === status
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {t('Kế hoạch đầu tư gửi từ portal', 'Investment plans from portal')}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {t(
                      'Duyệt kế hoạch, gán chuyên viên tư vấn và theo dõi tiến trình.',
                      'Review plans, assign advisors, and monitor progress.',
                    )}
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  {investmentPlans.length} {t('kế hoạch', 'plans')}
                </span>
              </div>

              {investmentPlans.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                  {t(
                    'Chưa có kế hoạch nào được gửi từ Investment Portal.',
                    'No plans submitted from the Investment Portal yet.',
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {investmentPlans.map((plan) => (
                    <div key={plan.id} className="rounded-lg border border-gray-100 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">
                            {t('Đề xuất ngân sách', 'Budget proposal')}{' '}
                            {plan.budget.toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')} VND
                          </h3>
                          <p className="text-xs text-gray-500">
                            {t('Ngành ưu tiên', 'Preferred industries')}: {plan.preferredIndustries.join(', ') || '—'} |{' '}
                            {t('Khu vực', 'Locations')}: {plan.preferredLocations.join(', ') || '—'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {(['draft', 'submitted', 'reviewed', 'closed'] as InvestmentPlan['status'][]).map((status) => (
                            <button
                              key={status}
                              onClick={() => handleInvestmentPlanUpdate(plan.id, { status })}
                              className={`rounded-full px-2.5 py-1 text-xs capitalize ${
                                plan.status === status
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="text-xs font-semibold text-gray-500 uppercase">
                            {t('Đề xuất KCN', 'Suggested IZs')}
                          </span>
                          <div className="mt-1">
                            {plan.recommendations.izIds.length > 0
                              ? plan.recommendations.izIds
                                  .map((izId) => izs.find((iz) => iz.id === izId)?.name || izId)
                                  .join(', ')
                              : '—'}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-gray-500 uppercase">
                            {t('Nhà cung cấp gợi ý', 'Suggested suppliers')}
                          </span>
                          <div className="mt-1">
                            {plan.recommendations.supplierIds.length > 0
                              ? plan.recommendations.supplierIds
                                  .map((supplierId) =>
                                    suppliers.find((supplier) => supplier.id === supplierId)?.companyName || supplierId,
                                  )
                                  .join(', ')
                              : '—'}
                          </div>
                        </div>
                      </div>
                      {plan.recommendations.rationale && (
                        <div className="mt-3 text-xs text-gray-500">
                          {t('Lý do đề xuất', 'Recommendation rationale')}: {plan.recommendations.rationale}
                        </div>
                      )}
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 uppercase">Chuyên viên phụ trách</span>
                          <input
                            value={plan.advisorId ?? ''}
                            onChange={(e) => handleInvestmentPlanUpdate(plan.id, { advisorId: e.target.value })}
                            placeholder="advisor-id"
                            className="rounded border border-gray-200 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        {plan.planDocument && (
                          <a
                            href={plan.planDocument}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Tải PDF kế hoạch
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Quản lý người dùng & phân quyền</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người dùng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vai trò
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lần đăng nhập gần nhất
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userAccounts.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <UserCircle className="w-5 h-5 text-blue-500" />
                          <span className="text-sm font-medium text-gray-900">{user.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.lastLogin}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.status === 'active' ? (
                          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                            Hoạt động
                          </span>
                        ) : (
                          <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
                            Đã mời
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Ma trận phân quyền</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase text-gray-500">
                      <th className="px-3 py-2">Vai trò</th>
                      <th className="px-3 py-2">Quản lý KCN</th>
                      <th className="px-3 py-2">Quản lý Nhà máy</th>
                      <th className="px-3 py-2">Marketplace</th>
                      <th className="px-3 py-2">Nội dung</th>
                      <th className="px-3 py-2">Xuất báo cáo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roleMatrix.map((entry) => (
                      <tr key={entry.role} className="odd:bg-white even:bg-gray-100">
                        <td className="px-3 py-2 font-medium text-gray-800">{entry.role}</td>
                        {(['manageIZ', 'manageFactories', 'manageMarketplace', 'manageContent', 'exportReports'] as const).map(
                          (permission) => (
                            <td key={permission} className="px-3 py-2">
                              <label className="inline-flex items-center gap-2 text-xs text-gray-600">
                                <input
                                  type="checkbox"
                                  checked={entry.permissions[permission]}
                                  onChange={() => handleRolePermissionToggle(entry.role, permission)}
                                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span>{entry.permissions[permission] ? 'Có' : 'Không'}</span>
                              </label>
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Content queue</h2>
              <p className="text-sm text-gray-500">Quản lý phiên bản nội dung, lịch đăng và phân quyền phê duyệt.</p>
            </div>
            <div className="space-y-4">
              {contentQueue.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-gray-100 p-4 hover:border-amber-200 hover:shadow transition"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-xs text-gray-500">
                        Loại nội dung: {contentTypeLabels[item.type]} • Phiên bản hiện tại: v{item.version}
                      </p>
                      {item.scheduledAt && (
                        <p className="text-xs text-amber-600 mt-1">
                          Lịch đăng: {new Date(item.scheduledAt).toLocaleDateString('vi-VN')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                          item.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : item.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {item.status === 'published'
                          ? 'Đã xuất bản'
                          : item.status === 'scheduled'
                          ? 'Đã lên lịch'
                          : 'Chờ duyệt'}
                      </span>
                      <select
                        value={item.status}
                        onChange={(e) => handleContentStatusUpdate(item.id, e.target.value as ContentItem['status'])}
                        className="rounded border border-gray-200 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                      >
                        <option value="pending">Chờ duyệt</option>
                        <option value="scheduled">Đã lên lịch</option>
                        <option value="published">Đã xuất bản</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <div>
                      Cập nhật lần cuối: {new Date(item.updatedAt).toLocaleString('vi-VN')}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Gán lịch:</span>
                      <input
                        type="date"
                        value={item.scheduledAt ?? ''}
                        onChange={(e) => handleContentSchedule(item.id, e.target.value)}
                        className="rounded border border-gray-200 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {item.history && item.history.length > 0 && (
                    <div className="mt-4 rounded-lg bg-gray-50 p-3">
                      <div className="text-xs font-semibold text-gray-600 mb-2">Lịch sử phiên bản</div>
                      <div className="space-y-1 text-xs text-gray-600">
                        {item.history
                          .sort((a, b) => b.version - a.version)
                          .map((history) => (
                            <div key={`${item.id}-history-${history.version}`} className="flex justify-between">
                              <span>
                                v{history.version} • {new Date(history.updatedAt).toLocaleString('vi-VN')} • {history.updatedBy}
                              </span>
                              {history.notes && <span className="text-gray-500">{history.notes}</span>}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Báo cáo nhanh</h2>
              <p className="text-sm text-gray-500">
                Tóm tắt hoạt động toàn hệ thống trong tuần. Các biểu đồ chi tiết sẽ được kết nối với BI trong giai đoạn tiếp theo.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={handleExportReportsPDF}
                disabled={exportingReports}
                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                Xuất báo cáo PDF
              </button>
              <button
                onClick={handleExportReportsCSV}
                className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Xuất dữ liệu CSV/Excel
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {dashboardTrends.map((item) => (
                <div key={item.title} className="rounded-lg border border-gray-100 p-4">
                  <p className="text-sm text-gray-500">{item.title}</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">{item.value}</p>
                  <p className="text-xs text-green-600">{item.change}</p>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="rounded-lg border border-gray-100 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Phân bổ KCN theo vùng</h3>
                <div className="space-y-3">
                  {regionSummary.length > 0 ? (
                    regionSummary.map((region) => {
                      const percent =
                        izs.length > 0 ? Math.round((region.izCount / izs.length) * 100) : 0;
                      return (
                        <div key={region.id}>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{region.name}</span>
                            <span>{region.izCount} KCN</span>
                          </div>
                          <div className="h-2 rounded-full bg-blue-100">
                            <div
                              className="h-2 rounded-full bg-blue-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <div className="mt-1 text-xs text-gray-400">
                            ≈ {region.employeeTotal.toLocaleString('vi-VN')} lao động
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-gray-500">Chưa có dữ liệu vùng.</p>
                  )}
                </div>
              </div>
              <div className="rounded-lg border border-gray-100 p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Top ngành trọng điểm</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {industrySummary.length > 0 ? (
                      industrySummary.map((industry) => (
                        <li key={industry.industry} className="flex items-center justify-between">
                          <span>{industry.industry}</span>
                          <span className="text-xs text-gray-400">{industry.count} KCN</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-gray-500">Chưa có dữ liệu ngành.</li>
                    )}
                  </ul>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Trạng thái kế hoạch đầu tư</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    {planStatusBreakdown.length > 0 ? (
                      planStatusBreakdown.map((status) => (
                        <div key={status.status} className="flex items-center justify-between">
                          <span>{planStatusLabels[status.status] || status.status}</span>
                          <span className="text-xs text-gray-400">{status.count}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500">Chưa có kế hoạch nào được gửi.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="rounded-lg border border-gray-100 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Biểu đồ phân bổ Verification</h3>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>KCN đã xác thực</span>
                      <span>{stats.verified}</span>
                    </div>
                    <div className="h-2 rounded-full bg-blue-100">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${stats.total ? (stats.verified / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Supplier chiến lược</span>
                      <span>{supplierStatsSnapshot.strategic}</span>
                    </div>
                    <div className="h-2 rounded-full bg-purple-100">
                      <div
                        className="h-2 rounded-full bg-purple-500"
                        style={{ width: `${supplierStatsSnapshot.total ? (supplierStatsSnapshot.strategic / supplierStatsSnapshot.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-gray-100 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Kênh nguồn Leads</h3>
                <p className="text-xs text-gray-500 mb-3">
                  Tổng cơ hội: {analyticsSnapshot.totalLeads.toLocaleString('vi-VN')}
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex justify-between">
                    <span>Marketplace RFQ</span>
                    <span>45%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Investment Portal</span>
                    <span>35%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sự kiện & hội thảo</span>
                    <span>14%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Khác</span>
                    <span>6%</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {showIZModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
          <div className="w-full max-w-3xl rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Đăng ký Khu công nghiệp mới</h3>
                <p className="text-xs text-gray-500">Hồ sơ sẽ ở trạng thái chờ xác minh sau khi gửi.</p>
              </div>
              <button
                onClick={() => {
                  setShowIZModal(false);
                  resetNewIZForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateIZ} className="max-h-[80vh] overflow-y-auto px-6 py-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm text-gray-600">
                  Tên KCN *
                  <input
                    value={newIZForm.name}
                    onChange={(e) => setNewIZForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </label>
                <label className="text-sm text-gray-600">
                  Chủ đầu tư *
                  <input
                    value={newIZForm.owner}
                    onChange={(e) => setNewIZForm((prev) => ({ ...prev, owner: e.target.value }))}
                    required
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </label>
                <label className="text-sm text-gray-600">
                  Tỉnh/Thành *
                  <input
                    value={newIZForm.province}
                    onChange={(e) => setNewIZForm((prev) => ({ ...prev, province: e.target.value }))}
                    required
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </label>
                <label className="text-sm text-gray-600">
                  Quận/Huyện *
                  <input
                    value={newIZForm.district}
                    onChange={(e) => setNewIZForm((prev) => ({ ...prev, district: e.target.value }))}
                    required
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </label>
                <label className="text-sm text-gray-600 md:col-span-2">
                  Địa chỉ
                  <input
                    value={newIZForm.address}
                    onChange={(e) => setNewIZForm((prev) => ({ ...prev, address: e.target.value }))}
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </label>
                <label className="text-sm text-gray-600">
                  Email liên hệ
                  <input
                    type="email"
                    value={newIZForm.contactEmail}
                    onChange={(e) => setNewIZForm((prev) => ({ ...prev, contactEmail: e.target.value }))}
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </label>
                <label className="text-sm text-gray-600">
                  Số điện thoại
                  <input
                    value={newIZForm.contactPhone}
                    onChange={(e) => setNewIZForm((prev) => ({ ...prev, contactPhone: e.target.value }))}
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </label>
                <label className="text-sm text-gray-600">
                  Diện tích (ha)
                  <input
                    type="number"
                    value={newIZForm.area}
                    onChange={(e) => setNewIZForm((prev) => ({ ...prev, area: e.target.value }))}
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </label>
                <label className="text-sm text-gray-600">
                  Doanh nghiệp
                  <input
                    type="number"
                    value={newIZForm.totalCompanies}
                    onChange={(e) => setNewIZForm((prev) => ({ ...prev, totalCompanies: e.target.value }))}
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </label>
                <label className="text-sm text-gray-600">
                  Lao động
                  <input
                    type="number"
                    value={newIZForm.totalEmployees}
                    onChange={(e) => setNewIZForm((prev) => ({ ...prev, totalEmployees: e.target.value }))}
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </label>
                <label className="text-sm text-gray-600 md:col-span-2">
                  Ngành mũi nhọn (phân tách bởi dấu phẩy)
                  <input
                    value={typeof newIZForm.industries === 'string' ? newIZForm.industries : newIZForm.industries.join(', ')}
                    onChange={(e) => setNewIZForm((prev) => ({ ...prev, industries: e.target.value }))}
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </label>
                <label className="text-sm text-gray-600 md:col-span-2">
                  Mô tả
                  <textarea
                    value={newIZForm.description}
                    onChange={(e) => setNewIZForm((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </label>
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowIZModal(false);
                    resetNewIZForm();
                  }}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={creatingIZ}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {creatingIZ ? 'Đang gửi...' : 'Gửi phê duyệt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showIZLayoutModal && activeIZ && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 px-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Layout chuyên sâu - {activeIZ.name}</h3>
                <p className="text-xs text-gray-500">
                  Cập nhật đường dẫn layout để người xem bản đồ topology có thể mở sơ đồ chi tiết KCN.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowIZLayoutModal(false);
                  setActiveIZ(null);
                }}
                className="text-gray-500 hover:text-gray-700"
                type="button"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveIZLayout} className="px-6 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Đường dẫn layout (URL)</label>
                <input
                  value={izLayoutForm.layoutMapUrl}
                  onChange={(e) => setIZLayoutForm((prev) => ({ ...prev, layoutMapUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả layout</label>
                <textarea
                  value={izLayoutForm.layoutMapDescription}
                  onChange={(e) =>
                    setIZLayoutForm((prev) => ({ ...prev, layoutMapDescription: e.target.value }))
                  }
                  rows={3}
                  className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              {izLayoutForm.layoutMapUrl && (
                <div className="rounded-lg border border-gray-200 p-3 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Xem trước</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={izLayoutForm.layoutMapUrl}
                    alt={`Layout map preview of ${activeIZ.name}`}
                    className="w-full rounded-md border border-gray-200 object-contain max-h-64"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <a
                    href={izLayoutForm.layoutMapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
                  >
                    Mở layout trong tab mới →
                  </a>
                </div>
              )}
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowIZLayoutModal(false);
                    setActiveIZ(null);
                  }}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Lưu layout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showFactoryModal && activeFactory && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 px-4">
          <div className="w-full max-w-3xl rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Cập nhật thông tin nhà máy</h3>
                <p className="text-xs text-gray-500">Điều chỉnh hồ sơ chi tiết để đồng bộ với bản đồ và marketplace.</p>
              </div>
              <button
                onClick={() => {
                  setShowFactoryModal(false);
                  setActiveFactory(null);
                }}
                className="text-gray-500 hover:text-gray-700"
                type="button"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveFactoryDetails} className="px-6 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
                <textarea
                  value={factoryForm.description}
                  onChange={(e) => setFactoryForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Năng lực sản xuất</label>
                  <input
                    value={factoryForm.productionCapacity}
                    onChange={(e) => setFactoryForm((prev) => ({ ...prev, productionCapacity: e.target.value }))}
                    className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video xác minh (URL)</label>
                  <input
                    value={factoryForm.videoUrl}
                    onChange={(e) => setFactoryForm((prev) => ({ ...prev, videoUrl: e.target.value }))}
                    className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tài liệu chứng minh (phân tách bằng dấu phẩy)</label>
                <input
                  value={factoryForm.documentUrls}
                  onChange={(e) => setFactoryForm((prev) => ({ ...prev, documentUrls: e.target.value }))}
                  className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              {(factoryForm.videoUrl || factoryForm.documentUrls) && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-3">
                  {factoryForm.videoUrl && (
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-2">Video preview</p>
                      {factoryForm.videoUrl.includes('youtube') ? (
                        <div
                          className="w-full overflow-hidden rounded-md bg-black"
                          style={{ aspectRatio: '16 / 9' }}
                        >
                          <iframe
                            src={factoryForm.videoUrl.replace('watch?v=', 'embed/')}
                            className="h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="Factory verification video"
                          />
                        </div>
                      ) : (
                        <video src={factoryForm.videoUrl} controls className="w-full rounded-md" />
                      )}
                    </div>
                  )}
                  {factoryForm.documentUrls && (
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-2">Tài liệu đính kèm</p>
                      <ul className="space-y-1 text-xs text-blue-600">
                        {factoryForm.documentUrls
                          .split(',')
                          .map((url) => url.trim())
                          .filter(Boolean)
                          .map((url) => (
                            <li key={url}>
                              <a href={url} target="_blank" rel="noreferrer" className="hover:underline">
                                {url}
                              </a>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email liên hệ</label>
                  <input
                    type="email"
                    value={factoryForm.contactEmail}
                    onChange={(e) => setFactoryForm((prev) => ({ ...prev, contactEmail: e.target.value }))}
                    className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input
                    value={factoryForm.contactPhone}
                    onChange={(e) => setFactoryForm((prev) => ({ ...prev, contactPhone: e.target.value }))}
                    className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowFactoryModal(false);
                    setActiveFactory(null);
                  }}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProductModal && activeProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 px-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa sản phẩm</h3>
                <p className="text-xs text-gray-500">Cập nhật nội dung hiển thị trên marketplace.</p>
              </div>
              <button
                onClick={() => {
                  setShowProductModal(false);
                  setActiveProduct(null);
                }}
                className="text-gray-500 hover:text-gray-700"
                type="button"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveProductDetails} className="px-6 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả sản phẩm</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VND)</label>
                  <input
                    type="number"
                    min={0}
                    value={productForm.price}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
                    className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">MOQ</label>
                  <input
                    type="number"
                    min={1}
                    value={productForm.minOrder}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, minOrder: e.target.value }))}
                    className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chứng nhận (phân tách bằng dấu phẩy)</label>
                <input
                  value={productForm.certifications}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, certifications: e.target.value }))}
                  className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Media URLs (phân tách bằng dấu phẩy)</label>
                <input
                  value={productForm.mediaUrls}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, mediaUrls: e.target.value }))}
                  className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              {productForm.mediaUrls && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Media preview</p>
                  <div className="flex flex-wrap gap-3">
                    {productForm.mediaUrls
                      .split(',')
                      .map((url) => url.trim())
                      .filter(Boolean)
                      .map((url) => (
                        <div key={url} className="w-32">
                          <div className="h-24 w-full overflow-hidden rounded-md border border-gray-200 bg-white">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={url}
                              alt="Product media preview"
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 block truncate text-xs text-blue-600 hover:text-blue-800"
                          >
                            {url}
                          </a>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowProductModal(false);
                    setActiveProduct(null);
                  }}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Lưu sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

