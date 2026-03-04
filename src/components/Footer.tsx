export function Footer() {
  return (
    <footer className="bg-foreground py-8 px-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-display text-lg font-bold" style={{ color: "hsl(30 25% 97%)" }}>
          Kusina<span className="text-primary">Foods</span>
        </span>
        <p className="text-sm" style={{ color: "hsl(30 15% 60%)" }}>
          © {new Date().getFullYear()} KusinaFoods. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
