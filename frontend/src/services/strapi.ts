/**
 * CBZ Holdings — Strapi Headless CMS Client
 * Handles fetching marketing announcements, corporate facts, and editorial media.
 * Supports both Strapi v4 and v5 REST response schemas seamlessly.
 */

import { Announcement, ContactChannel } from '../data/announcementsData';

const STRAPI_BASE_URL =
  (import.meta as any).env?.VITE_STRAPI_URL || 'http://localhost:1337/api';

/**
 * Normalizes a Strapi entity record regardless of v4/v5 nesting.
 */
function normalizeRecord<T>(record: any): T {
  if (!record) return record;
  const id = record.documentId || record.id;
  const attributes = record.attributes || record;
  return {
    ...attributes,
    id: String(id),
  };
}

/**
 * Core Strapi fetch helper
 */
async function strapiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${STRAPI_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    },
  });

  if (!response.ok) {
    throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  return json;
}

export const strapiApi = {
  /**
   * Fetches published announcements from Strapi CMS.
   */
  async getAnnouncements(category?: string): Promise<Announcement[]> {
    let query = '/announcements?populate=*&sort=publishDate:desc';
    if (category && category !== 'all') {
      query += `&filters[category][$eq]=${encodeURIComponent(category)}`;
    }

    const res = await strapiFetch<{ data: any[] }>(query);
    if (!res || !Array.isArray(res.data)) return [];

    return res.data.map((item) => {
      const doc = normalizeRecord<any>(item);
      return {
        id: String(doc.id),
        title: doc.title,
        summary: doc.summary,
        category: (doc.category || 'customer') as 'customer' | 'shareholder' | 'regulatory',
        date: doc.publishDate || doc.createdAt || new Date().toISOString().split('T')[0],
        isUrgent: Boolean(doc.isUrgent),
        circularRef: doc.officialRef || doc.circularRef || undefined,
        tag: doc.tag || (doc.category ? doc.category.toUpperCase() : 'NOTICE'),
        fileSize: doc.fileSize || undefined,
      };
    });
  },

  /**
   * Fetches urgent notices for the top announcement ticker bar.
   */
  async getUrgentAnnouncements(): Promise<Announcement[]> {
    const query = '/announcements?filters[isUrgent][$eq]=true&populate=*&sort=publishDate:desc';
    const res = await strapiFetch<{ data: any[] }>(query);
    if (!res || !Array.isArray(res.data)) return [];

    return res.data.map((item) => {
      const doc = normalizeRecord<any>(item);
      return {
        id: String(doc.id),
        title: doc.title,
        summary: doc.summary,
        category: (doc.category || 'customer') as 'customer' | 'shareholder' | 'regulatory',
        date: doc.publishDate || doc.createdAt || new Date().toISOString().split('T')[0],
        isUrgent: true,
        circularRef: doc.officialRef || doc.circularRef || undefined,
        tag: doc.tag || 'URGENT',
        fileSize: doc.fileSize || undefined,
      };
    });
  },

  /**
   * Fetches key corporate statistics and facts from Strapi CMS.
   */
  async getCorporateFacts(): Promise<Record<string, string>> {
    const query = '/corporate-facts?populate=*';
    const res = await strapiFetch<{ data: any[] }>(query);
    if (!res || !Array.isArray(res.data)) return {};

    const facts: Record<string, string> = {};
    for (const item of res.data) {
      const doc = normalizeRecord<any>(item);
      if (doc.key && doc.value) {
        facts[doc.key] = doc.value;
      }
    }
    return facts;
  },
};
