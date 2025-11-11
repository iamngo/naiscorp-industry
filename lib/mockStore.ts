'use server';

import { promises as fs } from 'fs';
import path from 'path';
import {
  mockFactories,
  mockServices,
  mockIndustrialZones,
  mockSuppliers,
  mockProducts,
  mockBuyerLeads,
  mockInvestorDeals,
  mockContentQueue,
  mockUsers,
} from '@/lib/mockData';
import type {
  Factory,
  Service,
  ConnectionRequest,
  IndustrialZone,
  Supplier,
  AdminLog,
  Product,
  BuyerLead,
  InvestorDeal,
  InvestmentPlan,
  ContentItem,
  User,
} from '@/types/database';

type MockStoreData = {
  factories: Factory[];
  services: Service[];
  connectionRequests: ConnectionRequest[];
  industrialZones: IndustrialZone[];
  suppliers: Supplier[];
  adminLogs: AdminLog[];
  products: Product[];
  buyerLeads: BuyerLead[];
  investorDeals: InvestorDeal[];
  investmentPlans: InvestmentPlan[];
  contentQueue: ContentItem[];
  users: User[];
};

const DATA_DIRECTORY = path.join(process.cwd(), 'data');
const DATA_FILE_PATH = path.join(DATA_DIRECTORY, 'mock-store.json');

let storeCache: MockStoreData | null = null;

function clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

async function ensureCache(): Promise<MockStoreData> {
  if (storeCache) {
    return storeCache;
  }

  try {
    const raw = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);

    storeCache = {
      factories: Array.isArray(parsed.factories) ? parsed.factories : clone(mockFactories),
      services: Array.isArray(parsed.services) ? parsed.services : clone(mockServices),
      connectionRequests: Array.isArray(parsed.connectionRequests)
        ? parsed.connectionRequests
        : [],
      industrialZones: Array.isArray(parsed.industrialZones)
        ? parsed.industrialZones
        : clone(mockIndustrialZones),
      suppliers: Array.isArray(parsed.suppliers) ? parsed.suppliers : clone(mockSuppliers),
      adminLogs: Array.isArray(parsed.adminLogs) ? parsed.adminLogs : [],
      products: Array.isArray(parsed.products) ? parsed.products : clone(mockProducts),
      buyerLeads: Array.isArray(parsed.buyerLeads) ? parsed.buyerLeads : clone(mockBuyerLeads),
      investorDeals: Array.isArray(parsed.investorDeals) ? parsed.investorDeals : clone(mockInvestorDeals),
      investmentPlans: Array.isArray(parsed.investmentPlans) ? parsed.investmentPlans : [],
      contentQueue: Array.isArray(parsed.contentQueue) ? parsed.contentQueue : clone(mockContentQueue),
      users: Array.isArray(parsed.users) ? parsed.users : clone(mockUsers),
    };
  } catch {
    storeCache = {
      factories: clone(mockFactories),
      services: clone(mockServices),
      connectionRequests: [],
      industrialZones: clone(mockIndustrialZones),
      suppliers: clone(mockSuppliers),
      adminLogs: [],
      products: clone(mockProducts),
      buyerLeads: clone(mockBuyerLeads),
      investorDeals: clone(mockInvestorDeals),
      investmentPlans: [],
      contentQueue: clone(mockContentQueue),
      users: clone(mockUsers),
    };
    await persistStore();
  }

  return storeCache;
}

async function persistStore() {
  if (!storeCache) return;
  await fs.mkdir(DATA_DIRECTORY, { recursive: true });
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(storeCache, null, 2), 'utf-8');
}

/**
 * Factories helpers
 */
export async function getAllFactories(): Promise<Factory[]> {
  const store = await ensureCache();
  return clone(store.factories);
}

export async function getFactory(id: string): Promise<Factory | undefined> {
  const store = await ensureCache();
  const factory = store.factories.find((item) => item.id === id);
  return factory ? clone(factory) : undefined;
}

export async function addFactory(factory: Factory): Promise<Factory> {
  const store = await ensureCache();
  if (
    !store.industrialZones.some((iz) => iz.id === factory.izId) &&
    !mockIndustrialZones.some((iz) => iz.id === factory.izId)
  ) {
    throw new Error(`Industrial zone ${factory.izId} không tồn tại trong mock-store`);
  }
  store.factories.push(clone(factory));
  await persistStore();
  return clone(factory);
}

export async function updateFactory(
  id: string,
  updates: Partial<Factory>,
): Promise<Factory | undefined> {
  const store = await ensureCache();
  const index = store.factories.findIndex((item) => item.id === id);
  if (index === -1) {
    return undefined;
  }

  const updated: Factory = {
    ...store.factories[index],
    ...clone(updates),
  };

  if (
    !store.industrialZones.some((iz) => iz.id === updated.izId) &&
    !mockIndustrialZones.some((iz) => iz.id === updated.izId)
  ) {
    throw new Error(`Industrial zone ${updated.izId} không tồn tại trong mock-store`);
  }
  store.factories[index] = updated;
  await persistStore();
  return clone(updated);
}

