import { onUnmounted } from "vue";

export function useBookingSocket(onNewBooking) {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const ws = new WebSocket(`${protocol}://${window.location.host}/ws`);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "new_booking") {
      onNewBooking(data);
    }
  };

  onUnmounted(() => {
    ws.close();
  });
}
