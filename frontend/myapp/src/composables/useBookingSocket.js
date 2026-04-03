import { onUnmounted } from "vue";

export function useBookingSocket(onNewBooking) {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const ws = new WebSocket(`${protocol}://${window.location.host}/ws`);

  ws.onmessage = () => {
    onNewBooking();
  };

  onUnmounted(() => {
    ws.close();
  });
}
