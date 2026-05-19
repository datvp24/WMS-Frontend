import { useEffect, useState, useRef, useCallback } from "react";
import type { InventoryChange } from "../types/iinventory";
import { inventorySocket } from "../lib/ws/inventory.ws";

export function useInventoryChangesWS() {
  const [changes, setChanges] = useState<InventoryChange[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const readRef = useRef(0);

  useEffect(() => {
    inventorySocket.connect();

    const handler = (payload: any) => {
      const change: InventoryChange = {
        id: crypto.randomUUID(),

        productId: payload.productId,
        productName: payload.productName,
        productCode: payload.productCode,

        locationCode: payload.locationCode,
        warehouseName: payload.warehouseName,

        lotCode: payload.lotCode,

        field: payload.field,

        oldValue: payload.oldValue,
        newValue: payload.newValue,

        delta: payload.delta,

        changedAt: payload.changedAt,
      };

      setChanges((prev) => {
        setUnreadCount((c) => c + 1);
        return [change, ...prev];
      });
    };

    inventorySocket.subscribe(handler);

    return () => {
      inventorySocket.unsubscribe(handler);
    };
  }, []);

  const markAllRead = useCallback(() => {
    readRef.current = changes.length;
    setUnreadCount(0);
  }, [changes.length]);

  const clearChanges = useCallback(() => {
    setChanges([]);
    setUnreadCount(0);
  }, []);

  const changesByInventoryId = new Map<string, InventoryChange[]>();

  for (const c of changes) {
    const key = `${c.productId}-${c.locationCode}-${c.lotCode}`;

    if (!changesByInventoryId.has(key)) {
      changesByInventoryId.set(key, []);
    }

    changesByInventoryId.get(key)!.push(c);
  }

  const changedIds = new Set<string>();

  const unread = changes.slice(readRef.current);

  for (const c of unread) {
    changedIds.add(`${c.productId}-${c.locationCode}-${c.lotCode}`);
  }

  return {
    changes,
    unreadCount,
    markAllRead,
    clearChanges,
    changesByInventoryId,
    changedIds,
    isPolling: true,
  };
}