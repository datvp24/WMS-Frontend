// File: src/lib/ws/inventory.ws.ts

type InventoryMessageHandler = (data: any) => void;

class InventorySocket {
  private ws: WebSocket | null = null;
  private handlers: Set<InventoryMessageHandler> = new Set();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldReconnect = true;

  private getUrl(): string {
    // ✅ Fallback tự động từ HTTP URL nếu không có VITE_WS_URL
    const explicit = import.meta.env.VITE_WS_URL as string | undefined;
    if (explicit) return explicit;

    // Tự chuyển http://localhost:5201 → ws://localhost:5201/ws/inventory
    const apiBase = (import.meta.env.VITE_API_URL as string | undefined) ?? "";
    const wsBase  = apiBase.replace(/^http/, "ws").replace(/\/api.*$/, "");
    return `${wsBase}/ws/inventory`;
  }

  connect() {
    // Tránh connect trùng
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return;
    if (this.ws && this.ws.readyState === WebSocket.CONNECTING) return;

    const url = this.getUrl();
    console.log("[WS] Connecting to", url);

    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log("[WS] Connected ✓");
      // Huỷ timer reconnect nếu đã kết nối thành công
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handlers.forEach((h) => h(data));
      } catch (err) {
        console.error("[WS] Invalid message:", err);
      }
    };

    this.ws.onclose = (e) => {
      console.warn("[WS] Disconnected", e.code, e.reason);
      this.ws = null;

      // ✅ Auto-reconnect chỉ khi còn subscriber và chưa bị disconnect chủ động
      if (this.shouldReconnect && this.handlers.size > 0) {
        this.reconnectTimer = setTimeout(() => this.connect(), 3000);
      }
    };

    this.ws.onerror = (err) => {
      console.error("[WS] Error:", err);
      // onclose sẽ được gọi tiếp theo → reconnect xử lý ở đó
    };
  }

  subscribe(cb: InventoryMessageHandler) {
    this.handlers.add(cb);
    this.shouldReconnect = true;

    if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
      this.connect();
    }
  }

  unsubscribe(cb: InventoryMessageHandler) {
    this.handlers.delete(cb);

    // Nếu không còn ai subscribe, đóng hẳn
    if (this.handlers.size === 0) {
      this.disconnect();
    }
  }

  disconnect() {
    this.shouldReconnect = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.ws?.close();
    this.ws = null;
  }
}

// Singleton — dùng chung toàn app
export const inventorySocket = new InventorySocket();