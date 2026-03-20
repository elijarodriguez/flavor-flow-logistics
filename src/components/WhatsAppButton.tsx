import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const phone = "639757982690"; // Philippines format
  const message = encodeURIComponent("Hi! I'm interested in Jimmela Food Products. Can I get more details?");

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-full px-5 py-3 shadow-lg hover:shadow-xl transition-all duration-300 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="text-sm font-semibold hidden sm:inline group-hover:inline">Chat with us</span>
    </a>
  );
}
