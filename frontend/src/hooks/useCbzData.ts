import { useState, useEffect, useCallback } from 'react';
import { cbzApi } from '../services/api';
import { strapiApi } from '../services/strapi';
import { ANNOUNCEMENTS, CONTACT_CHANNELS, Announcement, ContactChannel } from '../data/announcementsData';
import { BILLERS } from '../data/cbzData';
import { Biller, ProductItem } from '../types';

/**
 * Hook to retrieve announcements dynamically with 3-tier cascade:
 * 1. Strapi Headless CMS (live editorial)
 * 2. Django Core REST API (backup)
 * 3. Local bundled data (offline fallback)
 */
export function useAnnouncements(category?: string) {
  const [data, setData] = useState<Announcement[]>(() => {
    if (!category || category === 'all') return ANNOUNCEMENTS;
    return ANNOUNCEMENTS.filter((item) => item.category === category);
  });
  const [isLive, setIsLive] = useState(false);
  const [source, setSource] = useState<'strapi' | 'django' | 'local'>('local');
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      // Priority 1: Strapi Headless CMS
      try {
        const strapiData = await strapiApi.getAnnouncements(category);
        if (Array.isArray(strapiData) && strapiData.length > 0) {
          setData(strapiData);
          setIsLive(true);
          setSource('strapi');
          return;
        }
      } catch {
        // Fall through to Django Core API
      }

      // Priority 2: Django REST Framework API
      const params = category && category !== 'all' ? { category } : undefined;
      const remoteData = await cbzApi.announcements.getAll(params);
      if (Array.isArray(remoteData) && remoteData.length > 0) {
        setData(remoteData as Announcement[]);
        setIsLive(true);
        setSource('django');
        return;
      }
    } catch {
      // Retain fallback static data silently on network failure
      setIsLive(false);
      setSource('local');
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return { announcements: data, isLive, source, loading, refresh: fetchAnnouncements };
}

/**
 * Hook to fetch top urgent notices for the top announcement ticker bar.
 */
export function useUrgentAnnouncements() {
  const [data, setData] = useState<Announcement[]>(() =>
    ANNOUNCEMENTS.filter((a) => a.isUrgent)
  );
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      // Priority 1: Strapi CMS
      try {
        const strapiData = await strapiApi.getUrgentAnnouncements();
        if (isMounted && Array.isArray(strapiData) && strapiData.length > 0) {
          setData(strapiData);
          setIsLive(true);
          return;
        }
      } catch {}

      // Priority 2: Django REST API
      try {
        const remoteData = await cbzApi.announcements.getUrgent();
        if (isMounted && Array.isArray(remoteData) && remoteData.length > 0) {
          setData(remoteData as Announcement[]);
          setIsLive(true);
          return;
        }
      } catch {}
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return { urgentAnnouncements: data, isLive };
}

/**
 * Hook to retrieve verified contact channels dynamically.
 */
export function useContactChannels() {
  const [channels, setChannels] = useState<ContactChannel[]>(CONTACT_CHANNELS);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let isMounted = true;
    cbzApi.contactChannels
      .getAll()
      .then((remoteChannels) => {
        if (isMounted && Array.isArray(remoteChannels) && remoteChannels.length > 0) {
          setChannels(remoteChannels as ContactChannel[]);
          setIsLive(true);
        }
      })
      .catch(() => {
        // Fallback retained
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { channels, isLive };
}

/**
 * Hook to retrieve active billers dynamically from PostgreSQL.
 */
export function useBillers() {
  const [billers, setBillers] = useState<Biller[]>(BILLERS);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let isMounted = true;
    cbzApi.billers
      .getAll()
      .then((remoteBillers) => {
        if (isMounted && Array.isArray(remoteBillers) && remoteBillers.length > 0) {
          setBillers(remoteBillers as Biller[]);
          setIsLive(true);
        }
      })
      .catch(() => {
        // Fallback retained
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { billers, isLive };
}

/**
 * Hook to fetch subsidiary grouped products dynamically from Django.
 */
export function useGroupedProducts(
  subsidiary: string,
  fallbackMap: Record<string, ProductItem[]>
) {
  const [products, setProducts] = useState<Record<string, ProductItem[]>>(fallbackMap);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let isMounted = true;
    cbzApi.products
      .getGrouped(subsidiary)
      .then((grouped) => {
        if (isMounted && grouped && Object.keys(grouped).length > 0) {
          // Merge with fallback to preserve any custom client-side metadata
          const merged: Record<string, ProductItem[]> = { ...fallbackMap };
          for (const [category, items] of Object.entries(grouped)) {
            if (Array.isArray(items) && items.length > 0) {
              merged[category] = items.map((item) => ({
                id: item.id || item.item_id || `${subsidiary}-${item.name}`,
                name: item.name,
                description: item.description,
                pricing: item.pricing,
                icon: item.icon,
                image: item.image,
              }));
            }
          }
          setProducts(merged);
          setIsLive(true);
        }
      })
      .catch(() => {
        // Fallback retained
      });
    return () => {
      isMounted = false;
    };
  }, [subsidiary]);

  return { products, isLive };
}
