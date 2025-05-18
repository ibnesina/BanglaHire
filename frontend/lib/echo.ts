import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Make Pusher globally available for Laravel Echo
// This is important because Echo expects `window.Pusher` to exist in browser
if (typeof window !== "undefined") {
  (window as any).Pusher = Pusher;
}

const echo = new Echo({
  broadcaster: "pusher",
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
  forceTLS: true,
  encrypted: true,
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  },
});

export default echo;