export async function deleteFactory(id: string): Promise<boolean> {
  const store = await ensureCache();
  const index = store.factories.findIndex((item) => item.id === id);
  if (index === -1) {
    return false;
  }

  store.factories.splice(index, 1);
  await persistStore();
  return true;
}

/**
 * Services helpers
 */
export async function getAllServices(): Promise<Service[]> {
  const store = await ensureCache();
  return clone(store.services);
}

export async function getService(id: string): Promise<Service | undefined> {
  const store = await ensureCache();
  const service = store.services.find((item) => item.id === id);
  return service ? clone(service) : undefined;
}

export async function addService(service: Service): Promise<Service> {
  const store = await ensureCache();
  store.services.push(clone(service));
  await persistStore();
  return clone(service);
}

export async function updateService(
  id: string,
  updates: Partial<Service>,
): Promise<Service | undefined> {
  const store = await ensureCache();
  const index = store.services.findIndex((item) => item.id === id);
  if (index === -1) {
    return undefined;
  }

  const updated: Service = {
    ...store.services[index],
    ...clone(updates),
  };

  store.services[index] = updated;
  await persistStore();
  return clone(updated);
}

export async function deleteService(id: string): Promise<boolean> {
  const store = await ensureCache();
  const index = store.services.findIndex((item) => item.id === id);
  if (index === -1) {
    return false;
  }

  store.services.splice(index, 1);
  await persistStore();
  return true;
}

/**
 * Connection requests helpers
 */
export async function getAllConnectionRequests(): Promise<ConnectionRequest[]> {
  const store = await ensureCache();
  return clone(store.connectionRequests);
}

export async function addConnectionRequest(
  request: ConnectionRequest,
): Promise<ConnectionRequest> {
  const store = await ensureCache();
  store.connectionRequests.push(clone(request));
  await persistStore();
  return clone(request);
}

export async function updateConnectionRequest(
  id: string,
  updates: Partial<ConnectionRequest>,
): Promise<ConnectionRequest | undefined> {
  const store = await ensureCache();
  const index = store.connectionRequests.findIndex((item) => item.id === id);
  if (index === -1) {
    return undefined;
  }

  const updated: ConnectionRequest = {
    ...store.connectionRequests[index],
    ...clone(updates),
  };

  store.connectionRequests[index] = updated;
  await persistStore();
  return clone(updated);
}

/**
 * Industrial zones helpers
 */
export async function getAllIndustrialZones(): Promise<IndustrialZone[]> {
  const store = await ensureCache();
  return clone(store.industrialZones);
}

export async function getIndustrialZone(id: string): Promise<IndustrialZone | undefined> {
  const store = await ensureCache();
  const iz = store.industrialZones.find((item) => item.id === id);
  return iz ? clone(iz) : undefined;
}

export async function addIndustrialZone(zone: IndustrialZone): Promise<IndustrialZone> {
  const store = await ensureCache();
  store.industrialZones.push(clone(zone));
  await persistStore();
  return clone(zone);
}

export async function updateIndustrialZone(
  id: string,
  updates: Partial<IndustrialZone>,
): Promise<IndustrialZone | undefined> {
  const store = await ensureCache();
  const index = store.industrialZones.findIndex((item) => item.id === id);
  if (index === -1) {
    return undefined;
  }

  const updated: IndustrialZone = {
    ...store.industrialZones[index],
    ...clone(updates),
  };

  store.industrialZones[index] = updated;
  await persistStore();
  return clone(updated);
}

export async function deleteIndustrialZone(id: string): Promise<boolean> {
  const store = await ensureCache();
  const index = store.industrialZones.findIndex((item) => item.id === id);
  if (index === -1) {
    return false;
  }

  store.industrialZones.splice(index, 1);
  await persistStore();
  return true;
}

export async function getAdminLogs(): Promise<AdminLog[]> {
  const store = await ensureCache();
  return clone(store.adminLogs);
}

export async function addAdminLog(log: AdminLog): Promise<AdminLog> {
  const store = await ensureCache();
  store.adminLogs.push(clone(log));
  await persistStore();
  return clone(log);
}

export async function getAllSuppliers(): Promise<Supplier[]> {
  const store = await ensureCache();
  return clone(store.suppliers);
}

export async function getSupplier(id: string): Promise<Supplier | undefined> {
  const store = await ensureCache();
  const supplier = store.suppliers.find((item) => item.id === id);
  return supplier ? clone(supplier) : undefined;
}

