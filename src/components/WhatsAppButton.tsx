import { MessageCircle, ExternalLink } from "lucide-react";

export function WhatsAppButton() {
  const facebookPageUrl = "https://www.facebook.com/search/top?q=Jimmela%20Food%20Products";

  return (
    <a
      href={facebookPageUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-border bg-primary px-5 py-3 text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-xl group"
      aria-label="Open Facebook page"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="text-sm font-semibold hidden sm:inline">Chat with us</span>
      <ExternalLink className="hidden h-4 w-4 sm:inline" />
    </a>
  );
}
