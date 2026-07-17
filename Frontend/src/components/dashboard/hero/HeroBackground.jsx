export default function HeroBackground() {
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, #040c1d 0%, #081326 40%, #060f1f 75%, #030a18 100%)',
        }}
      />

      <div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none animate-pulse"
        style={{
          background:
            'radial-gradient(circle, rgba(37,99,235,0.22) 0%, rgba(59,130,246,0.08) 45%, transparent 70%)',
          animationDuration: '5s',
        }}
      />

      <div
        className="absolute top-1/2 -translate-y-1/2 -left-24 w-96 h-96 rounded-full pointer-events-none animate-pulse"
        style={{
          background:
            'radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 65%)',
          animationDuration: '7s',
          animationDelay: '1.5s',
        }}
      />

      <div
        className="absolute -bottom-24 right-1/3 w-72 h-72 rounded-full pointer-events-none animate-pulse"
        style={{
          background:
            'radial-gradient(circle, rgba(96,165,250,0.09) 0%, transparent 65%)',
          animationDuration: '6s',
          animationDelay: '3s',
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(96,165,250,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.045) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.06) 0%, transparent 60%)',
        }}
      />

      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(4,12,29,0.5) 0%, transparent 100%)',
        }}
      />
    </>
  );
}