export async function updateSupplier(
  id: string,
  updates: Partial<Supplier>,
): Promise<Supplier | undefined> {
  const store = await ensureCache();
  const index = store.suppliers.findIndex((item) => item.id === id);
  if (index === -1) {
    return undefined;
  }

  const updated: Supplier = {
    ...store.suppliers[index],
    ...clone(updates),
    updatedAt: updates.updatedAt ?? new Date().toISOString(),
  };

  store.suppliers[index] = updated;
  await persistStore();
  return clone(updated);
}

/**
 * Product helpers
 */
export async function getAllProducts(): Promise<Product[]> {
  const store = await ensureCache();
  return clone(store.products);
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const store = await ensureCache();
  const product = store.products.find((item) => item.id === id);
  return product ? clone(product) : undefined;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
  const store = await ensureCache();
  const index = store.products.findIndex((item) => item.id === id);
  if (index === -1) {
    return undefined;
  }

  const updated: Product = {
    ...store.products[index],
    ...clone(updates),
    updatedAt: updates.updatedAt ?? new Date().toISOString(),
  };

  store.products[index] = updated;
  await persistStore();
  return clone(updated);
}

/**
 * Buyer pipeline helpers
 */
export async function getBuyerLeads(): Promise<BuyerLead[]> {
  const store = await ensureCache();
  return clone(store.buyerLeads);
}

export async function updateBuyerLead(
  id: string,
  updates: Partial<BuyerLead>,
): Promise<BuyerLead | undefined> {
  const store = await ensureCache();
  const index = store.buyerLeads.findIndex((item) => item.id === id);
  if (index === -1) {
    return undefined;
  }

  const updated: BuyerLead = {
    ...store.buyerLeads[index],
    ...clone(updates),
  };

  store.buyerLeads[index] = updated;
  await persistStore();
  return clone(updated);
}

/**
 * Investor pipeline helpers
 */
export async function getInvestorDeals(): Promise<InvestorDeal[]> {
  const store = await ensureCache();
  return clone(store.investorDeals);
}

export async function updateInvestorDeal(
  id: string,
  updates: Partial<InvestorDeal>,
): Promise<InvestorDeal | undefined> {
  const store = await ensureCache();
  const index = store.investorDeals.findIndex((item) => item.id === id);
  if (index === -1) {
    return undefined;
  }

  const updated: InvestorDeal = {
    ...store.investorDeals[index],
    ...clone(updates),
  };

  store.investorDeals[index] = updated;
  await persistStore();
  return clone(updated);
}

/**
 * Investment plan helpers
 */
export async function getInvestmentPlans(): Promise<InvestmentPlan[]> {
  const store = await ensureCache();
  return clone(store.investmentPlans);
}

export async function addInvestmentPlan(plan: InvestmentPlan): Promise<InvestmentPlan> {
  const store = await ensureCache();
  store.investmentPlans.push(clone(plan));
  await persistStore();
  return clone(plan);
}

export async function updateInvestmentPlan(
  id: string,
  updates: Partial<InvestmentPlan>,
): Promise<InvestmentPlan | undefined> {
  const store = await ensureCache();
  const index = store.investmentPlans.findIndex((item) => item.id === id);
  if (index === -1) {
    return undefined;
  }

  const updated: InvestmentPlan = {
    ...store.investmentPlans[index],
    ...clone(updates),
    updatedAt: updates.updatedAt ?? new Date().toISOString(),
  };

  store.investmentPlans[index] = updated;
  await persistStore();
  return clone(updated);
}

/**
 * Content items
 */
export async function getContentQueue(): Promise<ContentItem[]> {
  const store = await ensureCache();
  return clone(store.contentQueue);
}

export async function updateContentItem(
  id: string,
  updates: Partial<ContentItem>,
): Promise<ContentItem | undefined> {
  const store = await ensureCache();
  const index = store.contentQueue.findIndex((item) => item.id === id);
  if (index === -1) {
    return undefined;
  }

  const updated: ContentItem = {
    ...store.contentQueue[index],
    ...clone(updates),
  };

  store.contentQueue[index] = updated;
  await persistStore();
  return clone(updated);
}

/**
 * Users
 */
export async function getUsers(): Promise<User[]> {
  const store = await ensureCache();
  return clone(store.users);
}

export async function updateUser(
  id: string,
  updates: Partial<User>,
): Promise<User | undefined> {
  const store = await ensureCache();
  const index = store.users.findIndex((item) => item.id === id);
  if (index === -1) {
    return undefined;
  }

  const updated: User = {
    ...store.users[index],
    ...clone(updates),
    updatedAt: updates.updatedAt ?? new Date().toISOString(),
  };

  store.users[index] = updated;
  await persistStore();
  return clone(updated);
}
